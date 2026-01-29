'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  Star, MessageSquare, ShieldCheck, ShieldAlert, 
  Loader2, TrendingUp, Users, Eye, EyeOff, 
  Search, ArrowUpDown, MessageCircle, Sparkles 
} from 'lucide-react'
import { toast } from 'sonner'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // --- ADVANCED FILTERS ---
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single()
      if (!shop) return

      const res = await fetch(`${apiUrl}/api/reviews/${shop.id}`)
      if (!res.ok) throw new Error("API Error")
      
      const data = await res.json()
      setReviews(data.reviews || [])
      setStats(data.stats)
    } catch (e) { 
      toast.error("Failed to load data") 
    } finally {
      setLoading(false)
    }
  }

  async function togglePublic(id: number, currentStatus: boolean) {
    // Optimistic Update
    const originalReviews = [...reviews]
    setReviews(reviews.map(r => r.id === id ? { ...r, is_public: !currentStatus } : r))

    try {
      const res = await fetch(`${apiUrl}/api/reviews/toggle-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: id, is_public: !currentStatus })
      })
      if (!res.ok) throw new Error()
      toast.success(currentStatus ? "Hidden from store" : "Published to store!")
    } catch (e) { 
      setReviews(originalReviews) // Revert on failure
      toast.error("Update failed") 
    }
  }

  const handleReply = (phone: string | undefined) => {
    if (!phone) return toast.error("Phone number not available")
    window.open(`https://wa.me/${phone}?text=Hi! Thanks for your review...`, '_blank')
  }

  // --- PROCESSING LOGIC ---
  const processedReviews = reviews
    .filter(r => {
      const matchesSearch = r.comment?.toLowerCase().includes(search.toLowerCase()) || 
                            r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                            String(r.order_id).includes(search)
      const matchesFilter = filter === 'all' ? true : (filter === 'public' ? r.is_public : !r.is_public)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      return 0
    })

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary" size={40}/></div>

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 min-h-screen">
      
      {/* --- TITLE SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
             <MessageSquare className="text-primary" fill="currentColor" /> 
             REVIEW COMMAND CENTER
           </h1>
           <p className="text-muted-foreground font-medium mt-1">Manage your reputation and showcase social proof.</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-full border border-border text-xs font-black text-muted-foreground flex items-center gap-2 shadow-sm">
           <Sparkles size={14} className="text-[var(--warning)]" /> AI Insights: Analysis Active
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Card */}
        <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border relative overflow-hidden group">
            <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2"><TrendingUp size={16}/> Avg. Rating</div>
            <div className="text-6xl font-black text-foreground flex items-baseline gap-2 tracking-tighter">
                {stats?.avg_rating || '0.0'} <span className="text-2xl text-[var(--warning)]">★</span>
            </div>
            {/* Simple Bar Chart Visualization */}
            <div className="w-full h-2 bg-muted rounded-full mt-6 overflow-hidden flex">
                
                <div className="h-full bg-[var(--success)]" style={{ width: `${(stats?.positive_count / stats?.total_count || 0) * 100}%` }} />
                <div className="h-full bg-destructive" style={{ width: `${100 - ((stats?.positive_count / stats?.total_count || 0) * 100)}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase">
                <span>Positive</span>
                <span>Critical</span>
            </div>
        </div>

        {/* Volume Card */}
        <div className="bg-card p-8 rounded-[2.5rem] shadow-sm border border-border flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2"><Users size={16}/> Total Feedback</div>
                <div className="text-6xl font-black text-foreground tracking-tighter">{stats?.total_count || 0}</div>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--success)] bg-[var(--success)]/10 px-3 py-1 rounded-lg w-fit">
                <TrendingUp size={14} /> +{reviews.filter(r => new Date(r.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length} this week
            </div>
        </div>

        {/* Sentiment Card - Gradient Preserved for Pop */}
        <div className="bg-gradient-to-br from-primary to-purple-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden border border-primary/20">
             <div className="relative z-10">
                <div className="flex items-center gap-2 opacity-80 font-bold text-xs uppercase tracking-widest mb-4"><ShieldCheck size={16}/> Reputation Health</div>
                <div className="text-5xl font-black mb-2">
                    {stats?.total_count > 0 ? Math.round((stats.positive_count / stats.total_count) * 100) : 0}%
                </div>
                <p className="text-white/80 text-sm font-medium">Customers rated their experience as positive.</p>
             </div>
             <div className="absolute -right-10 -bottom-10 opacity-20"><ShieldCheck size={150} /></div>
        </div>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="bg-card/90 p-4 rounded-[2rem] border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-10 backdrop-blur-md transition-colors">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews, order #, or name..." 
                className="w-full pl-12 pr-4 py-3 bg-secondbg rounded-xl font-bold text-sm text-foreground outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
            />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
             {/* Filter Tabs */}
             <div className="flex bg-secondbg p-1 rounded-xl shrink-0">
                {(['all', 'public', 'private'] as const).map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
                <select 
                    value={sortBy} 
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="appearance-none bg-secondbg text-foreground font-bold text-xs px-4 py-3 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-transparent"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
                <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
        </div>
      </div>

      {/* --- REVIEWS LIST --- */}
      <div className="grid grid-cols-1 gap-4">
        {processedReviews.map((r) => (
          <div key={r.id} className={`group bg-card p-6 md:p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${r.rating <= 2 ? 'border-destructive/20 bg-destructive/5' : 'border-border'}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Visual Sentiment Badge */}
                <div className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner ${r.rating >= 4 ? 'bg-[var(--success)]/10 text-[var(--success)]' : r.rating <= 2 ? 'bg-destructive/10 text-destructive' : 'bg-[var(--warning)]/10 text-[var(--warning)]'}`}>
                        <div className="text-2xl font-black leading-none">{r.rating}</div>
                        <Star size={14} fill="currentColor" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${r.rating >= 5 ? 'bg-[var(--success)]/10 text-[var(--success)]' : r.rating <= 2 ? 'bg-destructive/10 text-destructive' : 'bg-secondbg text-muted-foreground'}`}>
                        {r.rating === 5 ? 'Fan' : r.rating <= 2 ? 'Risk' : 'Neutral'}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-black text-lg text-foreground">{r.customer_name || 'Anonymous'}</span>
                        <span className="text-[10px] font-bold text-muted-foreground bg-secondbg px-2 py-1 rounded-lg uppercase tracking-widest">
                            Order #{r.order_id}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    
                    <p className="text-foreground/80 font-medium leading-relaxed text-base">
                        "{r.comment}"
                    </p>
                    
                    {/* Action Bar */}
                    <div className="flex gap-2 pt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleReply(r.customer_phone)} 
                            className="flex items-center gap-1 text-[11px] font-bold uppercase text-[var(--success)] hover:bg-[var(--success)]/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <MessageCircle size={14} /> Reply on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Right Side Toggles */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pl-0 md:pl-6 border-l border-border">
                    <button 
                        onClick={() => togglePublic(r.id, r.is_public)}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${r.is_public ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90' : 'bg-secondbg text-muted-foreground hover:bg-muted/20'}`}
                    >
                        {r.is_public ? <><Eye size={16} /> Public</> : <><EyeOff size={16} /> Private</>}
                    </button>
                    
                    {r.rating <= 3 && (
                        <div className="flex items-center gap-1 text-destructive font-black text-[10px] uppercase bg-destructive/10 px-3 py-2 rounded-lg w-full justify-center">
                            <ShieldAlert size={12} /> Needs Attention
                        </div>
                    )}
                </div>
            </div>
          </div>
        ))}

        {processedReviews.length === 0 && (
            <div className="py-24 text-center bg-card rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-secondbg rounded-full flex items-center justify-center text-muted">
                    <Search size={40} />
                </div>
                <div>
                    <h3 className="text-foreground font-black text-lg">No reviews found</h3>
                    <p className="text-muted-foreground font-bold text-sm">Try adjusting your filters or search terms.</p>
                </div>
                <button onClick={() => {setSearch(''); setFilter('all')}} className="text-primary font-bold text-sm hover:underline">Clear all filters</button>
            </div>
        )}
      </div>
    </div>
  )
}