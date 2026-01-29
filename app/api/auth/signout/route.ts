import { createServerClientInstance as createClient } from '@/app/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 })
}