'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setRole(newRole)
    setIsUpdating(true)
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      
    setIsUpdating(false)
    if (error) {
      alert('Failed to update role: ' + error.message)
      setRole(currentRole) // Revert on error
    }
  }

  return (
    <select 
      value={role} 
      onChange={handleRoleChange}
      disabled={isUpdating}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border border-nordic-dark/20 bg-white ${isUpdating ? 'opacity-50' : 'hover:border-nordic-dark/40'} focus:outline-none focus:ring-2 focus:ring-mosque/20 transition-all cursor-pointer`}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )
}
