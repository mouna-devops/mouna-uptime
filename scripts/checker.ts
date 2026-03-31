import { PrismaClient } from '@prisma/client';
import { sendWebhookAlerts } from "@/lib/webhooks";

const prisma = new PrismaClient();

// We will poll every 30 seconds for simplicity in this demo to see if any monitors are due.
const POLL_INTERVAL = 30 * 1000;

async function runChecks() {
  try {
    console.log(`[${new Date().toISOString()}] Running monitor checks...`);
    const monitors = await prisma.monitor.findMany({
      where: { status: { not: "paused" } },
      include: { checks: { orderBy: { createdAt: "desc" }, take: 1 } }
    });
    
    const now = new Date();
    let checksRun = 0;
    
    for (const monitor of monitors) {
      const lastCheck = monitor.checks.length > 0 ? monitor.checks[0].createdAt : new Date(0);
      const minutesSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60);

      // Only check if time elapsed is greater than or equal to the monitor's interval
      // (adding slight buffer to avoid skipping)
      if (minutesSinceLastCheck >= monitor.interval - 0.1) {
        console.log(`[${new Date().toISOString()}] Checking ${monitor.name} (${monitor.url})`);
        const startTime = performance.now();
        let isUp = false;
        
        try {
          if (monitor.type.includes("HTTP")) {
            const response = await fetch(monitor.url, { method: "GET", signal: AbortSignal.timeout(10000) });
            isUp = response.ok;
          } else {
            isUp = true; // Mock implementation for Ping/Port for demo
          }
        } catch (error) {
          isUp = false;
        }
        
        const responseTime = Math.round(performance.now() - startTime);
        const newStatus = isUp ? "up" : "down";
        
        await prisma.check.create({
          data: {
            monitorId: monitor.id,
            status: newStatus,
            responseTime,
          }
        });
        
        if (monitor.status === "up" && newStatus === "down") {
          await prisma.incident.create({
            data: {
              monitorId: monitor.id,
              status: "ongoing",
              errorType: "Connection Failed"
            }
          });
          console.log(`!! INCIDENT CREATED for ${monitor.name}`);
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
            console.warn("!! WEBHOOK FAILED (opened)", err);
          }
        } else if (monitor.status === "down" && newStatus === "up") {
          await prisma.incident.updateMany({
            where: { monitorId: monitor.id, status: "ongoing" },
            data: { status: "resolved", resolvedAt: now }
          });
          console.log(`!! INCIDENT RESOLVED for ${monitor.name}`);
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
            console.warn("!! WEBHOOK FAILED (resolved)", err);
          }
        }
        
        if (monitor.status !== newStatus) {
          await prisma.monitor.update({
            where: { id: monitor.id },
            data: { status: newStatus }
          });
        }
        checksRun++;
      }
    }
    
    console.log(`[${new Date().toISOString()}] Completed ${checksRun} checks.`);
  } catch (error) {
    console.error("Checker encountered an error:", error);
  }
}

// Start looping
console.log("Starting MouNa Monitoring background checker...");
runChecks();
setInterval(runChecks, POLL_INTERVAL);
