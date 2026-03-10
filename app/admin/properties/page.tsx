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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-nordic-dark">Manage Properties</h1>
        <button className="px-4 py-2 bg-nordic-dark text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          + Add Property
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-nordic-dark/10">
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Property</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Location</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Price</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties?.map((prop) => (
              <tr key={prop.id} className="border-b border-nordic-dark/10 hover:bg-black/[0.02]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {prop.images?.[0] ? (
                        <Image src={prop.images[0]} alt={prop.title} fill sizes="48px" className="object-cover" />
                      ) : (
                        <span className="material-icons text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-nordic-dark line-clamp-2">{prop.title}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-nordic-dark/70">{prop.location}</td>
                <td className="py-3 px-4 text-sm font-medium text-nordic-dark">{prop.price}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-mosque/10 text-mosque">
                    {prop.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-nordic-dark/60 hover:text-nordic-dark transition-colors p-1" title="Edit">
                    <span className="material-icons text-lg">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
