import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyBySlugOrId } from "../lib/supabase";
import Navbar from "../components/Navbar";
import DynamicMap from "../components/DynamicMap";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlugOrId(slug);

  if (!property) {
    return {
      title: "Property Not Found | Luxe Estate",
    };
  }

  return {
    title: `${property.title} | Luxe Estate`,
    description: `View details for the stunning property located in ${property.location} available for ${property.price}.`,
    openGraph: {
      title: `${property.title} - Luxe Estate`,
      description: `View details for the stunning property located in ${property.location}.`,
      images: [{ url: property.images?.[0] ?? property.image_url }],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlugOrId(slug);

  if (!property) {
    notFound();
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [property.image_url];
  const mainImage = images[0];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <Image 
                src={mainImage}
                alt={property.title}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.is_featured && (
                  <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Featured</span>
                )}
                {property.status && (
                  <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">{property.status}</span>
                )}
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                <span className="material-icons text-sm">grid_view</span>
                View All Photos
              </button>
            </div>
            
            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scroll snap-x py-4 px-4 items-center">
                {images.map((img, index) => (
                  <div key={index} className="flex-none snap-start">
                    <div className="p-[2px] rounded-[10px] bg-mosque">
                      <div className="border-[2px] border-white rounded-[8px]">
                        <div className="w-48 aspect-[4/3] relative rounded-[6px] overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                          <Image 
                            src={img}
                            alt={`${property.title} photo ${index + 1}`}
                            className="object-cover"
                            fill
                            sizes="192px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Agent */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic-dark mb-2">
                    {property.price}
                    {property.is_rental && <span className="text-xl font-normal text-nordic-muted">/mo</span>}
                  </h1>
                  <p className="text-nordic-muted font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 my-6"></div>
                
                {/* Fixed Agent details for UI mockup purposes */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                      alt="Sarah Jenkins"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>Top Rated Agent</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    Schedule Visit
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    Contact Agent
                  </button>
                </div>
              </div>

              {/* Map View Fragment */}
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 p-[1px]">
                  <DynamicMap location={property.location} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Features Section */}
        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8 max-w-4xl">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Property Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">bathtub</span>
                <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                <span className="text-xl font-bold text-nordic-dark">2</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Garage</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark">About this home</h2>
            <div className="prose prose-slate max-w-none text-nordic-muted leading-relaxed">
              <p className="mb-4">
                Experience modern luxury in this architecturally stunning home located in {property.location}. 
                Designed with an emphasis on indoor-outdoor living, the residence features pristine spaces that flood the interiors with natural light.
              </p>
              <p>
                {property.title} represents a unique opportunity for discerning buyers seeking {property.beds} bedrooms and {property.baths} bathrooms of pure comfort, spanning over {property.area}.
                The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts.
              </p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Read more
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {["Smart Home System", "Swimming Pool", "Central Heating & Cooling", "Electric Vehicle Charging", "Private Gym", "Wine Cellar"].map(amenity => (
                <div key={amenity} className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                <span className="material-icons">calculate</span>
              </div>
              <div>
                <h3 className="font-semibold text-nordic-dark">Estimated Payment</h3>
                <p className="text-sm text-nordic-muted">Starting from <strong className="text-mosque">{property.price_numeric ? `$${(property.price_numeric * 0.005).toLocaleString('en-US', {maximumFractionDigits:0})}/mo` : "$5,430/mo"}</strong> with 20% down</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
              Calculate Mortgage
            </button>
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-nordic-muted">
                © 2026 LuxeEstate Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
                <a className="text-nordic-muted hover:text-mosque transition-colors" href="#">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                </a>
                <a className="text-nordic-muted hover:text-mosque transition-colors" href="#">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
            </div>
        </div>
      </footer>
    </>
  );
}
