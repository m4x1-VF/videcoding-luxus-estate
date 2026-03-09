import Navbar from "./components/Navbar";
import FeaturedPropertyCard from "./components/FeaturedPropertyCard";
import PropertyCard from "./components/PropertyCard";
import Pagination from "./components/Pagination";
import SearchSection from "./components/SearchSection";
import StatusTabs from "./components/StatusTabs";
import { getFeaturedProperties, getPaginatedProperties } from "./lib/supabase";

// Always fetch fresh data so slugs are reflected immediately
export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const filters = {
    query: params.query,
    type: params.type,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    beds: params.beds ? parseInt(params.beds) : undefined,
    baths: params.baths ? parseInt(params.baths) : undefined,
    status: params.status,
  };

  const isFiltering = !!(filters.query || filters.type || filters.minPrice || filters.maxPrice || filters.beds || filters.baths || filters.status);

  const [featured, paginated] = await Promise.all([
    isFiltering ? Promise.resolve([]) : getFeaturedProperties(),
    getPaginatedProperties(currentPage, filters),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <SearchSection />
        </section>

        {!isFiltering && (
          <section className="mb-16">
              <div className="flex items-end justify-between mb-8">
                  <div>
                      <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
                      <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
                  </div>
                  <a className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity" href="#">
                      View all <span className="material-icons text-sm">arrow_forward</span>
                  </a>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featured.map(property => (
                      <FeaturedPropertyCard key={property.id} property={property} />
                  ))}
              </div>
          </section>
        )}

        <section>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
                    <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
                </div>
                <StatusTabs />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
            <Pagination
              currentPage={paginated.currentPage}
              totalPages={paginated.totalPages}
              totalCount={paginated.totalCount}
            />
        </section>
      </main>
    </>
  );
}
