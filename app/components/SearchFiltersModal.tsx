"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "../i18n";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const { t } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState<string>(t.filters.anyType);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery(searchParams.get("query") || "");
      setMinPrice(searchParams.get("minPrice") || "");
      setMaxPrice(searchParams.get("maxPrice") || "");
      setType(searchParams.get("type") || t.filters.anyType);
      setBeds(parseInt(searchParams.get("beds") || "0", 10));
      setBaths(parseInt(searchParams.get("baths") || "0", 10));
      const am = searchParams.getAll("amenities");
      setAmenities(am.length > 0 ? am : ["wifi", "pool"]);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, searchParams, t.filters.anyType]);

  if (!isOpen) return null;

  const toggleAmenity = (val: string) => {
    setAmenities(prev => 
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    );
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) params.set("query", query); else params.delete("query");
    if (minPrice) params.set("minPrice", minPrice.replace(/\D/g, "")); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice.replace(/\D/g, "")); else params.delete("maxPrice");
    if (type && type !== t.filters.anyType && type !== "All") params.set("type", type); else params.delete("type");
    if (beds > 0) params.set("beds", beds.toString()); else params.delete("beds");
    if (baths > 0) params.set("baths", baths.toString()); else params.delete("baths");
    
    params.delete("amenities");
    amenities.forEach(a => params.append("amenities", a));
    
    params.delete("page");
    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setType(t.filters.anyType);
    setBeds(0);
    setBaths(0);
    setAmenities([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("type");
    params.delete("beds");
    params.delete("baths");
    params.delete("amenities");
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Modal Container */}
      <main className="relative z-20 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t.filters.title}</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t.filters.location}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm" 
                placeholder={t.filters.locationPlaceholder} 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t.filters.priceRange}
              </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t.filters.minPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm" 
                    type="text" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="1,200,000"
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t.filters.maxPrice}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm" 
                    type="text" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="4,500,000"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t.filters.propertyType}
              </label>
              <div className="relative">
                <select 
                   className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value={t.filters.anyType}>{t.filters.anyType}</option>
                  <option value="House">{t.search.filterChips.house}</option>
                  <option value="Apartment">{t.search.filterChips.apartment}</option>
                  <option value="Villa">{t.search.filterChips.villa}</option>
                  <option value="Penthouse">{t.search.filterChips.penthouse}</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{t.filters.bedrooms}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button 
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{beds > 0 ? `${beds}+` : t.filters.any}</span>
                  <button 
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{t.filters.bathrooms}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button 
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{baths > 0 ? `${baths}+` : t.filters.any}</span>
                  <button 
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t.filters.amenities}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: "pool", label: t.filters.amenityList.pool, icon: "pool" },
                { id: "gym", label: t.filters.amenityList.gym, icon: "fitness_center" },
                { id: "parking", label: t.filters.amenityList.parking, icon: "local_parking" },
                { id: "ac", label: t.filters.amenityList.ac, icon: "ac_unit" },
                { id: "wifi", label: t.filters.amenityList.wifi, icon: "wifi" },
                { id: "patio", label: t.filters.amenityList.patio, icon: "deck" }
              ].map(amenity => {
                const isActive = amenities.includes(amenity.id);
                return (
                  <label key={amenity.id} className="cursor-pointer group relative" onClick={(e) => { e.preventDefault(); toggleAmenity(amenity.id); }}>
                    <input checked={isActive} readOnly className="peer sr-only" type="checkbox" />
                    <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        isActive 
                          ? "border-mosque bg-mosque/5 text-mosque font-medium hover:bg-mosque/10" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}>
                      <span className={`material-icons text-lg ${!isActive && "text-gray-400 group-hover:text-gray-500"}`}>{amenity.icon}</span>
                      {amenity.label}
                    </div>
                    {isActive && <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {t.filters.clearAll}
          </button>
          <button 
            onClick={handleApply}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
          >
            {t.filters.showHomes}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}

