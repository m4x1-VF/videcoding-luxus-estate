import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import AdminPropertyActions from '@/app/components/AdminPropertyActions';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() }
      }
    }
  )

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error loading properties</div>
  }

  const total = properties?.length || 0;
  const inactiveCount = properties?.filter(p => p.is_active === false)?.length || 0;
  const active = properties?.filter(p => p.is_active !== false && !p.status?.toLowerCase().includes('sold'))?.length || 0;
  const pending = properties?.filter(p => p.is_active !== false && (p.status?.toLowerCase().includes('pending') || p.status?.toLowerCase().includes('reserved')))?.length || 0;

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 10;
  const paginatedProperties = properties?.slice((currentPage - 1) * limit, currentPage * limit) || [];
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-grow w-full py-10 px-4 sm:px-6 lg:px-8 bg-background-light font-display min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic tracking-tight">My Properties</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-nordic hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> Filter
          </button>
          <Link href="/admin/properties/new" className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-mosque/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Listings</p>
            <p className="text-2xl font-bold text-nordic mt-1">{total}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Properties</p>
            <p className="text-2xl font-bold text-nordic mt-1">{active}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Sale</p>
            <p className="text-2xl font-bold text-nordic mt-1">{pending}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Inactive Properties</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{inactiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <span className="material-icons">visibility_off</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {paginatedProperties?.map((prop) => {
          const isSold = prop.status?.toLowerCase().includes('sold');
          const isPending = prop.status?.toLowerCase().includes('reserved') || prop.status?.toLowerCase().includes('pending');
          const isInactive = prop.is_active === false;
          
          let badgeClass = "bg-mosque/10 text-mosque border border-mosque/10";
          let dotClass = "bg-mosque";
          let displayStatus = prop.status;

          if (isInactive) {
            badgeClass = "bg-red-100 text-red-700 border border-red-200";
            dotClass = "bg-red-500";
            displayStatus = "Inactive";
          } else if (isSold) {
             badgeClass = "bg-gray-100 text-gray-600 border border-gray-200";
             dotClass = "bg-gray-500";
          } else if (isPending) {
             badgeClass = "bg-orange-100 text-orange-700 border border-orange-200";
             dotClass = "bg-orange-500";
          }

          return (
            <div key={prop.id} className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-background-light transition-colors items-center ${isInactive ? 'opacity-70' : ''}`}>
              {/* Property Details */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {(prop.images && prop.images.length > 0) ? (
                    <Image src={prop.images[0]} alt={prop.title || 'Property'} fill sizes="112px" className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isInactive ? 'grayscale' : ''}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="material-icons text-gray-400">home</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-nordic group-hover:text-mosque transition-colors cursor-pointer">
                    {prop.title} {isInactive && <span className="text-xs text-red-500 ml-2 font-normal">(Inactive)</span>}
                  </h3>
                  <p className="text-sm text-gray-500">{prop.location}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {prop.beds || 0} Beds</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {prop.baths || 0} Baths</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{prop.area || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Price */}
              <div className="col-span-6 md:col-span-2">
                <div className="text-base font-semibold text-nordic">{prop.price}</div>
                <div className="text-xs text-gray-400">Type: {prop.type || 'N/A'}</div>
              </div>
              
              {/* Status */}
              <div className="col-span-6 md:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mr-1.5`}></span>
                  {displayStatus}
                </span>
              </div>
              
              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                <Link href={`/admin/properties/${prop.id}/edit`} className="p-2 rounded-lg text-gray-400 hover:text-mosque hover:bg-mosque/20 transition-all tooltip-trigger" title="Edit Property">
                  <span className="material-icons text-xl">edit</span>
                </Link>
                <AdminPropertyActions propertyId={prop.id} isActive={prop.is_active !== false} />
              </div>
            </div>
          )
        })}

        {(properties?.length === 0) && (
           <div className="px-6 py-10 text-center text-gray-500">
             No properties found. Add a new one to get started!
           </div>
        )}

        {/* Pagination placeholder as per design */}
        {total > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-nordic">{Math.min((currentPage - 1) * limit + 1, total)}</span> to <span className="font-medium text-nordic">{Math.min(currentPage * limit, total)}</span> of <span className="font-medium text-nordic">{total}</span> results
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/properties?page=${currentPage - 1}`} className={`px-4 py-1.5 text-sm border font-medium border-mosque text-mosque hover:bg-mosque hover:text-white transition-colors rounded-md ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}>Previous</Link>
              <Link href={`/admin/properties?page=${currentPage + 1}`} className={`px-4 py-1.5 text-sm border font-medium border-mosque text-mosque hover:bg-mosque hover:text-white transition-colors rounded-md ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}>Next</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
