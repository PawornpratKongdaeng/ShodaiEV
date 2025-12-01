// pages/api/admin/config.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  loadSiteData,
  saveSiteData,
  type SiteConfig,
} from "@/lib/server/siteData";

// ปรับได้ตามต้องการ เช่น 4mb / 8mb
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const data = await loadSiteData();
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ ok: false, error: "Cannot load config" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body as SiteConfig;
      await saveSiteData(body);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ ok: false, error: "Cannot save config" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
}
