'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  ShoppingBag, Phone, Eye, Printer,
  Search, Package, Truck, 
  Clock, X, AlertTriangle, MessageCircle, FileText, CheckCircle2, XCircle,
  ChevronDown, Calendar, Filter
} from 'lucide-react'
import { toast } from 'sonner'
import ShipmentModal from '@/app/components/shipmentModel'

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
  }).format(date)
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // FILTERS
  const [activeFilter, setActiveFilter] = useState('all') 
  const [dateFilter, setDateFilter] = useState('all_time')

  // MODALS
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [shippingOrder, setShippingOrder] = useState<any>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('realtime-orders').on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders()
    ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeFilter, dateFilter])

  async function fetchOrders() {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, shops!inner(active_payment_method, name, plan_type, is_shiprocket_enabled)')
      .order('created_at', { ascending: false })
    
    if (activeFilter !== 'all') {
      if(activeFilter === 'shipped') query = query.eq('delivery_status', 'shipped')
      else if (activeFilter === 'needs_approval') query = query.eq('payment_status', 'needs_approval')
      else query = query.eq('delivery_status', activeFilter)
    }

    const now = new Date()
    const startOfToday = new Date(now.setHours(0,0,0,0)).toISOString()
    
    if (dateFilter === 'today') query = query.gte('created_at', startOfToday)
    else if (dateFilter === 'yesterday') {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      const startOfYesterday = new Date(yesterday.setHours(0,0,0,0)).toISOString()
      query = query.gte('created_at', startOfYesterday).lt('created_at', startOfToday)
    }
    else if (dateFilter === 'last_7') {
      const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
      query = query.gte('created_at', sevenDaysAgo)
    }

    const { data, error } = await query
    if (!error) setOrders(data || [])
    setLoading(false)
  }

  const handleResendMsg = async (id: number) => {
      toast.loading("Resending WhatsApp...")
      try {
          const res = await fetch('/api/order/resend', {
              method: 'POST', 
              body: JSON.stringify({ orderId: id })
          })
          if(res.ok) toast.success("Message Sent Successfully!")
          else toast.error("Failed to send.")
      } catch(e) {
          toast.error("Network Error")
      }
  }

  const handlePaymentVerification = async (id: number, decision: 'APPROVE' | 'REJECT') => {
    const newStatus = decision === 'APPROVE' ? 'paid' : 'failed'
    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: newStatus } : o))
    toast.info("Processing...")

    try {
      const res = await fetch('/api/order/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, decision })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error("API Error")

      if (data.messageStatus === 'failed') {
          toast.warning("Order Saved, BUT WhatsApp Failed! Please try 'Resend' button.")
      } else {
          toast.success("Verified & Notified Customer!")
      }
      fetchOrders()
    } catch (e) {
      toast.error("Critical Sync Error")
      fetchOrders()
    }
  }

  const filteredOrders = orders.filter(o => 
    o.item_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_phone?.includes(search)
  )

  const RenderVerification = ({ order }: { order: any }) => (
    <div className="w-full">
      {order.payment_status === 'needs_approval' && (
        <div className="space-y-3 animate-in slide-in-from-left-2 w-full">
          <div className="flex items-center gap-2 text-[var(--text-amber)] font-bold text-[10px] bg-[var(--fill-amber)] px-3 py-1.5 rounded-lg border border-[var(--border-amber)] w-fit uppercase tracking-widest">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" /> Action Required
          </div>
          <div className="bg-[var(--bg-soft)] border border-[var(--border-muted)] rounded-xl p-2.5">
            {order.screenshot_id ? (
              <button onClick={() => setPreviewImage(order.screenshot_id)} className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--brand-blue)] hover:underline py-1">
                <Eye size={14}/> View Screenshot
              </button>
            ) : order.transaction_id ? (
              <div className="text-[10px] p-1">
                <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider block mb-1">UTR / Ref:</span>
                <p className="font-mono font-bold text-[var(--text-primary)] select-all bg-[var(--bg-page)] p-1.5 rounded border border-[var(--border-subtle)]">{order.transaction_id}</p>
              </div>
            ) : (
              <span className="text-[10px] text-red-400 italic block text-center py-1">No proof attached</span>
            )}
          </div>
          <div className="flex gap-2 w-full">
            <button onClick={() => handlePaymentVerification(order.id, 'APPROVE')} className="flex-1 bg-[#10b981] text-white h-[38px] rounded-xl text-[10px] font-black uppercase hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-1">
              <CheckCircle2 size={14}/> Accept
            </button>
            <button onClick={() => handlePaymentVerification(order.id, 'REJECT')} className="flex-1 bg-white border-2 border-[#ef4444] text-[#ef4444] h-[38px] rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all flex items-center justify-center gap-1">
              <XCircle size={14}/> Reject
            </button>
          </div>
        </div>
      )}

      {(order.payment_status === 'awaiting_screenshot' || order.payment_status === 'awaiting_proof' || !order.payment_status) && order.payment_method !== 'COD' && (
        <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1.5 bg-[var(--bg-soft)] px-3 py-2 rounded-lg w-fit border border-[var(--border-muted)]">
          <Clock size={12} className="animate-pulse" /> {order.payment_method === 'ONLINE' ? 'Awaiting Gateway...' : 'Awaiting User...'}
        </span>
      )}

      {(order.payment_status === 'paid' || order.status === 'PAID') && (
        <div className="space-y-2">
          <span className="bg-[var(--fill-green)] text-[var(--text-green)] border border-[var(--border-green)] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
            ✅ Verified Paid
          </span>
          
          {order.notification_status === 'failed' && (
            <div className="bg-red-50 border border-red-200 p-2 rounded-lg animate-pulse w-fit">
              <p className="text-[10px] font-bold text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Receipt Failed</p>
            </div>
          )}
          
          <button onClick={() => handleResendMsg(order.id)} className={`text-[10px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors w-fit ${order.notification_status === 'failed' ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-[var(--fill-blue)] text-[var(--brand-blue)] border-[var(--border-blue)] hover:bg-[var(--fill-blue-1)]'}`}>
            <MessageCircle size={12} /> {order.notification_status === 'failed' ? 'Retry Sending' : 'Resend Receipt'}
          </button>
        </div>
      )}

      {order.payment_status === 'failed' && (
        <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit flex items-center gap-1">
          ❌ Failed
        </span>
      )}
    </div>
  )

  const RenderFulfillment = ({ order }: { order: any }) => (
    <div className="w-full flex flex-col md:items-end gap-2">
      {order.delivery_status === 'processing' && (order.payment_status === 'paid' || order.status === 'PAID' || order.payment_method === 'COD') ? (
        <button onClick={() => setShippingOrder(order)} className="w-full md:w-auto bg-[var(--text-primary)] text-[var(--bg-page)] h-[40px] px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2">
          <Package size={14} /> Ship Now
        </button>
      ) : (
        <>
          <span className={`w-full md:w-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border ${order.delivery_status === 'delivered' ? 'bg-[var(--fill-green)] text-[var(--text-green)] border-[var(--border-green)]' : 'bg-[var(--fill-blue)] text-[var(--brand-blue)] border-[var(--border-blue)]'}`}>
            <Truck size={14} /> {order.delivery_status}
          </span>
          
          {order.shipping_label_url && (
            <div className="flex flex-col md:items-end gap-2 w-full mt-1">
              <button onClick={() => window.open(order.shipping_label_url, '_blank')} className="w-full md:w-auto bg-[var(--bg-card)] border-2 border-[var(--border-card)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-[var(--bg-soft)] transition-colors flex items-center justify-center gap-2">
                <Printer size={14} /> Print Label
              </button>
              
              <div className="w-full md:w-auto flex items-center justify-center gap-1.5 bg-[var(--bg-soft)] border border-[var(--border-muted)] px-3 py-2 rounded-xl">
                <FileText size={12} className="text-[var(--text-muted)]" />
                <a href="https://app.shiprocket.in/manifests" target="_blank" className="text-[10px] font-black uppercase text-[var(--text-secondary)] hover:text-[var(--brand-blue)] transition-colors underline decoration-dotted">
                  Manifest Portal
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <main className="copit-wrapper bg-[var(--bg-page)] min-h-screen pb-24 font-['DM_Sans']">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-[var(--bg-card)] border border-[var(--border-card)] p-5 md:p-8 rounded-[var(--r-2xl)] shadow-[var(--card-shadow)]">
          
          <div className="space-y-1.5 shrink-0">
            <h1 className="text-2xl md:text-3xl font-display font-black flex items-center gap-2 tracking-tight text-[var(--text-primary)]">
              <ShoppingBag className="text-[var(--brand-blue)]" size={28} /> Fulfillment Center
            </h1>
            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--green-dot)] animate-pulse" />
              Managing {orders.length} orders
            </p>
          </div>
          
          {/* THE FIX: Vertical Stack - Search Always on Top */}
          <div className="flex flex-col gap-3 w-full xl:w-auto min-w-0">
            
            {/* Search - Now spanning the full width of the filter block */}
            <div className="relative w-full xl:w-[500px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search phone or item..." className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-soft)] text-[var(--text-primary)] text-sm font-medium outline-none focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent placeholder:text-[var(--text-muted)] transition-all shadow-sm" />
            </div>

            {/* 📱 MOBILE VIEW: 2-Column Grid for Dropdowns (Sleek & Space-saving) */}
            <div className="grid grid-cols-2 gap-3 w-full lg:hidden">
              <div className="relative w-full">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={14} />
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none w-full bg-[var(--bg-soft)] border border-[var(--border-card)] text-[var(--text-primary)] text-[11px] font-bold uppercase tracking-wider py-3.5 pl-9 pr-10 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--brand-blue)] transition-all"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last_7">Last 7 Days</option>
                  <option value="all_time">All Time</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>

              <div className="relative w-full">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={14} />
                <select 
                  value={activeFilter} 
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="appearance-none w-full bg-[var(--bg-soft)] border border-[var(--border-card)] text-[var(--text-primary)] text-[11px] font-bold uppercase tracking-wider py-3.5 pl-9 pr-10 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--brand-blue)] transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="needs_approval">Needs Approval</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>

            {/* 💻 DESKTOP VIEW: Pills that automatically wrap to new lines, eliminating scrolling */}
            <div className="hidden lg:flex flex-wrap gap-3 w-full">
              {/* Date Filters Desktop */}
              <div className="flex flex-wrap bg-[var(--bg-soft)] border border-[var(--border-card)] p-1 rounded-2xl gap-1">
                {['today', 'yesterday', 'last_7', 'all_time'].map((d) => (
                  <button key={d} onClick={() => setDateFilter(d)} className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${dateFilter === d ? 'bg-[var(--bg-card)] text-[var(--brand-blue)] shadow-sm border border-[var(--border-card)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'}`}>
                    {d.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Status Filters Desktop */}
              <div className="flex flex-wrap bg-[var(--bg-soft)] border border-[var(--border-card)] p-1 rounded-2xl gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'needs_approval', label: 'Needs Approval' },
                  { id: 'processing', label: 'Processing' },
                  { id: 'shipped', label: 'Shipped' }
                ].map((f) => (
                  <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all uppercase tracking-wider ${activeFilter === f.id ? 'bg-[var(--text-primary)] text-[var(--bg-page)] shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredOrders.length === 0 && !loading && (
           <div className="py-32 flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[var(--r-2xl)]">
              <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-full flex items-center justify-center mb-4">
                <Package size={32} className="text-[var(--text-secondary)]" />
              </div>
              <p className="font-display font-bold text-xl text-[var(--text-primary)]">No orders found</p>
              <p className="text-sm mt-1 text-[var(--text-muted)]">Try adjusting your filters or search term.</p>
           </div>
        )}

        {/* --- MOBILE VIEW (CARDS) --- */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[var(--r-2xl)] p-5 shadow-sm space-y-5 transition-all ${order.payment_status === 'needs_approval' ? 'ring-2 ring-[var(--border-amber)] ring-offset-2 ring-offset-[var(--bg-page)]' : ''}`}>
              
              <div className="flex justify-between items-start border-b border-[var(--border-muted)] pb-4">
                <div className="space-y-1">
                  <span className="text-sm font-black text-[var(--text-primary)] block">{formatDate(order.created_at).split(',')[0]}</span>
                  <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1.5"><Clock size={12} /> {formatDate(order.created_at).split(',')[1]}</span>
                  { (new Date().getTime() - new Date(order.created_at).getTime()) < 3600000 && <span className="inline-block mt-2 bg-[var(--fill-blue-1)] text-[var(--brand-blue)] text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest">New Order</span> }
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-[var(--text-primary)] text-xl bg-[var(--bg-soft)] px-3 py-1.5 rounded-xl border border-[var(--border-card)]">₹{order.total_amount}</span>
                  {order.payment_method === 'COD' && <div className="mt-2 text-[10px] font-black tracking-widest text-[#f59e0b] uppercase">COD Order</div>}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-[var(--text-primary)] text-sm leading-snug">{order.item_name}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--fill-blue)] text-[var(--brand-blue)] p-2 rounded-lg border border-[var(--border-blue)]"><Phone size={14}/></span> 
                  <span className="text-sm font-black tracking-wider text-[var(--text-secondary)]">{order.customer_phone}</span>
                </div>
                <div className="bg-[var(--bg-soft)] p-3.5 rounded-xl border border-[var(--border-muted)]">
                   <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed whitespace-pre-wrap">
                     {order.delivery_address}
                   </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-muted)] space-y-4">
                <RenderVerification order={order} />
                <RenderFulfillment order={order} />
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW (TABLE) --- */}
        <div className="hidden md:block bg-[var(--bg-card)] rounded-[var(--r-2xl)] border border-[var(--border-card)] shadow-[var(--card-shadow)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-soft)] border-b border-[var(--border-card)] text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                <tr>
                  <th className="px-6 py-5 w-[160px]">Date & Time</th>
                  <th className="px-6 py-5">Order Details</th>
                  <th className="px-6 py-5 w-[140px]">Amount</th>
                  <th className="px-6 py-5 w-[240px]">Verification</th>
                  <th className="px-6 py-5 w-[220px] text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-card)]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`group transition-colors ${order.payment_status === 'needs_approval' ? 'bg-[var(--fill-amber)]/30 hover:bg-[var(--fill-amber)]/50' : 'hover:bg-[var(--bg-soft)]'}`}>
                    
                    <td className="px-6 py-6 align-top">
                      <div className="flex flex-col gap-1.5">
                         <span className="text-sm font-black text-[var(--text-primary)]">{formatDate(order.created_at).split(',')[0]}</span>
                         <span className="text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1.5"><Clock size={12} /> {formatDate(order.created_at).split(',')[1]}</span>
                         { (new Date().getTime() - new Date(order.created_at).getTime()) < 3600000 && <span className="mt-2 bg-[var(--fill-blue-1)] text-[var(--brand-blue)] text-[9px] px-2 py-1 rounded-md w-fit font-black uppercase tracking-widest">New</span> }
                      </div>
                    </td>

                    <td className="px-6 py-6 align-top">
                      <div className="space-y-3 max-w-[320px]">
                        <p className="font-bold text-[var(--text-primary)] text-sm leading-snug">{order.item_name}</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-[var(--fill-blue)] text-[var(--brand-blue)] p-1.5 rounded-lg"><Phone size={12}/></span> 
                          <span className="text-[13px] font-black tracking-wider text-[var(--text-secondary)]">{order.customer_phone}</span>
                        </div>
                        <div className="bg-[var(--bg-page)] p-3 rounded-xl border border-[var(--border-muted)]">
                           <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed whitespace-pre-wrap">
                             {order.delivery_address}
                           </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 align-top">
                        <span className="font-display font-black text-[var(--text-primary)] text-base bg-[var(--bg-soft)] px-3 py-1.5 rounded-xl border border-[var(--border-card)]">₹{order.total_amount}</span>
                        {order.payment_method === 'COD' && <div className="mt-2 text-[10px] font-black tracking-widest text-[#f59e0b] uppercase">COD Order</div>}
                    </td>
                    
                    <td className="px-6 py-6 align-top">
                       <RenderVerification order={order} />
                    </td>

                    <td className="px-6 py-6 align-top">
                       <RenderFulfillment order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- IMAGE MODAL --- */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setPreviewImage(null)} 
        >
          <div className="bg-[#1A1D24] rounded-[2rem] p-2 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 border border-white/10 cursor-default" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute top-6 right-6 z-50 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-all backdrop-blur-xl">
              <X size={20} />
            </button>
            <div className="aspect-[3/5] w-full bg-black rounded-[1.5rem] overflow-hidden flex items-center justify-center relative">
               <img src={`/api/media/${previewImage}`} alt="Payment Proof" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* --- SHIPMENT MODAL --- */}
      {shippingOrder && (
        <ShipmentModal 
          order={shippingOrder} 
          onClose={() => setShippingOrder(null)} 
          onSuccess={() => { fetchOrders(); toast.success("Shipped successfully!"); }} 
        />
      )}

    </main>
  )
}