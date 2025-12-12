// lib/server/siteData.ts
import { getDb } from "./mongodb";
import fs from "fs";
import path from "path";

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type ProductItem = {
  page: number;
  id: string;
  imageUrl: string;
  name: string;
  description: string;
};

export type TopicItem = {
  id: string;
  title: string;
  summary?: string;
  detail?: string;
  thumbnailUrl?: string;
};

export type ServiceDetailSection = {
  id: string;
  title: string;
  description?: string;
  images?: string[];
};

export type ServiceDetailItem = {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  images?: string[];
  sections?: ServiceDetailSection[];
};

export type ThemeColors = {
  primary: string;
  primarySoft: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
};

export type SiteConfig = {
  seoServiceDetailDescriptionSuffix: string;
  seoServiceDetailTitlePrefix: string;

  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  phone?: string;
  line?: string;
  lineUrl?: string;
  facebook?: string;
  facebookUrl?: string;
  mapUrl?: string;

  businessName?: string;
  businessAddress?: string;
  businessGeoLat?: number;
  businessGeoLng?: number;

  seoTitleHome?: string;
  seoDescriptionHome?: string;

  services: ServiceItem[];
  products?: ProductItem[];
  productsSections?: {
    home: ProductItem[];
    page2: ProductItem[];
  };
  topics?: TopicItem[];
  serviceDetails?: ServiceDetailItem[];

  theme?: ThemeColors;
  homeGallery?: string[];
};

export const defaultTheme: ThemeColors = {
  primary: "#f97316",
  primarySoft: "#ffedd5",
  accent: "#dc2626",
  background: "#ffffff",
  surface: "#fef3c7",
  text: "#0f172a",
};

const defaultConfig: SiteConfig = {
  heroTitle: "ShodaiEV",
  heroSubtitle: "ขายของเกี่ยวกับรถ",
  phone: "",
  line: "",
  lineUrl: "",
  facebook: "",
  mapUrl: "",
  businessName: "ShodaiEV",
  businessAddress: "",
  services: [],
  products: [],
  productsSections: {
    home: [],
    page2: [],
  },
  topics: [],
  serviceDetails: [],
  homeGallery: [],
  theme: defaultTheme,
  seoServiceDetailDescriptionSuffix: "",
  seoServiceDetailTitlePrefix: "",
};

function normalizeConfig(raw: Partial<SiteConfig> | null): SiteConfig {
  const parsed = raw || {};

  const normalizedProductsSections = {
    home: Array.isArray(parsed.productsSections?.home)
      ? parsed.productsSections!.home
      : Array.isArray(parsed.products)
      ? parsed.products!
      : [],
    page2: Array.isArray(parsed.productsSections?.page2)
      ? parsed.productsSections!.page2
      : [],
  };

  const normalizedProducts =
    Array.isArray(parsed.products) && parsed.products.length > 0
      ? parsed.products
      : normalizedProductsSections.home;

  return {
    ...defaultConfig,
    ...parsed,

    services: Array.isArray(parsed.services) ? parsed.services : [],

    products: normalizedProducts,

    productsSections: normalizedProductsSections,

    topics: Array.isArray(parsed.topics) ? parsed.topics : [],
    serviceDetails: Array.isArray(parsed.serviceDetails)
      ? parsed.serviceDetails
      : [],
    homeGallery: Array.isArray(parsed.homeGallery)
      ? parsed.homeGallery
      : [],

    theme: parsed.theme
      ? { ...defaultTheme, ...parsed.theme }
      : defaultTheme,
  };
}

const COLLECTION = "site_config";
const DOC_ID = "main";

async function readStaticSiteDataIfExists(): Promise<SiteConfig | null> {
  try {
    const staticPath = path.join(process.cwd(), "data", "siteData.json");
    if (fs.existsSync(staticPath)) {
      const raw = fs.readFileSync(staticPath, "utf-8");
      return JSON.parse(raw) as SiteConfig;
    }
  } catch (err) {
    console.warn("Failed to read static siteData.json:", err);
  }
  return null;
}

export async function loadSiteData(): Promise<SiteConfig> {
  try {
    const db = await getDb();
    if (!db) {
      // Fallback: try static file, then defaultConfig
      const staticData = await readStaticSiteDataIfExists();
      if (staticData) {
        return normalizeConfig(staticData);
      }
      return normalizeConfig(defaultConfig);
    }

    const col = db.collection<{ _id: string; data: SiteConfig }>(COLLECTION);
    const doc = await col.findOne({ _id: DOC_ID });

    if (!doc || !doc.data) {
      const normalized = normalizeConfig(defaultConfig);
      await col.updateOne(
        { _id: DOC_ID },
        { $set: { data: normalized } },
        { upsert: true }
      );
      return normalized;
    }

    return normalizeConfig(doc.data);
  } catch (err) {
    console.error("loadSiteData error:", err);
    // Ensure we return a usable config instead of throwing
    const staticData = await readStaticSiteDataIfExists();
    return normalizeConfig(staticData ?? defaultConfig);
  }
}

export async function saveSiteData(data: SiteConfig): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("No database available to save site data.");
  }
  const col = db.collection<{ _id: string; data: SiteConfig }>(COLLECTION);
  const normalized = normalizeConfig(data);

  await col.updateOne(
    { _id: DOC_ID },
    { $set: { data: normalized } },
    { upsert: true }
  );
}

/* -------------------------------------------------------------
 *  Section-based save helpers
 * ------------------------------------------------------------*/

export type HeroPayload = Pick<
  SiteConfig,
  | "heroTitle"
  | "heroSubtitle"
  | "heroImageUrl"
  | "phone"
  | "line"
  | "lineUrl"
  | "facebook"
  | "facebookUrl"
  | "mapUrl"
>;

export async function saveHeroSection(payload: HeroPayload) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type HomeGalleryPayload = Pick<SiteConfig, "homeGallery">;

export async function saveHomeGallerySection(
  payload: HomeGalleryPayload
) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type ServicesPayload = Pick<SiteConfig, "services">;

export async function saveServicesSection(payload: ServicesPayload) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type TopicsPayload = Pick<SiteConfig, "topics">;

export async function saveTopicsSection(payload: TopicsPayload) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type ServiceDetailPayload = Pick<SiteConfig, "serviceDetails">;

export async function saveServiceDetailSection(
  payload: ServiceDetailPayload
) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type ContactPayload = Pick<
  SiteConfig,
  "phone" | "line" | "lineUrl" | "facebook" | "mapUrl"
>;

export async function saveContactSection(payload: ContactPayload) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}

export type ThemePayload = Pick<SiteConfig, "theme">;

export async function saveThemeSection(payload: ThemePayload) {
  const current = await loadSiteData();
  await saveSiteData({ ...current, ...payload });
}
