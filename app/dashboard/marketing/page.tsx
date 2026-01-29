'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { Megaphone, Send, Wallet, Loader2, Calculator, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function MarketingPage() {
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('https://placehold.co/600x400/png')
  const [loading, setLoading] = useState(false)
  
  // Wallet & Stats State
  const [walletBalance, setWalletBalance] = useState(0)
  const [totalCustomers, setTotalCustomers] = useState(0)
  
  // Budgeting State
  const [recipientCount, setRecipientCount] = useState(0)
  
  const COST_PER_MSG = 1.20 
  const supabase = createClient()

  useEffect(() => {
    fetchShopData()
  }, [])

  async function fetchShopData() {
    const { data: { user },error } = await supabase.auth.getUser()
    if (error || !user) {
        console.error("User not logged in")
        return 
    }

    // 1. Get Wallet Balance
    const { data: shop } = await supabase.from('shops').select('id, wallet_balance').eq('owner_id', user.id).single()
    
    // 2. Get Real Customer Count (Mocked)
    const mockTotalCustomers = 1250 
    const currentBalance = shop?.wallet_balance || 0

    setWalletBalance(currentBalance)
    setTotalCustomers(mockTotalCustomers)

    // Smart Default
    const maxAffordable = Math.floor(currentBalance / COST_PER_MSG)
    const initialSelect = Math.min(mockTotalCustomers, maxAffordable)
    setRecipientCount(initialSelect)
  }
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const currentCost = recipientCount * COST_PER_MSG
  const maxAffordableUsers = Math.floor(walletBalance / COST_PER_MSG)
  const isAffordable = currentCost <= walletBalance

  async function handleBroadcast() {
    if (recipientCount <= 0) {
        toast.error("Select at least 1 customer.")
        return
    }
    if (!isAffordable) {
        toast.error(`Insufficient Funds! You need ₹${currentCost.toFixed(2)}`)
        return
    }

    if (!confirm(`📢 Send to ${recipientCount} people? Cost: ₹${currentCost.toFixed(2)}`)) return;
    
    setLoading(true)
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast.error("Please log in again.")
            setLoading(false)
            return
        }
        const { data: shop,error:shopError } = await supabase.from('shops').select('id').eq('owner_id', user.id).single()
        if (shopError || !shop) {
            console.error("Shop Error:", shopError)
            toast.error("Shop not found. Please contact support.")
            setLoading(false)
            return // <--- STOP HERE
        }
        
        const res = await fetch(`${apiUrl}/api/marketing/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                shop_id: shop.id, 
                message: message,
                image_url: imageUrl,
                limit: recipientCount 
            })
        })
        const data = await res.json()
        
        if(data.status === 'success') {
            toast.success(`🚀 Sent to ${data.count} users! Cost: ₹${data.cost_deducted}`)
            setMessage('')
            fetchShopData() 
        } else {
            toast.error(data.message || "Broadcast failed.")
        }
    } catch(e) { 
        toast.error("Connection Error") 
    }
    setLoading(false)
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 min-h-screen font-sans animate-in fade-in duration-500">
        
        {/* HEADER & WALLET */}
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gradient-to-r from-primary to-purple-600 p-8 rounded-[2.5rem] text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
                        <Megaphone className="animate-bounce" /> CAMPAIGN BLAST
                    </h1>
                    <p className="opacity-90 mt-2 font-medium">Re-engage customers with one click.</p>
                </div>
            </div>

            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm min-w-[300px] flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mb-1">
                    <Wallet size={16} /> Marketing Wallet
                </div>
                <div className="text-4xl font-black text-foreground">₹{walletBalance.toFixed(2)}</div>
                <Link href='/dashboard/billing' className="text-primary font-bold text-sm mt-2 hover:underline text-left">
                    + Add Credits
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: COMPOSER */}
            <div className="lg:col-span-2 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
                
                {/* BUDGET SLIDER */}
                <div className="bg-secondbg p-6 rounded-3xl border border-border space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2"><Calculator size={16}/> Audience Budget</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isAffordable ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                            {isAffordable ? 'Within Budget' : 'Insufficient Funds'}
                        </span>
                    </div>

                    <div className="relative pt-6 pb-2">
                         <input 
                            type="range" 
                            min="0" 
                            max={totalCustomers} 
                            value={recipientCount}
                            onChange={(e) => setRecipientCount(Number(e.target.value))}
                            className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        {/* Max Affordable Marker */}
                        <div 
                            className="absolute top-0 w-1 h-3 bg-destructive rounded-full" 
                            style={{ left: `${(Math.min(maxAffordableUsers, totalCustomers) / totalCustomers) * 100}%` }}
                            title="Max Affordable"
                        />
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                             <p className="text-3xl font-black text-foreground">{recipientCount} <span className="text-lg text-muted-foreground">/ {totalCustomers}</span></p>
                             <p className="text-xs font-bold text-muted-foreground">Recipients Selected</p>
                        </div>
                        <div className="text-right">
                             <p className="text-3xl font-black text-primary">₹{currentCost.toFixed(2)}</p>
                             <p className="text-xs font-bold text-muted-foreground">Total Cost (@ ₹1.20)</p>
                        </div>
                    </div>

                    {recipientCount > maxAffordableUsers && (
                         <div className="flex items-center gap-2 text-destructive text-xs font-bold bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                            <AlertTriangle size={14} />
                            <span>You can only afford {maxAffordableUsers} users. Slide left!</span>
                            <button onClick={() => setRecipientCount(maxAffordableUsers)} className="ml-auto underline hover:text-red-600">Auto-Fix</button>
                         </div>
                    )}
                </div>

                <hr className="border-border" />

                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Header Image</label>
                    <div className="flex items-center gap-2 bg-secondbg p-3 rounded-2xl border border-border focus-within:ring-2 ring-primary transition-all mt-1">
                        <ImageIcon size={20} className="text-muted-foreground" />
                        <input 
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-transparent font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
                            placeholder="https://your-image-url.com/sale.png"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Offer Message</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-40 p-5 mt-1 bg-secondbg rounded-2xl border border-border font-bold text-foreground focus:ring-2 ring-primary outline-none resize-none placeholder:text-muted-foreground/50"
                        placeholder="e.g. ☀️ Summer Sale! Get 50% OFF on all items."
                    />
                </div>

                <div className="pt-4 flex items-center justify-end">
                    <button 
                        onClick={handleBroadcast}
                        disabled={loading || !message || !isAffordable || recipientCount === 0}
                        className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Fire Blast ({recipientCount})</>}
                    </button>
                </div>
            </div>

            {/* RIGHT: PREVIEW (Dark Mode Style Preserved for 'Phone' Look) */}
            <div className="bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center justify-center gap-1">
                    <div className="w-16 h-4 bg-black rounded-full" />
                </div>
                
                <h3 className="text-center font-black text-slate-500 uppercase tracking-widest mt-6 mb-4 text-xs">Customer View</h3>
                
                <div className="bg-card text-foreground rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-2 max-w-[90%] mx-auto shadow-lg">
                    <div className="aspect-video bg-secondbg rounded-xl overflow-hidden mb-2 relative">
                         <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image'} />
                    </div>
                    <p className="text-sm font-medium leading-relaxed px-1">
                        {message || <span className="text-muted-foreground italic">Your message will appear here...</span>}
                    </p>
                    <div className="text-[10px] text-muted-foreground text-right mt-1 font-bold">10:45 AM</div>
                </div>
            </div>
        </div>
    </div>
  )
}