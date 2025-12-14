"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";


type HeaderProps = {
  phone?: string;
  line?: string;
};

export default function Header({ phone = "", line = "" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const hasPhone = !!phone;
  const hasLine = !!line;
    const handlePhoneClick = () => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "phone_click",
      phone_number: phone,
    });
  }
};

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg)] shadow-md border-b border-[var(--color-primary-soft)]"
            : "bg-[var(--color-bg)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <a
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-base sm:text-lg font-semibold text-[var(--color-primary)]">
                ShodaiEV
              </span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                {hasLine && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-surface)]">
                    <Image
  src="/LINE_Brand_icon.png"
  alt="LINE"
  width={24}
  height={24}
  loading="lazy"
  className="w-6 h-6"
/>

                    <span className="text-sm sm:text-base font-semibold text-[var(--color-primary)] break-all">
                      {line}
                    </span>
                  </div>
                )}

                {hasPhone && (
                  
                   <a
  href={`tel:${phone}`}
  onClick={handlePhoneClick}
  className="block w-full rounded-2xl bg-[var(--color-bg)] p-4 sm:p-5 border border-[var(--color-primary-soft)] hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all"
>
                    <div className="h-8 w-px bg-[var(--color-primary-soft)]" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-surface)]">
                      <span className="text-xl">📞</span>
                      <span className="text-sm sm:text-base font-semibold text-[var(--color-primary)] break-all">
                        {phone}
                      </span>
                    </div>
                  </a>
                )}
              </div>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full text-white font-semibold text-sm sm:text-base shadow-sm"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-accent), var(--color-primary))",
                }}
              >
                Contact
              </motion.a>
            </div>

            <button
              type="button"
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-surface)]"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Toggle menu</span>
              <div className="relative w-5 h-5">
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-[var(--color-primary)] transition-transform duration-200 ${
                    open ? "top-1/2 rotate-45" : "top-[4px]"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-[var(--color-primary)] transition-opacity duration-200 ${
                    open ? "opacity-0" : "top-1/2"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-[var(--color-primary)] transition-transform duration-200 ${
                    open ? "top-1/2 -rotate-45" : "bottom-[4px]"
                  }`}
                />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-3 flex flex-col gap-3 md:hidden"
              >
                <div className="flex flex-col gap-2">
                  {hasLine && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-surface)]">
                      <Image
  src="/LINE_Brand_icon.png"
  alt="LINE"
  width={24}
  height={24}
  loading="lazy"
  className="w-6 h-6"
/>

                      <span className="text-sm font-semibold text-[var(--color-primary)] break-all">
                        {line}
                      </span>
                    </div>
                  )}

                  {hasPhone && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-surface)]">
                      <span className="text-lg">📞</span>
                      <span className="text-sm font-semibold text-[var(--color-primary)] break-all">
                        {phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 text-center px-4 py-2 rounded-full text-white font-semibold text-sm shadow-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--color-accent), var(--color-primary))",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Contact
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <div className="h-14 sm:h-16" />
    </>
  );
}
