import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RoleSelect from './RoleSelect'
import Image from 'next/image'

export default async function AdminUsersPage() {
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

  const { data: users, error } = await supabase.rpc('get_all_users_admin')

  if (error) {
    return <div className="p-8 text-red-500 bg-red-50 rounded-xl my-4 mx-8">Error loading users: {error.message}</div>
  }

  return (
    <div className="bg-background-light text-nordic font-display min-h-[calc(100vh-200px)] flex flex-col antialiased w-full">
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic">User Directory</h1>
            <p className="text-nordic/60 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">search</span>
              </div>
              <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm" placeholder="Search by name, email..." type="text"/>
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap">
                <span className="material-icons text-lg mr-2">add</span>
                Add User
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-primary border-b-2 border-primary">All Users</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Agents</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Brokers</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Admins</button>
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-6 lg:px-8 w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role &amp; Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {users?.map((u: any) => {
          let badgeClass = "bg-gray-100 text-gray-600  ";
          if (u.role === 'admin') badgeClass = "bg-nordic text-white";
          else if (u.role === 'agent') badgeClass = "bg-primary/10 text-primary";

          return (
            <div key={u.id} className="user-card group relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:bg-[#D9ECC8] flex flex-col md:grid md:grid-cols-12 gap-4 items-center z-10">
              <div className="col-span-12 md:col-span-4 flex items-center w-full">
                <div className="relative flex-shrink-0 mt-1">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-nordic/10 flex items-center justify-center">
                    {u.avatar_url ? (
                       <Image src={u.avatar_url} alt={u.email} width={48} height={48} className="object-cover h-full w-full" />
                    ) : (
                       <span className="material-icons text-nordic/40">person</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div className="ml-4 overflow-hidden">
                  <div className="text-sm font-bold text-nordic truncate">{u.full_name || u.email.split('@')[0]}</div>
                  <div className="text-xs text-nordic/60 truncate">{u.email}</div>
                  <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50 rounded text-nordic/50 group-hover:bg-white/50 transition-colors">ID: #{u.id.substring(0, 8)}</div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${badgeClass}`}>
                    {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'User'}
                </span>
                <div className="flex items-center text-xs text-nordic/60">
                  <span className="material-icons text-[14px] mr-1 text-primary">check_circle</span>
                  Active
                </div>
              </div>

              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-nordic/40">Joined</div>
                  <div className="text-sm font-semibold text-nordic">{new Date(u.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-nordic/40">Last Login</div>
                  <div className="text-sm font-semibold text-nordic">-</div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-2 w-full flex justify-end z-20">
                <div className="bg-white rounded-lg p-1">
                  <RoleSelect userId={u.id} currentRole={u.role || 'user'} />
                </div>
              </div>
            </div>
          )
        })}

        {(users?.length === 0) && (
          <div className="px-6 py-10 text-center text-gray-500">
             No users found.
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-nordic/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-nordic/60">
                 Showing <span className="font-medium text-nordic">1</span> to <span className="font-medium text-nordic">{users?.length || 0}</span> of <span className="font-medium text-nordic">{users?.length || 0}</span> users
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-none -space-x-px">
                <a className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors" href="#">
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </a>
                <a aria-current="page" className="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm" href="#">
                  1
                </a>
                <a className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors" href="#">
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
