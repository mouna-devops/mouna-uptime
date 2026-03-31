import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWebhookAlerts } from "@/lib/webhooks";

export async function GET(request: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  if (configuredSecret) {
    const authHeader = request.headers.get("authorization");
    const headerSecret = request.headers.get("x-cron-secret");
    const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const providedSecret = headerSecret ?? bearerSecret;

    if (providedSecret !== configuredSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }
  
  try {
    const monitors = await db.monitor.findMany({
      where: { status: { not: "paused" } }
    });
    
    const now = new Date();
    let checksRun = 0;
    
    for (const monitor of monitors) {
      // Simple heuristic: always check for now during demo, 
      // normally we'd check if (now - monitor.updatedAt) > interval minutes
      
      const startTime = performance.now();
      let isUp = false;
      
      try {
        if (monitor.type.includes("HTTP")) {
          const response = await fetch(monitor.url, { method: "GET", signal: AbortSignal.timeout(10000) });
          isUp = response.ok;
        } else {
          // Mock implementation for Ping/Port for demo
          isUp = true;
        }
      } catch (error) {
        isUp = false;
      }
      
      const responseTime = Math.round(performance.now() - startTime);
      const newStatus = isUp ? "up" : "down";
      
      // Log the check
      await db.check.create({
        data: {
          monitorId: monitor.id,
          status: newStatus,
          responseTime,
        }
      });
      
      // Handle incident state changes
      if (monitor.status === "up" && newStatus === "down") {
        const incident = await db.incident.create({
          data: {
            monitorId: monitor.id,
            status: "ongoing",
            errorType: "Connection Failed"
          }
        });
        // Best-effort webhook alert
        try {
          await sendWebhookAlerts({
            userId: monitor.userId,
            event: "incident.opened",
            monitor: { id: monitor.id, name: monitor.name, url: monitor.url, type: monitor.type },
            status: "down",
            responseTime,
            at: now,
          });
        } catch (err) {
          console.warn("[cron] webhook failed (opened)", err);
        }
      } else if (monitor.status === "down" && newStatus === "up") {
        // Resolve any ongoing incidents
        await db.incident.updateMany({
          where: { monitorId: monitor.id, status: "ongoing" },
          data: { status: "resolved", resolvedAt: now }
        });
        try {
          await sendWebhookAlerts({
            userId: monitor.userId,
            event: "incident.resolved",
            monitor: { id: monitor.id, name: monitor.name, url: monitor.url, type: monitor.type },
            status: "up",
            responseTime,
            at: now,
          });
        } catch (err) {
          console.warn("[cron] webhook failed (resolved)", err);
        }
      }
      
      // Update monitor
      await db.monitor.update({
        where: { id: monitor.id },
        data: { status: newStatus }
      });
      
      checksRun++;
    }
    
    return NextResponse.json({ success: true, checksRun });
  } catch (error) {
    console.error("Cron check failed", error);
    return NextResponse.json({ success: false, error: "Failed to run checks" }, { status: 500 });
  }
}
