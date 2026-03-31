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

export async function createMonitor(data: { name: string; url: string; type: string; interval: number }) {
  const userId = await requireSessionUserId();
  await ensureUserExists(userId);
  
  const monitor = await db.monitor.create({
    data: {
      userId,
      name: data.name,
      url: data.url,
      type: data.type,
      interval: data.interval,
      status: "up",
    }
  });
  
  revalidatePath("/dashboard/monitors");
  revalidatePath("/dashboard");
  return monitor;
}

export async function updateMonitor(id: string, data: { name: string; url: string; type: string; interval: number }) {
  const userId = await requireSessionUserId();
  const monitor = await db.monitor.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      url: data.url,
      type: data.type,
      interval: data.interval,
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
