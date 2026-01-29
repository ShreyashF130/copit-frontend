'use client'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const handleSignOut = async () => {
    setLoading(true)
    try {
      // 1. Call the API to destroy the session cookie
      const response = await fetch(`/api/auth/signout`, { method: 'POST' })
      
      if (response.ok) {
        toast.success("Signed out successfully")
        
        // 2. RUTHLESS REFRESH: Force the browser to go to Home ('/')
        // This clears the Next.js client cache so the Navbar updates instantly.
        window.location.href = '/' 
      }
    } catch (error) {
      toast.error("Sign out failed")
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 "
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <LogOut size={18} />}
      <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  )
}