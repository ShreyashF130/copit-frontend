import { createClient } from '@/app/lib/supabase/server'
import ItemsManager from '@/app/components/itemmanager'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  // 1. Check User
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // 2. Check Shop
  const { data: shop, error: shopError } = user ? await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .single() : { data: null, error: null }

  // --- DEBUG VIEW (If this shows up, we know the problem) ---
  if (!user || !shop) {
    return (
      <div className="p-10 space-y-4 bg-card dark:bg-slate-900 rounded-3xl border-2 border-rose-500">
        <h1 className="text-2xl font-bold text-rose-600 uppercase">🚨 Debug Mode</h1>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-xs">
          <p>User Found: {user ? '✅ YES' : '❌ NO'}</p>
          <p>User Email: {user?.email || 'N/A'}</p>
          <p>Shop Found: {shop ? '✅ YES' : '❌ NO'}</p>
          <p>Shop Error: {shopError?.message || 'None'}</p>
        </div>
        {!user && <p className="text-sm">Server can't see your login. Check your middleware.</p>}
        {user && !shop && <p className="text-sm">Logged in as {user.email}, but no shop exists for this ID in the "shops" table.</p>}
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <ItemsManager shopId={shop.id} />
    </div>
  )
}