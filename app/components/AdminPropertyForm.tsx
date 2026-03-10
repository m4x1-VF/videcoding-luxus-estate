"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../lib/supabase/client";
import { DbProperty } from "../lib/supabase";

export default function AdminPropertyForm({
  initialData,
}: {
  initialData?: DbProperty;
}) {
  const router = useRouter();
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Db Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [priceNumeric, setPriceNumeric] = useState(
    initialData?.price_numeric?.toString() || "",
  );
  const [status, setStatus] = useState(initialData?.status || "FOR SALE");
  const [location, setLocation] = useState(initialData?.location || "");

  // Area is stored as string like "3200 sqft", extracting number if possible
  const [area, setArea] = useState(() => {
    if (!initialData?.area) return "";
    return initialData.area.replace(/\D/g, "");
  });

  const [beds, setBeds] = useState(initialData?.beds ?? 3);
  const [baths, setBaths] = useState(initialData?.baths ?? 2);
  const [isFeatured, setIsFeatured] = useState(
    initialData?.is_featured ?? false,
  );

  // DB Images
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Fake UI Fields (Not in DB)
  const [propertyType, setPropertyType] = useState("apartment");
  const [description, setDescription] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [parking, setParking] = useState(1);
  const [amenities, setAmenities] = useState({
    pool: false,
    garden: true,
    ac: false,
    smartHome: false,
  });

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);

      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const removeNewImage = (indexToRemove: number) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);
    setNewImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const generateSlug = (text: string) => {
    return (
      text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "") +
      "-" +
      Math.floor(Math.random() * 1000)
    );
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!title || !priceNumeric) {
        throw new Error("Title and Price are required.");
      }

      const numPrice = parseFloat(priceNumeric);
      if (isNaN(numPrice)) {
        throw new Error("Price must be a valid number.");
      }

      // Upload new images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      for (const file of newImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `property_images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("properties")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);
        uploadedImageUrls.push(data.publicUrl);
      }

      const finalImages = [...existingImages, ...uploadedImageUrls];
      if (finalImages.length === 0) {
        throw new Error("At least one image is required.");
      }

      const isRental = status.toLowerCase().includes("rent");

      const propertyData = {
        title,
        location,
        price: formatPrice(numPrice),
        price_numeric: numPrice,
        status,
        beds,
        baths,
        area: area ? `${area} sqft` : "",
        images: finalImages,
        slug: initialData?.slug || generateSlug(title),
        is_rental: isRental,
        is_featured: isFeatured,
      };

      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from("properties")
          .insert([propertyData]);

        if (insertError) throw insertError;
      }

      router.push("/admin/properties");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while saving the property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start my-8 font-sf"
    >
      {error && (
        <div className="xl:col-span-12 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2">
          <span className="material-icons text-sm">error</span> {error}
        </div>
      )}

      <div className="xl:col-span-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic-dark font-display">
              Basic Information
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label
                className="block text-sm font-medium text-nordic-dark mb-1.5"
                htmlFor="title"
              >
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all"
                id="title"
                placeholder="e.g. Modern Penthouse with Ocean View"
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-nordic-dark mb-1.5"
                  htmlFor="price"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    required
                    value={priceNumeric}
                    onChange={(e) => setPriceNumeric(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium"
                    id="price"
                    placeholder="0.00"
                    type="number"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-nordic-dark mb-1.5"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                  id="status"
                >
                  <option value="FOR SALE">For Sale</option>
                  <option value="FOR RENT">For Rent</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-nordic-dark mb-1.5"
                  htmlFor="type"
                >
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base cursor-pointer"
                  id="type"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic-dark font-display">
              Description
            </h2>
          </div>
          <div className="p-8">
            <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
              <button
                className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                type="button"
              >
                <span className="material-icons text-lg">format_bold</span>
              </button>
              <button
                className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                type="button"
              >
                <span className="material-icons text-lg">format_italic</span>
              </button>
              <button
                className="p-1.5 text-gray-400 hover:text-nordic-dark hover:bg-gray-50 rounded transition-colors"
                type="button"
              >
                <span className="material-icons text-lg">
                  format_list_bulleted
                </span>
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base leading-relaxed resize-y min-h-[200px]"
              id="description"
              placeholder="Describe the property features, neighborhood, and unique selling points..."
            ></textarea>
            <div className="mt-2 text-right text-xs text-gray-400">
              {description.length} / 2000 characters
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic-dark font-display">
                Gallery
              </h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              JPG, PNG, WEBP
            </span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
              <input
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                multiple
                type="file"
                accept="image/png, image/jpeg, image/webp"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic-dark">
                    Click or drag images here
                  </p>
                  <p className="text-xs text-gray-400">
                    Max file size 5MB per image
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {existingImages.map((src, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-200"
                >
                  <Image
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    alt={`Property Image ${idx + 1}`}
                    className="object-cover"
                    src={src}
                  />
                  <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      onClick={() => removeExistingImage(idx)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow"
                      type="button"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider backdrop-blur">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {newImagePreviews.map((src, idx) => (
                <div
                  key={`new-${idx}`}
                  className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-200"
                >
                  <Image
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    alt={`New Upload ${idx + 1}`}
                    className="object-cover"
                    src={src}
                  />
                  <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      onClick={() => removeNewImage(idx)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow"
                      type="button"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {idx === 0 && existingImages.length === 0 && (
                    <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider backdrop-blur">
                      Main (New)
                    </span>
                  )}
                </div>
              ))}

              {/* Just a decorative 'add more' button matching design */}
              <button
                className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/20 transition-all group relative"
                type="button"
              >
                <input
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  multiple
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                />
                <span className="material-icons group-hover:scale-110 transition-transform">
                  add
                </span>
                <span className="text-xs mt-1 font-medium">Add More</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic-dark font-display">
              Location
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-nordic-dark mb-1.5"
                htmlFor="location"
              >
                Address
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-nordic-dark placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                id="location"
                placeholder="Street Address, City, Zip"
                type="text"
              />
            </div>
            {/* Visual map preview only */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <Image
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                alt="Map view of city streets"
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS55FY7gfArnlTpNsdabJk9nBO5uQJgOwIsl8beO34JRZ9dMmjLoIkTuTUO72Y9L5tUmQqTReQWebUWadAWwLusGmRQiIict5sqY--yRaOxuYpTzfR4vv4RKh1ex6oxY64e0kbSeMudNO6pv-gG0WzVWs-pDfvQm5IoTQ1mT-tAV49LDkXAHZl317M1-D7eZw3N8o2ExKWTgg6oMAXOFVnkApIqnb7TZHekwSw8pWQxpJV2EKI8EQKQbQXJaSbjN8gB1n8b-ueWj8"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-white/90 text-nordic-dark px-3 py-1.5 rounded shadow-sm backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                  <span className="material-icons text-sm text-mosque">
                    map
                  </span>{" "}
                  Preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tracking db matching */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic-dark">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic-dark font-display">
              Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label
                  className="text-xs text-gray-500 font-medium mb-1 block"
                  htmlFor="area"
                >
                  Area (sqft)
                </label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  id="area"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="group">
                <label
                  className="text-xs text-gray-500 font-medium mb-1 block"
                  htmlFor="year"
                >
                  Year Built
                </label>
                <input
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm"
                  id="year"
                  placeholder="YYYY"
                  type="number"
                />
              </div>
            </div>
            <hr className="border-gray-100" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    bed
                  </span>{" "}
                  Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    value={beds}
                    readOnly
                    className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                    type="text"
                  />
                  <button
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    shower
                  </span>{" "}
                  Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    value={baths}
                    readOnly
                    className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                    type="text"
                  />
                  <button
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic-dark flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">
                    directions_car
                  </span>{" "}
                  Parking
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setParking(Math.max(0, parking - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    value={parking}
                    readOnly
                    className="w-10 text-center border-none bg-transparent text-nordic-dark p-0 focus:ring-0 text-sm font-medium"
                    type="text"
                  />
                  <button
                    onClick={() => setParking(parking + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Is Featured Checkbox (DB tracking) */}
            <div>
              <h3 className="font-bold text-nordic-dark mb-3 uppercase tracking-wider text-xs text-gray-500">
                Visibility
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                    Is Featured Property
                  </span>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="font-bold text-nordic-dark mb-3 uppercase tracking-wider text-xs text-gray-500">
                Amenities
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    checked={amenities.pool}
                    onChange={(e) =>
                      setAmenities({ ...amenities, pool: e.target.checked })
                    }
                    className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                    Swimming Pool
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    checked={amenities.garden}
                    onChange={(e) =>
                      setAmenities({ ...amenities, garden: e.target.checked })
                    }
                    className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                    Garden
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    checked={amenities.ac}
                    onChange={(e) =>
                      setAmenities({ ...amenities, ac: e.target.checked })
                    }
                    className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                    Air Conditioning
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    checked={amenities.smartHome}
                    onChange={(e) =>
                      setAmenities({
                        ...amenities,
                        smartHome: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque"
                    type="checkbox"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-nordic-dark transition-colors">
                    Smart Home
                  </span>
                </label>
              </div>
            </div>

            {/* Desktop Save Button */}
            <div className="hidden md:block pt-4">
              <button
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-mosque hover:bg-nordic-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <span className="material-icons animate-spin text-sm">
                    refresh
                  </span>
                ) : (
                  <span className="material-icons text-sm">save</span>
                )}
                {initialData ? "Update Property" : "Save Property"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden z-40 flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic-dark font-medium"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          type="submit"
          className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
