"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSessionUserId, requireSessionUserId } from "@/lib/auth";

export async function getStatusPages() {
  const userId = await getSessionUserId();
  if (!userId) return [];

  return await db.statusPage.findMany({
    where: { userId },
    include: { monitors: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function createStatusPage(data: { name: string; domain?: string; isPublic: boolean; monitorIds: string[] }) {
  const userId = await requireSessionUserId();
  const ownedMonitors = await db.monitor.findMany({
    where: { userId, id: { in: data.monitorIds } },
    select: { id: true }
  });

  const page = await db.statusPage.create({
    data: {
      name: data.name,
      domain: data.domain,
      isPublic: data.isPublic,
      userId,
      monitors: {
        connect: ownedMonitors.map(m => ({ id: m.id }))
      }
    }
  });
  
  revalidatePath("/dashboard/status-pages");
  return page;
}

export async function deleteStatusPage(id: string) {
  const userId = await requireSessionUserId();
  await db.statusPage.deleteMany({
    where: { id, userId }
  });
  revalidatePath("/dashboard/status-pages");
}
