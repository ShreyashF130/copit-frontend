import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 🧱 1. THE HARD BYPASS: Instantly pass public routes without checking Supabase
  const path = request.nextUrl.pathname
  if (path.startsWith('/shop') || path.startsWith('/api') || path.startsWith('/_next')) {
    return NextResponse.next()
  }

  // 2. Create the response object
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 3. SAFETY CHECK: Do not run if keys are missing
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("❌ Supabase Keys missing in Middleware. Skipping auth check.")
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 4. REFRESH SESSION
  const { data: { user } } = await supabase.auth.getUser()

  // 5. PROTECTED ROUTES
  if (!user && path.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Keep the matcher as a backup, but the hard bypass above guarantees it works
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}