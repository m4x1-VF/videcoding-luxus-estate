import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image'

export default async function AdminPropertiesPage() {
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
  const active = properties?.filter(p => !p.status?.toLowerCase().includes('sold'))?.length || 0;
  const pending = properties?.filter(p => p.status?.toLowerCase().includes('pending') || p.status?.toLowerCase().includes('reserved'))?.length || 0;

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
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Listings</p>
            <p className="text-2xl font-bold text-nordic mt-1">{total}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons">apartment</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Properties</p>
            <p className="text-2xl font-bold text-nordic mt-1">{active}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Sale</p>
            <p className="text-2xl font-bold text-nordic mt-1">{pending}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <span className="material-icons">pending</span>
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

        {properties?.map((prop) => {
          const isSold = prop.status?.toLowerCase().includes('sold');
          const isPending = prop.status?.toLowerCase().includes('reserved') || prop.status?.toLowerCase().includes('pending');
          const badgeClass = isSold 
            ? "bg-gray-100  text-gray-600  border border-gray-200 "
            : isPending 
            ? "bg-orange-100  text-orange-700  border border-orange-200 "
            : "bg-[#D9ECC8] text-primary border border-primary/10";
          const dotClass = isSold ? "bg-gray-500" : isPending ? "bg-orange-500" : "bg-primary";

          return (
            <div key={prop.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-background-light transition-colors items-center">
              {/* Property Details */}
              <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {(prop.images && prop.images.length > 0) ? (
                    <Image src={prop.images[0]} alt={prop.title || 'Property'} fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="material-icons text-gray-400">home</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-nordic group-hover:text-primary transition-colors cursor-pointer">{prop.title}</h3>
                  <p className="text-sm text-gray-500">{prop.location}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {prop.bedrooms || 0} Beds</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {prop.bathrooms || 0} Baths</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{prop.area || 0} sqft</span>
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
                  {prop.status}
                </span>
              </div>
              
              {/* Actions */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-[#D9ECC8]/30 transition-all tooltip-trigger" title="Edit Property">
                  <span className="material-icons text-xl">edit</span>
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all tooltip-trigger" title="Delete Property">
                  <span className="material-icons text-xl">delete_outline</span>
                </button>
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
        {properties && properties.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-nordic">1</span> to <span className="font-medium text-nordic">{properties.length}</span> of <span className="font-medium text-nordic">{properties.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
