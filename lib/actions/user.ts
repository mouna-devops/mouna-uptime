"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireSessionUserId } from "@/lib/auth";

export async function getUser() {
  const userId = await requireSessionUserId();
  return await db.user.findUnique({
    where: { id: userId }
  });
}

export async function updateUser(data: { name: string; email: string }) {
  const userId = await requireSessionUserId();
  const user = await db.user.upsert({
    where: { id: userId },
    update: {
      name: data.name,
      email: data.email
    },
    create: {
      id: userId,
      name: data.name,
      email: data.email
    }
  });
  
  revalidatePath("/dashboard/settings");
  return user;
}
