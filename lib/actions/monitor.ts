"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSessionUserId, requireSessionUserId } from "@/lib/auth";

async function ensureUserExists(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user) return user;
  throw new Error("Authenticated user not found");
}

export async function getMonitors() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    return await db.monitor.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        checks: {
          take: 1,
          orderBy: { createdAt: "desc" }
        }
      }
    });
  } catch (error) {
    console.error("Failed to get monitors:", error);
    return [];
  }
}

export async function getRecentIncidents() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    return await db.incident.findMany({
      where: { monitor: { userId } },
      include: {
        monitor: {
          select: { name: true }
        }
      },
      orderBy: { startedAt: "desc" },
      take: 5
    });
  } catch (error) {
    console.error("Failed to get recent incidents:", error);
    return [];
  }
}

export async function getMonitor(id: string) {
  const userId = await getSessionUserId();
  if (!userId) return null;

  return await db.monitor.findFirst({
    where: { id, userId },
    include: {
      checks: {
        take: 24,
        orderBy: { createdAt: "desc" }
      },
      incidents: {
        take: 5,
        orderBy: { startedAt: "desc" }
      }
    }
  });
}

export async function createMonitor(data: { name: string; url: string; type: string; interval: number; timeout: number; isPersonalAlert?: boolean; personalAlertEmail?: string }) {
  const userId = await requireSessionUserId();
  await ensureUserExists(userId);
  
  const monitor = await db.monitor.create({
    data: {
      userId,
      name: data.name,
      url: data.url,
      type: data.type,
      interval: data.interval,
      timeout: data.timeout,
      isPersonalAlert: data.isPersonalAlert || false,
      personalAlertEmail: data.personalAlertEmail || null,
      status: "up",
    }
  });
  
  revalidatePath("/dashboard/monitors");
  revalidatePath("/dashboard");
  return monitor;
}

export async function updateMonitor(id: string, data: { name: string; url: string; type: string; interval: number; timeout: number; isPersonalAlert?: boolean; personalAlertEmail?: string }) {
  const userId = await requireSessionUserId();
  const monitor = await db.monitor.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      url: data.url,
      type: data.type,
      interval: data.interval,
      timeout: data.timeout,
      isPersonalAlert: data.isPersonalAlert,
      personalAlertEmail: data.personalAlertEmail,
    }
  });
  
  revalidatePath("/dashboard/monitors");
  revalidatePath(`/dashboard/monitors/${id}`);
  revalidatePath("/dashboard");
  return monitor;
}

export async function deleteMonitor(id: string) {
  const userId = await requireSessionUserId();
  await db.monitor.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/monitors");
  revalidatePath("/dashboard");
}

export async function toggleMonitorStatus(id: string, currentStatus: string) {
  const userId = await requireSessionUserId();
  const newStatus = currentStatus === "paused" ? "up" : "paused";
  await db.monitor.updateMany({
    where: { id, userId },
    data: { status: newStatus }
  });
  revalidatePath("/dashboard/monitors");
  revalidatePath("/dashboard");
}

export async function getDashboardStats() {
  const userId = await getSessionUserId();
  if (!userId) return { uptime30d: "100.00", trendData: [] };

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const totalChecks = await db.check.count({
    where: { monitor: { userId }, createdAt: { gte: thirtyDaysAgo } }
  });

  const upChecks = await db.check.count({
    where: { monitor: { userId }, status: "up", createdAt: { gte: thirtyDaysAgo } }
  });

  const uptime30d = totalChecks > 0 ? ((upChecks / totalChecks) * 100).toFixed(2) : "100.00";

  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const recentChecks = await db.check.findMany({
    where: { monitor: { userId }, createdAt: { gte: twentyFourHoursAgo } },
    select: { status: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });

  const hours: Record<string, { up: number; total: number }> = {};
  
  for (let i = 23; i >= 0; i--) {
    const d = new Date();
    d.setHours(d.getHours() - i);
    const hourStr = d.getHours().toString().padStart(2, "0") + ":00";
    hours[hourStr] = { up: 0, total: 0 };
  }

  recentChecks.forEach(check => {
    const hourStr = check.createdAt.getHours().toString().padStart(2, "0") + ":00";
    if (hours[hourStr]) {
      hours[hourStr].total++;
      if (check.status === "up") hours[hourStr].up++;
    }
  });

  const trendData = Object.entries(hours).map(([name, stats]) => ({
    name,
    uptime: stats.total > 0 ? Number(((stats.up / stats.total) * 100).toFixed(2)) : 100,
  })).reverse().reverse(); // Keep chronological order

  return { uptime30d, trendData };
}
