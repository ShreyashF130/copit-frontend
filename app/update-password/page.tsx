'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
//import { createBrowserClientInstance } from '@/app/lib/supabase-browser' // Use your browser client
import { createClient as createBrowserClientInstance } from '../lib/supabase-browser'
export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createBrowserClientInstance()
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (formData: FormData) => {
    setLoading(true)
    const password = formData.get('password') as string
    
    // 1. Update the user's password
    const { error } = await supabase.auth.updateUser({ 
      password: password 
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success("Password updated successfully!")
      // 2. Redirect to dashboard
      router.replace('/dashboard') 
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
      
      {/* --- AMBIENT BACKGROUND (Matching your login page) --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>

      {/* --- CARD --- */}
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-border/50 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground text-sm font-medium mt-2">
            Enter your new password below.
          </p>
        </div>

        <form action={handleUpdate} className="space-y-5">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              name="password"
              type="password" 
              placeholder="New Password" 
              required
              minLength={6}
              disabled={loading}
              className="w-full pl-12 pr-5 py-4 bg-secondbg/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Update Password <ArrowRight size={18} /></>}
          </button>
        </form>

      </div>
    </div>
  )
}