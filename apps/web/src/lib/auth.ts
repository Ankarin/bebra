import { cookies } from "next/headers";

const AUTH_COOKIE = "glaife_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === "authenticated";
}

export async function login(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[Auth] ADMIN_PASSWORD not set");
    return false;
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    });
    return true;
  }

  return false;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
