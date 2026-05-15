import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const cookieName = "specsa_cms_session";

export function getCmsPassword() {
  return process.env.CMS_PASSWORD || "specsa-admin";
}

export function createCmsToken() {
  return crypto
    .createHash("sha256")
    .update(`specsa:${getCmsPassword()}`)
    .digest("hex");
}

export function isCmsRequestAuthorized(request?: NextRequest) {
  const headerPassword = request?.headers.get("x-cms-password");
  if (headerPassword && headerPassword === getCmsPassword()) return true;

  const cookieToken =
    request?.cookies.get(cookieName)?.value || cookies().get(cookieName)?.value;
  return cookieToken === createCmsToken();
}

export function getCmsCookieName() {
  return cookieName;
}

