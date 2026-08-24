"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkSitePassword, createSiteSessionToken, SITE_COOKIE_NAME } from "@/lib/auth";

function safeRedirectTarget(value: FormDataEntryValue | null): string {
  const target = String(value ?? "/");
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  return "/";
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirectTarget(formData.get("redirect"));

  if (!checkSitePassword(password)) {
    const params = new URLSearchParams({ error: "1" });
    if (redirectTo !== "/") params.set("redirect", redirectTo);
    redirect(`/acceso?${params.toString()}`);
  }

  const { value, maxAge } = await createSiteSessionToken();
  cookies().set(SITE_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  redirect(`/cargando?redirect=${encodeURIComponent(redirectTo)}`);
}
