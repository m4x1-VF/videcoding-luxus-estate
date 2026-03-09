"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTranslations } from "../i18n";

export default function StatusTabs() {
  const { t } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "All";

  const handleStatusSelect = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="hidden md:flex bg-white p-1 rounded-lg">
      {[
        { id: "All", label: t.status.all },
        { id: "Buy", label: t.status.buy },
        { id: "Rent", label: t.status.rent },
      ].map((tab) => {
        const isActive = currentStatus === tab.id || (!searchParams.has("status") && tab.id === "All");
        return (
          <button 
            key={tab.id}
            onClick={() => handleStatusSelect(tab.id)}
            className={
              isActive
                ? "px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm"
                : "px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

