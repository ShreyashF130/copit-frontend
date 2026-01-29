'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  TrendingUp, ShoppingBag, Users, Power, BarChart3, 
  Smartphone, ExternalLink, Loader2, ArrowUpRight 
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts' 

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  
  const supabase = createClient()
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    initDashboard()
  }, [])

  async function initDashboard() {
    try {
      // 1. Get User & Shop ID first
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: shopData } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
      if (!shopData) return
      setShop(shopData)

      // 2. Fetch Analytics from PYTHON BACKEND
      const res = await fetch(`${apiUrl}/api/analytics/${shopData.id}`)
      const data = await res.json()
      
      if (data.status === 'success') {
        setAnalytics(data)
      } else {
        toast.error("Failed to load analytics data")
      }
    } catch (e) {
      console.error(e)
      toast.error("Connection Error")
    } finally {
      setLoading(false)
    }
  }

  const toggleShopStatus = async () => {
    if (!shop) return
    const newStatus = !shop.is_paused
    
    // Optimistic UI Update
    setShop({ ...shop, is_paused: newStatus })
    
    const { error } = await supabase.from('shops').update({ is_paused: newStatus }).eq('id', shop.id)
    if (error) {
      toast.error("Failed to update status")
      setShop({ ...shop, is_paused: !newStatus }) // Revert
    } else {
      toast.success(newStatus ? "Shop Paused 🔴" : "Shop Live 🟢")
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  )

  // Use data from API or fallback to zeros
  const stats = analytics?.stats || { total_revenue: 0, total_orders: 0, pending_orders: 0 }
  const graphData = analytics?.graph || []
  const topItems = analytics?.top_items || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">CopIt Dashboard</h1>
          <p className="text-muted-foreground font-bold text-sm">Real-time Command Center</p>
        </div>

        <button 
          onClick={toggleShopStatus}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black transition-all shadow-lg active:scale-95 border ${
            shop?.is_paused 
            ? 'bg-destructive/10 border-destructive/20 text-destructive' 
            : 'bg-[var(--success)]/10 border-[var(--success)]/20 text-[var(--success)]'
          }`}
        >
          <Power size={20} />
          {shop?.is_paused ? "STORE PAUSED" : "STORE ACTIVE"}
        </button>
      </div>

      {/* --- KEY METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* REVENUE - Always Dark for Contrast */}
        <div className="bg-slate-900 dark:bg-black text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group border border-slate-800">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <TrendingUp size={20} /> <span className="text-xs font-black uppercase tracking-widest">Revenue</span>
            </div>
            <h2 className="text-4xl font-black">₹{stats.total_revenue.toLocaleString()}</h2>
            <div className="mt-4 inline-flex items-center gap-1 bg-[var(--success)]/20 text-[var(--success)] px-3 py-1 rounded-full text-[10px] font-bold">
              <ArrowUpRight size={12} /> Live Updates
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
        </div>

        {/* ORDERS */}
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders} 
          icon={<ShoppingBag />} 
          subtext={`${stats.pending_orders} Pending Action`}
        />
        
        {/* TOP PRODUCT */}
        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 ">
            <span className="text-muted-foreground text-xs font-black uppercase tracking-widest">Best Seller</span>
            <div className="p-3 bg-[var(--warning)]/10 text-[var(--warning)] rounded-2xl">
              <Users size={20} />
            </div>
          </div>
          {topItems[0] ? (
            <div>
              <div className="text-xl font-black text-foreground line-clamp-1">{topItems[0].item_name}</div>
              <div className="text-sm font-bold text-muted-foreground mt-1">{topItems[0].qty_sold} units sold</div>
            </div>
          ) : (
            <div className="text-muted-foreground font-bold">No sales yet</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- REVENUE GRAPH --- */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-8 shadow-sm h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg text-foreground flex items-center gap-2">
              <BarChart3 className="text-primary" /> Performance
            </h3>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Last 7 Days</span>
          </div>
         <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--muted-foreground)'}} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)'}}
                itemStyle={{color: 'var(--primary)', fontWeight: 900}}
              />
              <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* --- QUICK ACTIONS & HEALTH --- */}
        <div className="space-y-6">
          
          {/* BOT STATUS CARD - Gradient remains to standout */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <Smartphone className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform rotate-12" />
            <h4 className="font-black text-xl mb-2">Bot Health: 98%</h4>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed font-medium">
              Your automated assistant is currently handling customer queries.
            </p>
            <a 
              href={`https://wa.me/${shop?.phone_number}`} 
              target="_blank"
              className="bg-white/90 text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-white transition-colors"
            >
              Test Bot <ExternalLink size={14} />
            </a>
          </div>

          {/* TOP PRODUCTS LIST */}
          <div className="bg-card border border-border rounded-[2.5rem] p-6">
            <h4 className="font-black text-foreground mb-4 text-sm uppercase tracking-widest">Top Movers</h4>
            <div className="space-y-4">
              {topItems.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between pb-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondbg text-muted-foreground flex items-center justify-center text-[10px] font-black">{i+1}</span>
                    <span className="text-sm font-bold text-foreground/80">{item.item_name}</span>
                  </div>
                  <span className="text-xs font-black text-primary">{item.qty_sold} sold</span>
                </div>
              ))}
              {topItems.length === 0 && <div className="text-xs text-muted-foreground">No data available</div>}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

function StatCard({ title, value, icon, subtext }: any) {
  return (
    <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground text-xs font-black uppercase tracking-widest">{title}</span>
        <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black text-foreground mb-2">{value}</div>
      <div className="text-xs font-bold text-muted-foreground">
        {subtext}
      </div>
    </div>
  )
}
