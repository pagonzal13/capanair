import { createSessionToken, verifySessionToken } from "./session";

export const SITE_COOKIE_NAME = "capafest_session";
export const ADMIN_COOKIE_NAME = "capafest_admin_session";
export const CAPAWARDS_VOTED_COOKIE_NAME = "capafest_capawards_voted";

const SITE_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 3; // 3 dias

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
  }
  return secret;
}

export function checkSitePassword(password: string): boolean {
  const expected = process.env.SITE_PASSWORD;
  return Boolean(expected) && password === expected;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function createSiteSessionToken(): Promise<{ value: string; maxAge: number }> {
  const value = await createSessionToken(getSessionSecret(), { scope: "site" }, SITE_SESSION_MAX_AGE);
  return { value, maxAge: SITE_SESSION_MAX_AGE };
}

export async function createAdminSessionToken(): Promise<{ value: string; maxAge: number }> {
  const value = await createSessionToken(getSessionSecret(), { scope: "admin" }, ADMIN_SESSION_MAX_AGE);
  return { value, maxAge: ADMIN_SESSION_MAX_AGE };
}

export async function verifySiteSessionToken(token: string | undefined | null): Promise<boolean> {
  return verifySessionToken(getSessionSecret(), token);
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  return verifySessionToken(getSessionSecret(), token);
}
