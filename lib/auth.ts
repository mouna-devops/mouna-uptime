import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE_NAME = "mouna_session";

export async function getSessionUserId() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function requireSessionUserId() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }
  return userId;
}
