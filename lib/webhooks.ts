import { db } from "@/lib/db";

export type WebhookEvent =
  | "incident.opened"
  | "incident.resolved";

export async function sendWebhookAlerts(input: {
  userId: string;
  event: WebhookEvent;
  monitor: { id: string; name: string; url: string; type: string };
  status: "up" | "down";
  responseTime: number;
  at: Date;
}) {

  const contacts = await db.alertContact.findMany({
    where: {
      userId: input.userId,
      enabled: true,
      type: "Webhook"
    },
    select: {
      id: true,
      value: true
    }
  });

  if (!contacts.length) return;

  const previousStatus =
    input.event === "incident.opened" ? "up" : "down";

  const incidentState =
    input.event === "incident.opened"
      ? "ongoing"
      : "resolved";

  const statusColor = input.event === "incident.opened" ? "#dc2626" : "#16a34a";
  const statusText = input.event === "incident.opened" ? "DOWN" : "UP";

  // Using an HTML payload formatted for direct injection into Make.com email/messaging nodes
  const htmlPayload = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: ${statusColor}; margin-top: 0;">MouNa Monitoring Alert: ${input.monitor.name} is ${statusText}</h2>
        <p><strong>Monitor:</strong> <a href="${input.monitor.url}">${input.monitor.name}</a></p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
        <p><strong>Time:</strong> ${input.at.toLocaleString()}</p>
        <p><strong>Response Time:</strong> ${input.responseTime}ms</p>
        <p><strong>Incident State:</strong> ${incidentState}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">Sent by MouNa Monitoring Webhooks</p>
      </div>
    </body>
    </html>
  `.trim();

  const results = await Promise.allSettled(
    contacts.map(async (contact) => {

      let url: URL;

      try {
        url = new URL(contact.value);
      } catch {
        console.warn(
          "[webhook] Invalid URL stored",
          contact.id
        );
        return;
      }

      const response = await fetch(url.toString(), {
        method: "POST",

        headers: {
          "Content-Type": "text/html",
          "User-Agent": "mouna-uptime-webhook/1.0",
          "x-mouna-event": input.event
        },

        body: htmlPayload,

        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn("[webhook] Non-2xx response", {
          contactId: contact.id,
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          event: input.event,
          monitorId: input.monitor.id
        });
      }
    })
  );

  const rejected = results.filter(
    (r) => r.status === "rejected"
  );

  if (rejected.length) {
    console.warn("[webhook] Delivery failures", {
      count: rejected.length,
      event: input.event,
      monitorId: input.monitor.id
    });
  }
}