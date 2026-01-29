'use client'

import { useState, useEffect, Suspense } from 'react' // <--- Suspense imported
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Logo from '../components/logo'
import { login, signup } from './actions'
import { createClient } from '@/app/lib/supabase-browser' 

// ----------------------------------------------------------------------
// 1. THE LOGIC COMPONENT (Renamed from AuthPage to AuthForm)
//    This holds all your state, hooks, and form logic.
// ----------------------------------------------------------------------
function AuthForm() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [isSignUp, setIsSignUp] = useState<boolean>(
    searchParams.get('view') === 'signup'
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)

  // Handle Server Errors
  useEffect(() => {
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    if (error) toast.error(error)
    if (message) toast.success(message)
  }, [searchParams])

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      if (isSignUp) {
        const result = await signup(formData)
        if (result?.error) toast.error(result.error)
        else toast.success("Check your email to verify account!")
      } else {
        const result = await login(formData)
        if (result?.error) toast.error(result.error)
      }
    } catch (e) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    // Safer way to get value than getElementsByName
    const form = (e.target as Element).closest('form')
    const emailInput = form?.querySelector('input[name="email"]') as HTMLInputElement
    const email = emailInput?.value

    if (!email) return toast.error("Please enter your email address first.")
    
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/update-password`,
    })
    if (error) toast.error(error.message)
    else toast.success("Password reset link sent to your email!")
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/10 border border-white/20 dark:border-border/50 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative group cursor-default">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative transition-transform hover:scale-105 duration-300">
              <Logo />
            </div>
          </div>
          
          <div className="mt-6 space-y-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {isSignUp ? 'Join the Revolution' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium flex items-center justify-center gap-1.5">
              Manage your WhatsApp business <Sparkles size={12} className="text-[var(--warning)]" />
            </p>
          </div>
        </div>

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogle}
          type="button" // Always add type="button" to non-submit buttons
          disabled={isGoogleLoading || loading}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm hover:shadow-md"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <>
              {/* Using a simple text fallback if image fails, or ensure you have the image accessible */}
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-card px-2 text-muted-foreground">Or with email</span></div>
        </div>

        {/* FORM */}
        <form action={handleSubmit} className="space-y-5">
          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail size={20} />
            </div>
            <input 
              name="email"
              type="email" 
              placeholder="Email address" 
              required
              disabled={loading}
              className="w-full pl-12 pr-5 py-4 bg-secondbg/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="group relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              required
              disabled={loading}
              className="w-full pl-12 pr-5 py-4 bg-secondbg/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          {/* Forgot Password */}
          {!isSignUp && (
            <div className="flex justify-end">
              <button onClick={handleReset} type="button" className="text-xs font-bold text-primary hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'} 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {isSignUp ? "Already have an account?" : "New to CopIt?"}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)} 
              className='text-primary hover:text-primary/80 font-bold transition-colors ml-1.5 hover:underline decoration-2 underline-offset-2'
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
  )
}

// ----------------------------------------------------------------------
// 2. THE PAGE COMPONENT (Export Default)
//    This wraps the logic in Suspense.
// ----------------------------------------------------------------------
export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40 pointer-events-none animate-pulse duration-[5000ms]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--brand-accent)]/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* SUSPENSE BOUNDARY IS HERE 👇 */}
      <Suspense fallback={<div className="text-primary animate-pulse font-bold">Loading...</div>}>
        <AuthForm />
      </Suspense>

    </div>
  )
}