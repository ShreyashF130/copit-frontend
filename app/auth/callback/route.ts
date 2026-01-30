import { NextResponse } from 'next/server'
// The client you created from the server-side library
import { createServerClientInstance } from '@/app/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerClientInstance()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If error, return to login with error message
  return NextResponse.redirect(`${origin}/login?error=Could not login with provider`)
}