"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSessionUserId, requireSessionUserId } from "@/lib/auth";

export async function getAlertContacts() {
  const userId = await getSessionUserId();
  if (!userId) return [];

  return await db.alertContact.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function createAlertContact(data: { type: string, value: string }) {
  const userId = await requireSessionUserId();

  // Webhook-only. Ignore any client-provided type.
  const value = data.value.trim();
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    throw new Error("Invalid webhook URL");
  }

  const contact = await db.alertContact.create({
    data: {
      type: "Webhook",
      value,
      userId
    }
  });
  
  revalidatePath("/dashboard/alerts");
  return contact;
}

export async function deleteAlertContact(id: string) {
  const userId = await requireSessionUserId();
  await db.alertContact.deleteMany({
    where: { id, userId }
  });
  revalidatePath("/dashboard/alerts");
}

export async function toggleAlertContact(id: string, currentStatus: boolean) {
  const userId = await requireSessionUserId();
  await db.alertContact.updateMany({
    where: { id, userId },
    data: { enabled: !currentStatus }
  });
  revalidatePath("/dashboard/alerts");
}
