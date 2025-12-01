"use client";

import React, { useEffect, useState } from "react";
import type {
  SiteConfig,
  ServiceItem,
  TopicItem,
  ServiceDetailItem,
  ThemeColors,
} from "@/lib/server/siteData";
import { v4 as uuid } from "uuid";

type SectionId =
  | "dashboard"
  | "hero"
  | "services"
  | "topics"
  | "serviceDetail"
  | "homeGallery"
  | "contact"
  | "theme";

const createEmptyConfig = (): SiteConfig => ({
  heroTitle: "",
  heroSubtitle: "",
  heroImageUrl: "",
  phone: "",
  line: "",
  lineUrl: "",
  facebook: "",
  mapUrl: "",
  services: [],
  products: [],
  productsSections: {
    home: [],
    page2: [],
  },
  topics: [],
  serviceDetails: [],
  seoTitleHome: "",
  seoDescriptionHome: "",
  businessGeoLat: undefined,
  businessAddress: "",
  businessName: "",
  seoServiceDetailDescriptionSuffix: "",
  seoServiceDetailTitlePrefix: "",
  homeGallery: [],
  theme: undefined,
});

const toFileArray = (files: FileList | File[]) =>
  Array.isArray(files) ? files : Array.from(files);

const parseUploadResponse = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text) as { ok?: boolean; url?: string };
  } catch {
    console.error("Upload route returned non-JSON:", text);
    return null;
  }
};

const uploadImages = async (files: FileList | File[]) => {
  const urls: string[] = [];
  for (const file of toFileArray(files)) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await parseUploadResponse(res);
      if (json?.ok && json.url) {
        urls.push(json.url);
      } else {
        console.error("Upload failed for", file.name, json);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }
  return urls;
};

const uploadSingleImage = async (file: File) => {
  const urls = await uploadImages([file]);
  return urls[0] ?? null;
};

type AdminSidebarProps = {
  activeSection: SectionId;
  setActiveSection: (s: SectionId) => void;
  isOpen: boolean;
  onClose: () => void;
};

const SIDEBAR_SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Overview", icon: "📊" },
  { id: "hero", label: "หน้าแรก (Hero)", icon: "🏠" },
  { id: "homeGallery", label: "รูปหน้าแรก", icon: "🖼️" },
  { id: "topics", label: "หัวข้อบริการ", icon: "📚" },
  { id: "serviceDetail", label: "รายละเอียดบริการ", icon: "🖼️" },
  { id: "contact", label: "ข้อมูลติดต่อ", icon: "📱" },
  { id: "theme", label: "Theme สีเว็บ", icon: "🎨" },
];

const AdminSidebar = ({
  activeSection,
  setActiveSection,
  isOpen,
  onClose,
}: AdminSidebarProps) => {
  const renderNav = () => (
    <>
      <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white text-xs">
              QD
            </span>
            <span>Admin Console</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
            จัดการคอนเทนต์หน้าบ้านทั้งหมด
          </p>
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {SIDEBAR_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              onClose();
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 ${
              activeSection === section.id
                ? "bg-sky-50 text-sky-700 border border-sky-200 shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="text-lg leading-none">{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800">Admin User</p>
            <p className="text-[11px] text-slate-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white text-slate-800 min-h-screen fixed left-0 top-0 flex-col border-r border-slate-200">
        {renderNav()}
      </aside>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200 md:hidden">
            {renderNav()}
          </aside>
        </>
      )}
    </>
  );
};

type AdminHeaderProps = {
  onSave: () => void;
  saving: boolean;
  onToggleSidebar: () => void;
};

const AdminHeader = ({
  onSave,
  saving,
  onToggleSidebar,
}: AdminHeaderProps) => (
  <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 fixed top-0 left-0 md:left-64 right-0 z-40">
    <div className="h-full px-3 sm:px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-700 mr-1"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1.5">
            <span className="block w-5 h-[2px] bg-slate-700 rounded" />
            <span className="block w-5 h-[2px] bg-slate-700 rounded" />
            <span className="block w-5 h-[2px] bg-slate-700 rounded" />
          </div>
        </button>

        <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-sky-600 text-white text-sm font-semibold">
          QD
        </div>
        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Content Editor
          </h2>
          <p className="text-[11px] text-slate-500">
            แก้ไขข้อมูลแล้วกด Save เพื่ออัปเดตหน้าเว็บจริง
          </p>
        </div>
        <span className="hidden md:inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full border border-emerald-200 ml-2">
          Live
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <a
          href="/"
          target="_blank"
          className="px-3 py-2 text-xs md:text-sm text-slate-600 hover:text-slate-900 font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
        >
          Preview
        </a>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 md:px-5 py-2 bg-sky-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-sky-200"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  </header>
);

