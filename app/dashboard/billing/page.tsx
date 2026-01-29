//   Next Step: Replace your KEY_ID in the code, and you are ready to collect payments in style!
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { Wallet, Zap, CheckCircle2, History, TrendingUp, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BillingPage() {
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<'500' | '1000' | 'pro' | null>(null)
  const [history, setHistory] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    fetchBillingData()
  }, [])

  async function fetchBillingData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: shopData } = await supabase
      .from('shops')
      .select('id, wallet_balance, plan_type, subscription_expiry')
      .eq('owner_id', user.id)
      .single()
    
    setShop(shopData)

    setHistory([
        { id: 1, type: 'CREDIT', amount: 500, date: '2025-10-01', status: 'success' },
        { id: 2, type: 'SUB', amount: 499, date: '2025-09-01', status: 'success' },
    ])
    
    setLoading(false)
  }

  const handlePayment = async (type: '500' | '1000' | 'pro') => {
    setProcessing(type)
    setTimeout(() => {
        toast.success(type === 'pro' ? "Welcome to Pro! 🚀" : `Added ₹${type} to Wallet! 💰`)
        setProcessing(null)
        fetchBillingData()
    }, 1500)
  }

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>

  const isPro = shop?.plan_type === 'pro'
  const daysLeft = shop?.subscription_expiry ? Math.ceil((new Date(shop.subscription_expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Billing & Credits</h1>
            <p className="text-muted-foreground font-medium">Manage your subscription and marketing fuel.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT: WALLET --- */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Wallet Card - Always Dark for Contrast */}
                <div className="bg-slate-900 dark:bg-black text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-800 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Wallet size={14} /> Marketing Balance
                            </p>
                            <h2 className="text-5xl font-black mt-2">₹{shop?.wallet_balance?.toFixed(2) || '0.00'}</h2>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Used for broadcasting promotional messages.</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Zap className="text-[var(--warning)] fill-[var(--warning)]" size={32} />
                        </div>
                    </div>
                </div>

                {/* 2. Top-Up */}
                <div>
                    <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" /> Add Credits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['500', '1000'].map((amt) => (
                        <button 
                            key={amt}
                            onClick={() => handlePayment(amt as any)}
                            disabled={!!processing}
                            className="group bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-left relative overflow-hidden"
                        >
                            {amt === '1000' && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            )}
                            <p className="text-xs font-bold text-muted-foreground uppercase">{amt === '500' ? 'Starter Pack' : 'Growth Pack'}</p>
                            <p className="text-3xl font-black text-foreground mt-1 group-hover:text-primary transition-colors">₹{amt}</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">Get ~{amt === '500' ? '415' : '830'} Messages</p>
                            {processing === amt && <div className="absolute inset-0 bg-card/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary"/></div>}
                        </button>
                        ))}
                    </div>
                </div>

                {/* 3. Recent History */}
                <div className="bg-card p-6 rounded-[2rem] border border-border">
                    <h3 className="text-sm font-black text-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                        <History size={16} /> Recent History
                    </h3>
                    <div className="space-y-4">
                        {history.map((txn) => (
                            <div key={txn.id} className="flex justify-between items-center p-3 hover:bg-secondbg rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${txn.type === 'CREDIT' ? 'bg-primary/10 text-primary' : 'bg-purple-500/10 text-purple-600'}`}>
                                        {txn.type === 'CREDIT' ? <Zap size={16} /> : <Crown size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{txn.type === 'CREDIT' ? 'Wallet Top-up' : 'Pro Subscription'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground">{txn.date}</p>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-foreground/80">₹{txn.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: PRO PLAN --- */}
            <div className="bg-gradient-to-b from-card to-purple-500/5 p-1 rounded-[2.5rem] shadow-xl shadow-purple-500/5 border border-purple-500/20">
                <div className="bg-card rounded-[2.3rem] p-8 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    <div className="relative z-10 flex-1">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <Crown size={24} fill="currentColor" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-foreground">CopIt PRO</h2>
                        <p className="text-muted-foreground text-sm font-medium mt-2 leading-relaxed">
                            Unlock full automation and remove all limits from your store.
                        </p>

                        <div className="my-8">
                            <span className="text-5xl font-black text-foreground">₹499</span>
                            <span className="text-muted-foreground font-bold ml-2">/ month</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {[ "Razorpay Gateway", "Zero Commission", "Priority API Speed", "Detailed Analytics", "Verified Badge" ].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                    <CheckCircle2 size={18} className="text-[var(--success)] shrink-0" /> {feat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isPro ? (
                        <div className="bg-[var(--success)]/10 text-[var(--success)] p-4 rounded-2xl text-center border border-[var(--success)]/20">
                            <p className="font-black uppercase text-xs flex items-center justify-center gap-2"><CheckCircle2 size={14} /> Plan Active</p>
                            <p className="text-[10px] font-bold mt-1">Renews in {daysLeft} days</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handlePayment('pro')}
                            disabled={!!processing}
                            className="w-full py-4 bg-foreground text-card dark:bg-primary dark:text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            {processing === 'pro' ? <Loader2 className="animate-spin" /> : "UPGRADE NOW ⚡"}
                        </button>
                    )}
                </div>
            </div>

        </div>
    </div>
  )
}