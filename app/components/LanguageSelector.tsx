"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, LOCALES, Locale } from "../i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslations();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-nordic-dark/10 hover:border-mosque/40 hover:bg-mosque/5 transition-all text-sm font-medium text-nordic-dark"
        aria-label="Select language"
      >
        <img 
          src={current.flag} 
          alt={current.label} 
          className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-black/5"
        />
        <span className="hidden sm:inline tracking-wide uppercase text-xs font-bold text-nordic-dark/70">
          {current.code}
        </span>
        <span
          className={`material-icons text-sm text-nordic-dark/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-soft border border-nordic-dark/5 overflow-hidden z-50 animate-fadeIn">
          {LOCALES.map((l) => {
            const isSelected = l.code === locale;
            return (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-mosque/8 text-mosque font-semibold"
                    : "text-nordic-dark hover:bg-gray-50"
                }`}
              >
                <img 
                  src={l.flag} 
                  alt={l.label} 
                  className="w-6 h-4 object-cover rounded-[2px] shadow-xs border border-black/5"
                />
                <span className="flex-1 text-left">{l.label}</span>
                {isSelected && (
                  <span className="material-icons text-sm text-mosque">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
