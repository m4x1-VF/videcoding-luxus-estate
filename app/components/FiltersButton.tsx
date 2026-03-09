"use client";

import React, { useState } from "react";
import SearchFiltersModal from "./SearchFiltersModal";
import { useTranslations } from "../i18n";

export default function FiltersButton() {
  const { t } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
      >
        <span className="material-icons text-base">tune</span> {t.filters.title}
      </button>

      <SearchFiltersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
