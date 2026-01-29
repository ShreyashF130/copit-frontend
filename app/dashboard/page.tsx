import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardOverview from '../components/dashboardoverview'

export default async function DashboardGatekeeper() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/dashboard/setup')

  // RUTHLESS FIX: Ensure the ID is a primitive number before passing to Client Components
  const confirmedShopId = Number(shop.id)

  return <DashboardOverview shopId={confirmedShopId} />
}