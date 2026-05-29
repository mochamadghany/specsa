import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

type InstagramApiResponse = {
  data?: InstagramMedia[];
  error?: { message?: string };
};

export async function GET() {
  const settings = await getSiteSettings();
  const userId = settings.instagram_user_id || process.env.INSTAGRAM_USER_ID;
  const accessToken =
    settings.instagram_access_token || process.env.INSTAGRAM_ACCESS_TOKEN;

  if (settings.instagram_feed_enabled === "0" || !userId || !accessToken) {
    return NextResponse.json({
      connected: false,
      posts: [],
      message: "Instagram feed belum dikonfigurasi.",
    });
  }

  const url = new URL(`https://graph.instagram.com/${userId}/media`);
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
  );
  url.searchParams.set("limit", "6");
  url.searchParams.set("access_token", accessToken);

  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    const json = (await res.json()) as InstagramApiResponse;

    if (!res.ok) {
      return NextResponse.json(
        {
          connected: false,
          posts: [],
          message: json.error?.message || "Gagal mengambil feed Instagram.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      connected: true,
      posts: (json.data || []).map((post) => ({
        ...post,
        display_url: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        posts: [],
        message: error instanceof Error ? error.message : "Instagram feed error.",
      },
      { status: 200 }
    );
  }
}
