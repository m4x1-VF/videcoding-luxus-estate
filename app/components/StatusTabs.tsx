"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StatusTabs() {
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
      {["All", "Buy", "Rent"].map((status) => {
        const isActive = currentStatus === status || (!searchParams.has("status") && status === "All");
        return (
          <button 
            key={status}
            onClick={() => handleStatusSelect(status)}
            className={
              isActive
                ? "px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm"
                : "px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark"
            }
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
