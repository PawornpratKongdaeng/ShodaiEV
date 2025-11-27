// lib/server/siteData.ts
import fs from "fs/promises";
import path from "path";

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type ProductItem = {
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

const filePath = path.join(process.cwd(), "data", "site.json");

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
  seoServiceDetailTitlePrefix: ""
};

export async function loadSiteData(): Promise<SiteConfig> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(content);

    return {
      ...defaultConfig,
      ...parsed,
      services: Array.isArray(parsed.services) ? parsed.services : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      productsSections: parsed.productsSections ?? { home: [], page2: [] },
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
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await saveSiteData(defaultConfig);
      return defaultConfig;
    }
    throw err;
  }
}

export async function saveSiteData(data: SiteConfig): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
