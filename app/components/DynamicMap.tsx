"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="material-icons text-gray-400 text-3xl">map</span>
    </div>
  ),
});

export default function DynamicMap({ location }: { location: string }) {
  return <Map location={location} />;
}
