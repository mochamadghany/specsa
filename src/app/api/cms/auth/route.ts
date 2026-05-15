import { NextRequest, NextResponse } from "next/server";
import { createCmsToken, getCmsCookieName, getCmsPassword } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password || body.password !== getCmsPassword()) {
    return NextResponse.json({ error: "Password CMS salah." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getCmsCookieName(), createCmsToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getCmsCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

