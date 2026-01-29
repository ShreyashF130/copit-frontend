import { NextResponse } from 'next/server'
import { createServerClientInstance as createClient} from '@/app/lib/supabase-server' // Ensure this creates a SERVER client (cookies)

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  

  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }


  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}