"use client";

import { useState } from "react";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  isFeatured?: boolean;
  status?: string | null;
}

export default function PropertyGallery({ images, title, isFeatured, status }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
        <Image
          src={selectedImage}
          alt={title}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {isFeatured && (
            <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {status && (
            <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {status}
            </span>
          )}
        </div>
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
          <span className="material-icons text-sm">grid_view</span>
          View All {images.length} Photos
        </button>
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto hide-scroll py-2 px-2 snap-x">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`flex-none w-48 aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer snap-start transition-all duration-300 ${
                selectedImage === img
                  ? "ring-2 ring-mosque ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-100 hover:ring-2 hover:ring-mosque/50 hover:ring-offset-2"
              }`}
            >
              <Image
                src={img}
                alt={`${title} photo ${index + 1}`}
                className="object-cover"
                fill
                sizes="192px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
