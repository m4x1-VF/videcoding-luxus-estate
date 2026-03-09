"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersButton from "./FiltersButton";

export default function SearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get("query") || "";
  const currentType = searchParams.get("type") || "All";

  const [searchInput, setSearchInput] = useState(currentQuery);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("query", searchInput);
    } else {
      params.delete("query");
    }
    // reset to page 1 on search
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const handleTypeSelect = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "All") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          Find your <span className="relative inline-block">
          <span className="relative z-10 font-medium">sanctuary</span>
          <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
        </span>.
      </h1>
      
      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">search</span>
        </div>
        <input 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg" 
          placeholder="Search by city, neighborhood, or address..." 
          type="text"
        />
        <button 
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
        >
            Search
        </button>
      </form>

      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
        {["All", "House", "Apartment", "Villa", "Penthouse"].map((type) => {
          const isActive = currentType === type || (!searchParams.has("type") && type === "All");
          return (
            <button 
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={
                isActive
                  ? "whitespace-nowrap px-5 py-2 rounded-full bg-nordic-dark text-white text-sm font-medium shadow-lg shadow-nordic-dark/10 transition-transform hover:-translate-y-0.5"
                  : "whitespace-nowrap px-5 py-2 rounded-full bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 text-sm font-medium transition-all hover:bg-mosque/5"
              }
            >
                {type}
            </button>
          );
        })}
        <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
        <FiltersButton />
      </div>
    </div>
  );
}