const DashboardView = ({ config }: { config: SiteConfig }) => {
  const totalServices = config.services?.length ?? 0;
  const totalTopics = Array.isArray(config.topics)
    ? (config.topics as TopicItem[]).length
    : 0;
  const totalDetails = Array.isArray(config.serviceDetails)
    ? (config.serviceDetails as ServiceDetailItem[]).length
    : 0;

  const stats = [
    {
      label: "Hero Title Length",
      value: config.heroTitle?.length ?? 0,
      icon: "🏠",
    },
    {
      label: "Service Topics",
      value: totalTopics,
      icon: "📚",
    },
    { label: "Services", value: totalServices, icon: "💼" },
    { label: "Service Detail Pages", value: totalDetails, icon: "🖼️" },
    {
      label: "HomeGallery Images",
      value: (config.homeGallery || []).length,
      icon: "🖼️",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-6">
        <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">
          Quick Tips
        </h3>
        <ul className="text-xs md:text-sm text-slate-600 space-y-2 list-disc pl-5">
          <li>ตั้งค่า Hero เพื่อให้หน้าแรกดึงดูดสายตา</li>
          <li>เพิ่มหัวข้อใน Service Topics เพื่อใช้สร้างหน้า</li>
          <li>อัปโหลดรูปเยอะ ๆ ใน Service Detail เพื่อโชว์ผลงาน</li>
          <li>อย่าลืมกด Save ทุกครั้งหลังแก้ไข</li>
        </ul>
      </div>
    </div>
  );
};

type ThemeEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const ThemeEditorView = ({ config, setConfig }: ThemeEditorProps) => {
  const theme = config.theme ?? {
    primary: "#f97316",
    primarySoft: "#ffedd5",
    accent: "#dc2626",
    background: "#ffffff",
    surface: "#fef3c7",
    text: "#0f172a",
  };

  const update = (field: keyof ThemeColors, value: string) => {
    setConfig({
      ...config,
      theme: {
        ...theme,
        [field]: value,
      },
    });
  };

  const previewStyle: React.CSSProperties = {
    "--color-primary": theme.primary,
    "--color-primary-soft": theme.primarySoft,
    "--color-accent": theme.accent,
    "--color-bg": theme.background,
    "--color-surface": theme.surface,
    "--color-text": theme.text,
  } as React.CSSProperties;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-slate-900">
            Theme สีของเว็บไซต์
          </h3>
          <p className="text-[11px] text-slate-500">
            ปรับสีหลักของเว็บ ทุกหน้าและทุกปุ่มจะใช้ชุดสีนี้
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Primary
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.primary}
                onChange={(e) => update("primary", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.primary}
                onChange={(e) => update("primary", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Primary Soft
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.primarySoft}
                onChange={(e) => update("primarySoft", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.primarySoft}
                onChange={(e) => update("primarySoft", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Accent
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.accent}
                onChange={(e) => update("accent", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.accent}
                onChange={(e) => update("accent", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Background
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.background}
                onChange={(e) => update("background", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.background}
                onChange={(e) => update("background", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Surface
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.surface}
                onChange={(e) => update("surface", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.surface}
                onChange={(e) => update("surface", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-3 items-center">
            <span className="text-xs font-semibold text-slate-700">
              Text
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-slate-200 bg-white"
                value={theme.text}
                onChange={(e) => update("text", e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                value={theme.text}
                onChange={(e) => update("text", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border border-slate-200 p-5 space-y-4"
          style={previewStyle}
        >
          <div className="text-xs font-semibold text-slate-500 mb-1">
            Preview
          </div>
          <div className="rounded-2xl p-4 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-primary-soft)] space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              ShodaiEV Service
            </div>
            <h3 className="text-lg font-bold">
              ตัวอย่างหัวข้อบริการ ซ่อมรถไฟฟ้า 2 ล้อ 3 ล้อ
            </h3>
            <p className="text-xs">
              ตัวอย่างข้อความอธิบายบริการ เมื่อเปลี่ยนสีด้านซ้าย กล่องนี้จะปรับตามทันที
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-full text-xs font-semibold bg-[var(--color-primary)] text-white">
                ปุ่มหลัก
              </button>
              <button className="px-4 py-2 rounded-full text-xs font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] bg-white">
                ปุ่มรอง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type HeroEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const HeroEditorView = ({ config, setConfig }: HeroEditorProps) => {
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages: string[] = Array.isArray(config.heroImageUrl)
    ? config.heroImageUrl
    : [];

  useEffect(() => {
    if (currentIndex >= heroImages.length) {
      setCurrentIndex(Math.max(0, heroImages.length - 1));
    }
  }, [heroImages.length, currentIndex]);

  const applyImagesToConfig = (images: string[]) => {
    const updated: SiteConfig = {
      ...config,
      heroImageUrl: images[0] || "",
    };
    setConfig(updated);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = await uploadImages(files);
      if (newUrls.length === 0) {
        alert("⛔ Upload failed.");
        return;
      }

      const merged = [...heroImages, ...newUrls];
      applyImagesToConfig(merged);

      if (heroImages.length === 0) setCurrentIndex(0);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAll = () => {
    applyImagesToConfig([]);
    setCurrentIndex(0);
  };

  const handleRemoveOne = (idx: number) => {
    const next = heroImages.filter((_, i) => i !== idx);
    applyImagesToConfig(next);

    if (idx <= currentIndex) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handlePrev = () => {
    if (heroImages.length <= 1) return;
    setCurrentIndex((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (heroImages.length <= 1) return;
    setCurrentIndex((prev) =>
      prev === heroImages.length - 1 ? 0 : prev + 1
    );
  };

  const currentImage = heroImages[currentIndex];

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900">
              Hero Banner
            </h3>
            <p className="text-[11px] md:text-xs text-slate-500 mt-1">
              รูปเหล่านี้จะแสดงบนส่วนบนสุดของหน้าเว็บแบบสไลด์ สามารถอัปได้หลายรูป
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              อัปโหลดรูป (แนะนำ 1920×900)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="w-full text-xs cursor-pointer file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border file:border-slate-200 file:bg-slate-50 file:text-xs file:font-medium hover:file:bg-slate-100"
            />

            {uploading && (
              <p className="text-xs text-sky-600">⏳ กำลังอัปโหลด...</p>
            )}

            {heroImages.length > 0 && !uploading && (
              <button
                type="button"
                className="text-xs text-red-600 underline mt-1"
                onClick={handleRemoveAll}
              >
                ลบรูปทั้งหมด
              </button>
            )}
          </div>

          {heroImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-semibold text-slate-700">
                รูปทั้งหมด ({heroImages.length})
              </p>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {heroImages.map((url, idx) => (
                  <button
                    key={url + idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-10 rounded-lg overflow-hidden border ${
                      idx === currentIndex
                        ? "border-sky-500 ring-2 ring-sky-200"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`hero-${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <span className="absolute bottom-0 left-0 right-0 text-[10px] bg-black/50 text-white text-center">
                      {idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOne(idx);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center"
                    >
                      ×
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Main Title
              </label>
              <input
                type="text"
                value={config.heroTitle || ""}
                onChange={(e) =>
                  setConfig({ ...config, heroTitle: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Subtitle
              </label>
              <textarea
                value={config.heroSubtitle || ""}
                onChange={(e) =>
                  setConfig({ ...config, heroSubtitle: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-300 resize-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 md:pt-0">
          <p className="text-xs font-medium text-slate-700 mb-2">Preview</p>

          <div className="relative bg-slate-100 border border-sky-200 rounded-2xl overflow-hidden">
            {heroImages.length > 0 ? (
              <div className="relative w-full aspect-[16/9] bg-black/5">
                <img
                  src={currentImage}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {heroImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 
                      w-7 h-7 rounded-full bg-black/40 text-white text-sm flex items-center justify-center"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 
                      w-7 h-7 rounded-full bg-black/40 text-white text-sm flex items-center justify-center"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {heroImages.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full ${
                            i === currentIndex
                              ? "w-4 bg-white"
                              : "w-2 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-sky-50 via-white to-sky-50 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-3">
                  <span className="text-2xl">🖼️</span>
                </div>
                <p className="text-xs md:text-sm text-slate-500 text-center px-4">
                  ยังไม่มีรูป Hero • อัปโหลดรูปเพื่อแสดง Banner หน้าแรก
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type HomeGalleryEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const HomeGalleryEditorView = ({
  config,
  setConfig,
}: HomeGalleryEditorProps) => {
  const images = Array.isArray(config.homeGallery) ? config.homeGallery : [];
  const [uploading, setUploading] = useState(false);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newUrls = await uploadImages(files);
      setConfig({
        ...config,
        homeGallery: [...images, ...newUrls],
      });
    } catch {
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลดรูป");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    const next = images.filter((img) => img !== url);
    setConfig({
      ...config,
      homeGallery: next,
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const next = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const tmp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = tmp;
    setConfig({ ...config, homeGallery: next });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide">
            Home Gallery
          </p>
          <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
            รูปตัวอย่างงานหน้าแรก
          </h3>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            รูปที่อัปโหลดตรงนี้จะใช้แสดงในหน้าแรก ก่อนหัวข้อ "บริการของเรา"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-[11px] text-slate-500">
            ทั้งหมด {images.length} รูป
          </p>
          <label className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium cursor-pointer">
            <span>เลือกรูป</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-slate-50 space-y-4">
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-sky-700 bg-sky-50 border border-sky-100 rounded-lg p-3">
            <div className="loading loading-spinner loading-sm" />
            <span>กำลังอัปโหลดรูป กรุณารอสักครู่...</span>
          </div>
        )}

        {images.length === 0 && !uploading && (
          <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl bg-white">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-3xl">🖼️</span>
            </div>
            <p className="text-sm text-slate-500 px-4">
              ยังไม่มีรูปหน้าแรก กดปุ่ม "เลือกรูป" ด้านบนเพื่ออัปโหลด
            </p>
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
              >
                <div className="relative">
                  <img
                    src={url}
                    alt={`home-gallery-${index + 1}`}
                    className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    onClick={() => removeImage(url)}
                  >
                    ✕
                  </button>
                </div>
                <div className="px-2 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate">
                    รูปที่ {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      className="w-6 h-6 rounded-full border border-slate-200 text-[11px] text-slate-700 flex items-center justify-center disabled:opacity-40"
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      className="w-6 h-6 rounded-full border border-slate-200 text-[11px] text-slate-700 flex items-center justify-center disabled:opacity-40"
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

type ContactEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const ContactEditorView = ({ config, setConfig }: ContactEditorProps) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Phone
        </label>
        <input
          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
          value={config.phone || ""}
          onChange={(e) => setConfig({ ...config, phone: e.target.value })}
          placeholder="เช่น 081-234-5678"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Line ID
        </label>
        <input
          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
          value={config.line || ""}
          onChange={(e) => setConfig({ ...config, line: e.target.value })}
          placeholder="@yourline"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Line URL
        </label>
        <input
          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
          value={config.lineUrl || ""}
          onChange={(e) => setConfig({ ...config, lineUrl: e.target.value })}
          placeholder="https://line.me/ti/p/@yourline"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Facebook Page URL
        </label>
        <input
          type="url"
          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
          value={config.facebook || ""}
          onChange={(e) => setConfig({ ...config, facebook: e.target.value })}
          placeholder="https://facebook.com/yourpage"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Google Map URL
        </label>
        <input
          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
          value={config.mapUrl || ""}
          onChange={(e) => setConfig({ ...config, mapUrl: e.target.value })}
          placeholder="ลิงก์ Google Maps เช่น https://maps.app.goo.gl/..."
        />
      </div>
    </div>
  </div>
);

type ServicesEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9\u0E00-\u0E7F\-_]/gi, "");

const ServicesEditorView = ({ config, setConfig }: ServicesEditorProps) => {
  const services: ServiceItem[] = Array.isArray(config.services)
    ? config.services
    : [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ServiceItem | null>(null);

  const openCreate = () => {
    setEditItem({
      id: "",
      icon: "✨",
      title: "",
      description: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (service: ServiceItem) => {
    setEditItem({ ...service });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleConfirm = () => {
    if (!editItem) return;

    let item = editItem;

    if (!item.id) {
      const base = slugify(item.title || "service");
      let slug = base || "service";
      let counter = 1;
      while (services.some((s) => s.id === slug)) {
        counter += 1;
        slug = `${base}-${counter}`;
      }
      item = { ...item, id: slug };
    }

    const exists = services.find((s) => s.id === item.id);
    let next: ServiceItem[];

    if (exists) {
      next = services.map((s) => (s.id === item.id ? item : s));
    } else {
      next = [...services, item];
    }

    setConfig({
      ...config,
      services: next,
    });

    closeDialog();
  };

  const remove = (id: string) => {
    setConfig({
      ...config,
      services: services.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-slate-900">
            Services (โครงเก่า)
          </h3>
          <p className="text-[11px] text-slate-500">
            ใช้เป็น block แสดงบริการแบบง่าย ๆ หรือจะไม่ใช้ก็ได้
          </p>
        </div>

        <button
          className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs md:text-sm font-medium hover:bg-sky-700"
          onClick={openCreate}
        >
          + เพิ่มบริการ
        </button>
      </div>

      {services.length === 0 && (
        <p className="text-sm text-slate-500">
          ยังไม่มีบริการ กด "เพิ่มบริการ" เพื่อเริ่มต้น
        </p>
      )}

      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-4 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{s.icon || "✨"}</div>
              <div>
                <h4 className="font-semibold text-slate-900">
                  {s.title || "ยังไม่ตั้งชื่อ"}
                </h4>
                <p className="text-xs text-slate-600">
                  {s.description || "ยังไม่มีรายละเอียด"}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  ID: <code>{s.id}</code>
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
                onClick={() => openEdit(s)}
              >
                แก้ไข
              </button>
              <button
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700 hover:bg-red-100"
                onClick={() => remove(s.id)}
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {dialogOpen && editItem && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg bg-white">
            <h3 className="font-bold text-lg mb-4">
              {services.find((s) => s.id === editItem.id)
                ? "แก้ไขบริการ"
                : "เพิ่มบริการใหม่"}
            </h3>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">Icon</label>
                <input
                  className="input input-bordered bg-white"
                  value={editItem.icon}
                  onChange={(e) =>
                    setEditItem({ ...editItem, icon: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">ชื่อบริการ</label>
                <input
                  className="input input-bordered bg-white"
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem({ ...editItem, title: e.target.value })
                  }
                  placeholder="เช่น ซ่อมจักรยานไฟฟ้า"
                />
              </div>

              <div className="form-control">
                <label className="label">รายละเอียด</label>
                <textarea
                  className="textarea textarea-bordered bg-white"
                  rows={3}
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="อธิบายบริการคร่าว ๆ สำหรับโชว์ในหน้าเว็บ"
                />
              </div>

              {editItem.id && (
                <p className="text-[11px] text-slate-400">
                  URL ที่ใช้ร่วมกับ product detail:{" "}
                  <code>/page/product/{editItem.id}</code>
                </p>
              )}
            </div>

            <div className="modal-action">
              <button className="btn" onClick={closeDialog}>
                ยกเลิก
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                บันทึก
              </button>
            </div>
          </div>

          <form
            method="dialog"
            className="modal-backdrop"
            onClick={closeDialog}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

type TopicsEditorProps = {
  config: SiteConfig;
  setConfig: (cfg: SiteConfig) => void;
};

const TopicsEditorView = ({ config, setConfig }: TopicsEditorProps) => {
  const topics: TopicItem[] = Array.isArray(config.topics)
    ? (config.topics as TopicItem[])
    : [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TopicItem | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  const openCreate = () => {
    setEditItem({
      id: "",
      title: "",
      summary: "",
      detail: "",
      thumbnailUrl: "",
    });
    setOriginalId(null);
    setDialogOpen(true);
  };

  const openEdit = (item: TopicItem) => {
    setEditItem({
      ...item,
      thumbnailUrl: item.thumbnailUrl || "",
    });
    setOriginalId(item.id);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    setOriginalId(null);
    setThumbUploading(false);
  };

  const handleConfirm = () => {
    if (!editItem) return;

    let rawId = editItem.id || editItem.title || "";
    if (!rawId) rawId = "service";

    let baseSlug = slugify(rawId);
    if (!baseSlug) baseSlug = "service";

    let slug = baseSlug;
    let counter = 1;
    const existing = topics.filter((t) => t.id !== originalId);
    while (existing.some((t) => t.id === slug)) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const normalized: TopicItem = {
      ...editItem,
      id: slug,
    };

    let next: TopicItem[];

    if (originalId) {
      next = [...topics.filter((t) => t.id !== originalId), normalized];
    } else {
      next = [...topics, normalized];
    }

    setConfig({ ...config, topics: next });
    closeDialog();
  };

  const remove = (id: string) => {
    setConfig({
      ...config,
      topics: topics.filter((t) => t.id !== id),
    });
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editItem) return;

    setThumbUploading(true);
    try {
      const url = await uploadSingleImage(file);
      if (!url) {
        alert("อัปโหลดรูป Thumbnail ไม่สำเร็จ");
        return;
      }

      setEditItem((prev) =>
        prev ? { ...prev, thumbnailUrl: url as string } : prev
      );
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลดรูป Thumbnail");
    } finally {
      setThumbUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setEditItem((prev) =>
      prev ? { ...prev, thumbnailUrl: "" } : prev
    );
  };

  const isEditing = !!originalId;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <div>
      <h3 className="text-sm md:text-base font-semibold text-slate-900">
        หัวข้อบริการ (Service Topics)
      </h3>
      <p className="text-[11px] text-slate-500">
        ใช้แสดงในหน้า /page/service และลิงก์ไป /page/product/[slug]
      </p>
    </div>

    <button
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-600 text-white text-xs md:text-sm font-medium shadow-sm hover:shadow-md hover:bg-sky-700 transition-all"
      onClick={openCreate}
    >
      <span className="text-base leading-none">＋</span>
      <span>เพิ่มหัวข้อ</span>
    </button>
  </div>

  {topics.length === 0 && (
    <p className="text-sm text-slate-500">
      ยังไม่มีหัวข้อ กด "เพิ่มหัวข้อ" เพื่อเริ่มต้น
    </p>
  )}

  <div className="space-y-3">
    {topics.map((t) => (
      <div
        key={t.id}
        className="p-4 border border-slate-200 rounded-2xl bg-gradient-to-r from-white to-slate-50/70 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
      >
        <div className="flex gap-3">
          {t.thumbnailUrl && (
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-slate-200 bg-white">
              <img
                src={t.thumbnailUrl}
                alt={t.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <p className="font-semibold text-slate-900">
              {t.title || "ยังไม่ตั้งหัวข้อ"}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1">
              {t.summary || t.detail || "ยังไม่มีคำอธิบาย"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              URL:{" "}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                /page/product/{t.id}
              </code>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 bg-slate-50/60 -mx-4 px-4 rounded-b-2xl">
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            onClick={() => openEdit(t)}
          >
            แก้ไข
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-xs font-medium text-red-700 hover:bg-red-100 shadow-sm transition-all"
            onClick={() => remove(t.id)}
          >
            ลบ
          </button>
        </div>
      </div>
    ))}
  </div>

 {dialogOpen && editItem && (
  <dialog className="modal modal-open">
    <div className="modal-box max-w-lg bg-white rounded-2xl p-0 shadow-2xl max-h-[90vh] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
        <div>
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
            Service Topic
          </p>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            {isEditing ? "แก้ไขหัวข้อบริการ" : "เพิ่มหัวข้อบริการใหม่"}
          </h3>
        </div>
        <button
          type="button"
          onClick={closeDialog}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* BODY – ทำให้เลื่อนในแนวตั้งได้ */}
      <div className="px-5 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700">
            รูป Thumbnail ของหัวข้อ
          </p>
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
              {editItem.thumbnailUrl ? (
                <img
                  src={editItem.thumbnailUrl}
                  alt="thumbnail-preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-400 text-xs">ไม่มีรูป</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-2">
                <span>เลือกรูป</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                  disabled={thumbUploading}
                />
              </label>
              {editItem.thumbnailUrl && (
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="text-[11px] text-red-600 hover:underline text-left"
                >
                  ลบรูป Thumbnail นี้
                </button>
              )}
              {thumbUploading && (
                <p className="text-[11px] text-sky-600">
                  ⏳ กำลังอัปโหลดรูป...
                </p>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            ใช้แสดงใน Card หน้า /page/service และในหน้าอื่น ๆ ที่ต้องโชว์หัวข้อ
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            หัวข้อ (Title)
          </label>
          <input
            className="w-full input input-bordered bg-white text-sm border-slate-300 focus:border-sky-400 focus:outline-none"
            value={editItem.title}
            onChange={(e) =>
              setEditItem({ ...editItem, title: e.target.value })
            }
            placeholder="เช่น งานซ่อมทั่วไป"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            รหัส URL (Slug)
          </label>
          <input
            className="w-full input input-bordered bg-white text-sm border-slate-300 focus:border-sky-400 focus:outline-none font-mono"
            value={editItem.id}
            onChange={(e) =>
              setEditItem({ ...editItem, id: e.target.value })
            }
            placeholder="เช่น 2ล้อ หรือ ซ่อม-2-ล้อ (ปล่อยว่างให้ระบบสร้างจากหัวข้อ)"
          />
          <p className="text-[11px] text-slate-500">
            ใช้เป็นส่วนท้ายของลิงก์ เช่น{" "}
            <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
              /page/product/{editItem.id || "2ล้อ"}
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            ข้อความสั้น (Summary)
          </label>
          <input
            className="w-full input input-bordered bg-white text-sm border-slate-300 focus:border-sky-400 focus:outline-none"
            value={editItem.summary || ""}
            onChange={(e) =>
              setEditItem({ ...editItem, summary: e.target.value })
            }
            placeholder="ข้อความสั้น ๆ หน้า list"
          />
        </div>

        <div className="space-y-1.5 pb-1">
          <label className="text-xs font-semibold text-slate-700">
            รายละเอียด (Detail)
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-white text-sm border-slate-300 focus:border-sky-400 focus:outline-none min-h-[120px]"
            rows={4}
            value={editItem.detail || ""}
            onChange={(e) =>
              setEditItem({ ...editItem, detail: e.target.value })
            }
            placeholder="รายละเอียดใช้ในหน้า detail หรือ backup text"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-5 py-3 sm:py-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row gap-2 sm:justify-end shrink-0">
        <button
          type="button"
          className="btn btn-ghost btn-sm sm:btn-md text-slate-600 hover:bg-slate-100"
          onClick={closeDialog}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm sm:btn-md bg-sky-600 hover:bg-sky-700 border-sky-600"
          onClick={handleConfirm}
          disabled={thumbUploading}
        >
          บันทึก
        </button>
      </div>
    </div>

    <form
      method="dialog"
      className="modal-backdrop"
      onClick={closeDialog}
    >
      <button>close</button>
    </form>
  </dialog>
)}

</div>
  );
};

type ServiceDetailEditorProps = {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
};

const ServiceDetailEditorView = ({
  config,
  setConfig,
}: ServiceDetailEditorProps) => {
  const topics: TopicItem[] = Array.isArray(config.topics)
    ? (config.topics as TopicItem[])
    : [];

  const details: ServiceDetailItem[] = Array.isArray(config.serviceDetails)
    ? (config.serviceDetails as ServiceDetailItem[])
    : [];

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    topics[0]?.id ?? ""
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!selectedTopicId && topics[0]?.id) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  const handleChangeTopic = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedTopicId(newId);
  };

  const updateDetail = (
    updater: (detail: ServiceDetailItem) => ServiceDetailItem
  ) => {
    if (!selectedTopicId) return;

    setConfig((prev) => {
      const prevDetails: ServiceDetailItem[] = Array.isArray(
        prev.serviceDetails
      )
        ? (prev.serviceDetails as ServiceDetailItem[])
        : [];

      const idx = prevDetails.findIndex(
        (d) => d.topicId === selectedTopicId
      );

      const base: ServiceDetailItem =
        idx !== -1
          ? {
              ...prevDetails[idx],
              images: prevDetails[idx].images || [],
              sections: prevDetails[idx].sections || [],
            }
          : {
              id: "",
              topicId: selectedTopicId,
              title: "",
              description: "",
              images: [],
              sections: [],
            };

      const updatedRaw = updater(base);
      const updated: ServiceDetailItem = {
        ...updatedRaw,
        topicId: selectedTopicId,
        id: updatedRaw.id || base.id || uuid(),
        images: updatedRaw.images || [],
        sections: updatedRaw.sections || [],
      };

      let nextDetails: ServiceDetailItem[];
      if (idx !== -1) {
        nextDetails = [...prevDetails];
        nextDetails[idx] = updated;
      } else {
        nextDetails = [...prevDetails, updated];
      }

      return {
        ...prev,
        serviceDetails: nextDetails,
      };
    });
  };

  if (topics.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
          <h3 className="text-base md:text-xl font-bold text-slate-900 mb-1">
            ยังไม่มี Service Topics
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            โปรดไปเพิ่มหัวข้อในเมนู{" "}
            <span className="font-semibold text-sky-700">หัวข้อบริการ</span>{" "}
            ก่อน แล้วจึงกลับมาจัดการรายละเอียดบริการ
          </p>
        </div>
      </div>
    );
  }

  const currentTopic = topics.find((t) => t.id === selectedTopicId) ?? topics[0];
  const currentDetail: ServiceDetailItem | null = currentTopic
    ? (() => {
        const found = details.find((d) => d.topicId === currentTopic.id);
        if (found) {
          return {
            ...found,
            images: found.images || [],
            sections: found.sections || [],
          };
        }
        return {
          id: "",
          topicId: currentTopic.id,
          title: "",
          description: "",
          images: [],
          sections: [],
        };
      })()
    : null;

  if (!currentTopic || !currentDetail) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-center text-sm text-slate-600">
          เลือกหัวข้อด้านบนเพื่อเริ่มเพิ่มรายละเอียด
        </p>
      </div>
    );
  }

  const images = currentDetail.images || [];
  const sections = currentDetail.sections || [];

  const handleFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newUrls = await uploadImages(files);
      updateDetail((d) => ({
        ...d,
        images: [...(d.images || []), ...newUrls],
      }));
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลดรูป");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    updateDetail((d) => ({
      ...d,
      images: (d.images || []).filter((img) => img !== url),
    }));
  };

  const addSection = () => {
    updateDetail((d) => ({
      ...d,
      sections: [
        ...(d.sections || []),
        {
          id: uuid(),
          title: "",
          description: "",
          images: [],
        },
      ],
    }));
  };

  const updateSectionField = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    updateDetail((d) => {
      const sections = d.sections || [];
      const next = sections.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...d, sections: next };
    });
  };

  const removeSection = (index: number) => {
    updateDetail((d) => {
      const sections = d.sections || [];
      const next = sections.filter((_, i) => i !== index);
      return { ...d, sections: next };
    });
  };

  const handleSectionFilesChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newUrls = await uploadImages(files);
      updateDetail((d) => {
        const sections = d.sections || [];
        const target = sections[index];
        if (!target) return d;

        const nextSections = sections.map((s, i) =>
          i === index
            ? { ...s, images: [...(s.images || []), ...newUrls] }
            : s
        );
        return { ...d, sections: nextSections };
      });
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดระหว่างอัปโหลดรูปหัวข้อย่อย");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeSectionImage = (index: number, url: string) => {
    updateDetail((d) => {
      const sections = d.sections || [];
      const target = sections[index];
      if (!target) return d;

      const nextSections = sections.map((s, i) =>
        i === index
          ? { ...s, images: (s.images || []).filter((img) => img !== url) }
          : s
      );
      return { ...d, sections: nextSections };
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shadow-sm">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide">
              Service Detail
            </p>
            <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
              จัดการรายละเอียดบริการ & รูปภาพ
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              เลือกหัวข้อ แล้วเพิ่มข้อความ รูปภาพ และหัวข้อย่อย เช่น ยาง, เปลี่ยนแบต
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:min-w-[360px]">
          <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
            เลือกหัวข้อ:
          </span>
          <select
            className="select select-bordered w-full bg-white border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-xs sm:text-sm"
            value={currentTopic.id}
            onChange={handleChangeTopic}
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 bg-sky-50 border-b border-sky-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-sky-800">
              หัวข้อ: {currentTopic.title}
            </p>
          </div>
          <p className="text-[11px] text-sky-700">
            รูปทั้งหมดตอนนี้:{" "}
            <span className="font-semibold">
              {images.length +
                sections.reduce(
                  (sum, s) => sum + (s.images?.length || 0),
                  0
                )}{" "}
              รูป
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-white to-slate-50">
        <div className="space-y-6">
          <div className="form-control">
            <label className="label flex-col items-start gap-0.5 sm:flex-row sm:items-center">
              <span className="label-text font-semibold text-slate-700 text-xs">
                หัวข้อใหญ่ของหน้า
              </span>
              <span className="label-text-alt text-slate-500 text-[11px]">
                ถ้าเว้นว่างจะใช้หัวข้อจาก Service Topic แทน
              </span>
            </label>
            <input
              className="input input-bordered bg-white border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-sm"
              value={currentDetail.title}
              onChange={(e) =>
                updateDetail((d) => ({ ...d, title: e.target.value }))
              }
              placeholder={
                currentTopic?.title
                  ? `เช่น รายละเอียด: ${currentTopic.title}`
                  : "หัวข้อใหญ่บนหน้า"
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-slate-700 text-xs">
                ข้อความอธิบายรวมของบริการนี้
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered bg-white border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-sm"
              rows={6}
              value={currentDetail.description || ""}
              onChange={(e) =>
                updateDetail((d) => ({
                  ...d,
                  description: e.target.value,
                }))
              }
              placeholder="ใส่รายละเอียดบริการโดยรวม เช่น ขอบเขต, ขั้นตอนหลัก, เงื่อนไข ฯลฯ"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap bg-sky-50 border border-sky-100 rounded-xl p-4">
            <div>
              <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>📸</span>
                <span>รูปภาพรวมของบริการนี้</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                ใช้เป็นรูป hero/รวมบริการ รูปหัวข้อย่อยจะอยู่อีกส่วนด้านล่าง
              </p>
            </div>

            <label className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium cursor-pointer">
              <span>เลือกรูป</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFilesChange}
                disabled={uploading}
              />
            </label>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-sky-700 bg-sky-50 border border-sky-100 rounded-lg p-3">
              <div className="loading loading-spinner loading-sm" />
              <span>กำลังอัปโหลดรูป กรุณารอสักครู่...</span>
            </div>
          )}

          {images.length === 0 && !uploading && (
            <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-xl bg-white">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="text-sm text-slate-500 px-4">
                ยังไม่มีรูปภาพรวมของบริการนี้ • กดปุ่มเลือกรูปด้านบนเพื่ออัปโหลด
              </p>
            </div>
          )}

          {images.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                รูปภาพรวม ({images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((url, index) => (
                  <div
                    key={url}
                    className="group border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={url}
                        alt={`service-detail-main-${index + 1}`}
                        className="w-full h-24 sm:h-28 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        onClick={() => removeImage(url)}
                      >
                        ✕
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="px-2 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 truncate">
                        รูปที่ {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-[11px] font-medium text-red-600 hover:bg-red-100"
                      >
                        <span>🗑️</span>
                        <span>ลบรูป</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-800">
                หัวข้อย่อยภายในบริการนี้
              </p>
              <p className="text-xs text-slate-600 mt-1">
                เช่น ยาง, เปลี่ยนแบต, ระบบไฟ แต่ละหัวข้อมีรูปและคำอธิบายของตัวเอง
              </p>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium"
            >
              + เพิ่มหัวข้อย่อย
            </button>
          </div>

          {sections.length === 0 && (
            <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl py-6 px-4 bg-white">
              ยังไม่มีหัวข้อย่อย ลองเพิ่มหัวข้อ เช่น "เปลี่ยนยาง", "เปลี่ยนแบตเตอรี่"
              เป็นต้น
            </div>
          )}

          {sections.length > 0 && (
            <div className="space-y-4">
              {sections.map((sec, index) => {
                const secImages = sec.images || [];
                return (
                  <div
                    key={sec.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-50 text-xs font-semibold text-sky-700">
                            {index + 1}
                          </span>
                          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                            Sub Service
                          </p>
                        </div>
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-xs font-medium text-slate-700">
                              ชื่อหัวข้อย่อย
                            </span>
                          </label>
                          <input
                            className="input input-bordered bg-white border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-sm"
                            value={sec.title}
                            onChange={(e) =>
                              updateSectionField(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="เช่น เปลี่ยนยาง, เปลี่ยนแบตเตอรี่"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-[11px] font-medium text-red-600 hover:bg-red-100"
                      >
                        <span>🗑️</span>
                        <span>ลบหัวข้อ</span>
                      </button>
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-xs font-medium text-slate-700">
                          รายละเอียดของหัวข้อย่อยนี้
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered bg-white border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-sm"
                        rows={3}
                        value={sec.description || ""}
                        onChange={(e) =>
                          updateSectionField(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="ใส่รายละเอียดเฉพาะของหัวข้อย่อยนี้ เช่น สิ่งที่ตรวจเช็ค, อะไหล่ที่ใช้, เงื่อนไข ราคาโดยประมาณ ฯลฯ"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-xs font-semibold text-slate-700">
                          รูปภาพของหัวข้อย่อยนี้ ({secImages.length})
                        </p>
                        <label className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium cursor-pointer">
                          <span>เลือกรูป</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSectionFilesChange(index, e)
                            }
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      {secImages.length === 0 && (
                        <div className="border border-dashed border-slate-300 rounded-xl py-4 px-3 text-xs text-slate-500 bg-slate-50/60">
                          ยังไม่มีรูปสำหรับหัวข้อย่อยนี้
                        </div>
                      )}

                      {secImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {secImages.map((url) => (
                            <div
                              key={url}
                              className="group border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
                            >
                              <div className="relative">
                                <img
                                  src={url}
                                  alt={`sub-section-${index + 1}`}
                                  className="w-full h-20 sm:h-24 object-cover"
                                />
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                  onClick={() =>
                                    removeSectionImage(index, url)
                                  }
                                >
                                  ✕
                                </button>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeSectionImage(index, url)
                                }
                                className="px-2 py-1 border-t border-slate-100 bg-slate-50 text-[11px] text-red-600 font-medium hover:bg-red-50"
                              >
                                ลบรูป
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function AdminPageInner() {
  const [config, setConfig] = useState<SiteConfig>(createEmptyConfig());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config");
        if (!res.ok) throw new Error("Failed to load config");
        const json = (await res.json()) as SiteConfig;
        setConfig({
          ...createEmptyConfig(),
          ...json,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save config");

      setNotice("บันทึกข้อมูลเรียบร้อยแล้ว");
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      console.error(err);
      setNotice("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
      setTimeout(() => setNotice(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-900">
            กำลังโหลดข้อมูลเว็บ...
          </p>
          <p className="text-xs text-slate-500">
            โปรดรอสักครู่ ระบบกำลังดึงค่าจากเซิร์ฟเวอร์
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={(s) => {
          setActiveSection(s);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <AdminHeader
        onSave={handleSave}
        saving={saving}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {notice && (
        <div className="fixed top-20 right-3 sm:right-4 md:right-6 z-50">
          <div className="px-4 md:px-6 py-2.5 bg-emerald-500 rounded-xl shadow-lg text-white text-xs md:text-sm font-medium flex items-center gap-2">
            <span>✓</span>
            {notice}
          </div>
        </div>
      )}

      <main className="pt-20 md:pt-20 md:ml-64">
        <div className="p-3 sm:p-4 md:p-8 max-w-6xl mx-auto space-y-6">
          {activeSection === "dashboard" && <DashboardView config={config} />}
          {activeSection === "hero" && (
            <HeroEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "services" && (
            <ServicesEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "homeGallery" && (
            <HomeGalleryEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "topics" && (
            <TopicsEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "theme" && (
            <ThemeEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "serviceDetail" && (
            <ServiceDetailEditorView config={config} setConfig={setConfig} />
          )}
          {activeSection === "contact" && (
            <ContactEditorView config={config} setConfig={setConfig} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return <AdminPageInner />;
}
