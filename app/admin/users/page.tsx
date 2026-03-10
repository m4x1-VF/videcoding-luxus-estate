import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import RoleSelect from './RoleSelect'

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-nordic-dark">Manage Users</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-nordic-dark/10">
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Email</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Joined At</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark">Role</th>
              <th className="py-3 px-4 text-sm font-semibold text-nordic-dark text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u: any) => (
              <tr key={u.id} className="border-b border-nordic-dark/10 hover:bg-black/[0.02]">
                <td className="py-3 px-4 text-sm font-medium text-nordic-dark">{u.email}</td>
                <td className="py-3 px-4 text-sm text-nordic-dark/70">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <RoleSelect userId={u.id} currentRole={u.role || 'user'} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-nordic-dark/60 hover:text-red-500 transition-colors p-1" title="Delete">
                    <span className="material-icons text-lg">delete_outline</span>
                  </button>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-nordic-dark/50">
                  No users found or you don't have permission to view them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
