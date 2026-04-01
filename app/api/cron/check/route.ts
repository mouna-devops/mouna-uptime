import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWebhookAlerts } from "@/lib/webhooks";
import { sendPersonalEmailAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Protect the endpoint from unauthorized pings
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized: Invalid secret" }, { status: 401 });
    }

    console.log(`[${new Date().toISOString()}] Running Cron monitor checks...`);
    
    // Fetch active monitors including their most recent check
    const monitors = await db.monitor.findMany({
      where: { status: { not: "paused" } },
      include: { checks: { orderBy: { createdAt: "desc" }, take: 1 } }
    });
    
    const now = new Date();
    let checksRun = 0;
    
    // Use Promise.all to test all monitors concurrently for maximum speed 
    // to prevent serverless function timeouts on Netlify.
    await Promise.all(monitors.map(async (monitor) => {
      const lastCheck = monitor.checks.length > 0 ? monitor.checks[0].createdAt : new Date(0);
      const minutesSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60);

      // Only check if time elapsed is greater than or equal to the monitor's expected interval
      if (minutesSinceLastCheck >= monitor.interval - 0.1) {
        console.log(`[${new Date().toISOString()}] Checking ${monitor.name} (${monitor.url})`);
        const startTime = performance.now();
        let isUp = false;
        
        try {
          if (monitor.type.includes("HTTP")) {
            // Using custom timeout for each fetch to prevent hanging requests indefinitely
            const customTimeout = monitor.timeout ? monitor.timeout * 1000 : 8000;
            const response = await fetch(monitor.url, { method: "GET", signal: AbortSignal.timeout(customTimeout) });
            isUp = response.ok;
          } else {
            isUp = true; // Mock implementation for Ping/Port demo
          }
        } catch (error) {
          isUp = false;
        }
        
        const responseTime = Math.round(performance.now() - startTime);
        const newStatus = isUp ? "up" : "down";
        
        await db.check.create({
          data: {
            monitorId: monitor.id,
            status: newStatus,
            responseTime,
          }
        });
        
        if (monitor.status === "up" && newStatus === "down") {
          await db.incident.create({
            data: {
              monitorId: monitor.id,
              status: "ongoing",
              errorType: "Connection Failed or Timeout"
            }
          });
          console.log(`!! INCIDENT CREATED for ${monitor.name}`);
          try {
            if (monitor.isPersonalAlert && monitor.personalAlertEmail) {
              const html = `<h2>MouNa Monitoring Alert</h2><p>Your monitor <b>${monitor.name}</b> is down.</p><p>URL: ${monitor.url}</p><p>Time: ${now.toLocaleString()}</p>`;
              await sendPersonalEmailAlert(monitor.personalAlertEmail, `[DOWN] ${monitor.name} is down`, html);
            } else {
              await sendWebhookAlerts({
                userId: monitor.userId,
                event: "incident.opened",
                monitor: { id: monitor.id, name: monitor.name, url: monitor.url, type: monitor.type },
                status: "down",
                responseTime,
                at: now,
              });
            }
          } catch (err) {
            console.warn("!! ALERT FAILED (opened)", err);
          }
        } else if (monitor.status === "down" && newStatus === "up") {
          await db.incident.updateMany({
            where: { monitorId: monitor.id, status: "ongoing" },
            data: { status: "resolved", resolvedAt: now }
          });
          console.log(`!! INCIDENT RESOLVED for ${monitor.name}`);
          try {
            if (monitor.isPersonalAlert && monitor.personalAlertEmail) {
              const html = `<h2>MouNa Monitoring Alert</h2><p>Your monitor <b>${monitor.name}</b> is back up.</p><p>URL: ${monitor.url}</p><p>Time: ${now.toLocaleString()}</p><p>Response Time: ${responseTime}ms</p>`;
              await sendPersonalEmailAlert(monitor.personalAlertEmail, `[UP] ${monitor.name} is resolved`, html);
            } else {
              await sendWebhookAlerts({
                userId: monitor.userId,
                event: "incident.resolved",
                monitor: { id: monitor.id, name: monitor.name, url: monitor.url, type: monitor.type },
                status: "up",
                responseTime,
                at: now,
              });
            }
          } catch (err) {
            console.warn("!! ALERT FAILED (resolved)", err);
          }
        }
        
        if (monitor.status !== newStatus) {
          await db.monitor.update({
            where: { id: monitor.id },
            data: { status: newStatus }
          });
        }
        checksRun++;
      }
    }));
    
    console.log(`[${new Date().toISOString()}] Cron completed ${checksRun} checks.`);
    return NextResponse.json({ success: true, checksRun });

  } catch (error) {
    console.error("Cron encountered an error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
