import { RowDataPacket } from "mysql2/promise";
import { getDbPool } from "./db";

export type SocialLink = {
  key: string;
  label: string;
  url: string;
  handle: string;
};

export type SiteSettings = {
  site_name: string;
  site_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  social_instagram_url: string;
  social_instagram_handle: string;
  social_facebook_url: string;
  social_facebook_handle: string;
  social_tiktok_url: string;
  social_tiktok_handle: string;
  social_youtube_url: string;
  social_youtube_handle: string;
  social_linkedin_url: string;
  social_linkedin_handle: string;
  instagram_user_id: string;
  instagram_access_token: string;
  instagram_feed_enabled: string;
  facebook_page_url: string;
  facebook_feed_enabled: string;
};

export const defaultSettings: SiteSettings = {
  site_name: "PT. Specsa Solusi Pratama",
  site_url: "https://specsa.id",
  phone: "0812 105 1526",
  whatsapp: "6281210511526",
  email: "info@specsa.id",
  address:
    "Ruko Bintaro Terrace 2 No.7, Jl. Sumatera, Ciputat, Tangerang Selatan 15414",
  social_instagram_url: "https://www.instagram.com/specsa.id/",
  social_instagram_handle: "specsa.id",
  social_facebook_url: "https://www.facebook.com/specsa.id",
  social_facebook_handle: "Specsa",
  social_tiktok_url: "",
  social_tiktok_handle: "",
  social_youtube_url: "",
  social_youtube_handle: "",
  social_linkedin_url: "",
  social_linkedin_handle: "",
  instagram_user_id: "",
  instagram_access_token: "",
  instagram_feed_enabled: "1",
  facebook_page_url: "https://www.facebook.com/specsa.id",
  facebook_feed_enabled: "1",
};

type SettingRow = RowDataPacket & {
  setting_key: string;
  setting_value: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getDbPool();
    const [rows] = await db.query<SettingRow[]>(
      "SELECT setting_key, setting_value FROM site_settings"
    );
    const merged: SiteSettings = { ...defaultSettings };
    for (const row of rows) {
      if (row.setting_value != null && row.setting_value !== "") {
        (merged as Record<string, string>)[row.setting_key] = row.setting_value;
      }
    }
    return merged;
  } catch {
    return { ...defaultSettings };
  }
}

export function getSocialLinks(settings: SiteSettings): SocialLink[] {
  return [
    {
      key: "instagram",
      label: "Instagram",
      url: settings.social_instagram_url,
      handle: settings.social_instagram_handle,
    },
    {
      key: "facebook",
      label: "Facebook",
      url: settings.social_facebook_url,
      handle: settings.social_facebook_handle,
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: settings.social_tiktok_url,
      handle: settings.social_tiktok_handle,
    },
    {
      key: "youtube",
      label: "YouTube",
      url: settings.social_youtube_url,
      handle: settings.social_youtube_handle,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: settings.social_linkedin_url,
      handle: settings.social_linkedin_handle,
    },
  ].filter((item) => item.url.trim().length > 0);
}
