import { NextRequest, NextResponse } from "next/server";
import {
  defaultSiteContent,
  getSiteContent,
  writeSiteContent,
  type SiteContent,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const password = process.env.CMS_PASSWORD || "specsa-admin";
  return request.headers.get("x-cms-password") === password;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Set CMS_PASSWORD on the server and use that password in the CMS dashboard.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    content: getSiteContent(),
    defaultContent: defaultSiteContent,
  });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = (await request.json()) as SiteContent;
    if (!content?.site || !content?.pages) {
      return NextResponse.json({ error: "Invalid content schema" }, { status: 400 });
    }
    writeSiteContent(content);
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
