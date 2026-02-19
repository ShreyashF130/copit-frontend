'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  ShoppingBag, Phone, Eye, Printer,
  Search, Package, Truck, ExternalLink,
  Clock, Copy, X, AlertTriangle, CheckCircle2, Ban,MessageCircle
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
    
    // 1. Status Filter (Enhanced)
    if (activeFilter !== 'all') {
      if(activeFilter === 'shipped') query = query.eq('delivery_status', 'shipped')
      else if (activeFilter === 'needs_approval') query = query.eq('payment_status', 'needs_approval')
      else query = query.eq('delivery_status', activeFilter)
    }

    // 2. Date Filter
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
    // Optimistic Update
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

      // ⚠️ CHECK MESSAGE STATUS
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

  // --- FILTER & EXPORT ---
  const filteredOrders = orders.filter(o => 
    o.item_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_phone?.includes(search)
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text); toast.success("Copied!")
  }

  return (
    <div className="p-4 md:p-8 min-h-screen relative animate-in fade-in duration-500 pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-card border border-border p-6 rounded-[2rem] shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter text-foreground">
              <ShoppingBag className="text-primary" /> Fulfillment Center
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
               Managing {orders.length} orders • {dateFilter.replace('_', ' ')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            {/* Date Filters */}
            <div className="flex bg-secondbg border border-border p-1 rounded-xl overflow-x-auto no-scrollbar">
              {['today', 'yesterday', 'last_7', 'all_time'].map((d) => (
                <button key={d} onClick={() => setDateFilter(d)} className={`whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${dateFilter === d ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}>
                  {d.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search phone or item..." className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-border bg-background text-foreground text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all" />
            </div>

            {/* Status Filters */}
            <div className="flex bg-secondbg border border-border p-1 rounded-xl overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'needs_approval', label: 'Needs Approval' },
                { id: 'processing', label: 'Processing' },
                { id: 'shipped', label: 'Shipped' }
              ].map((f) => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`whitespace-nowrap px-4 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider ${activeFilter === f.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-background/50'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-secondbg/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 w-[140px]">Date</th>
                  <th className="px-6 py-4">Order Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`group transition-colors ${order.payment_status === 'needs_approval' ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'hover:bg-secondbg/30'}`}>
                    
                    {/* 1. Date */}
                    <td className="px-6 py-6 align-top">
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-foreground">{formatDate(order.created_at).split(',')[0]}</span>
                         <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1"><Clock size={10} /> {formatDate(order.created_at).split(',')[1]}</span>
                         { (new Date().getTime() - new Date(order.created_at).getTime()) < 3600000 && <span className="mt-1 bg-blue-500/10 text-blue-500 text-[9px] px-1.5 py-0.5 rounded w-fit font-black">NEW</span> }
                      </div>
                    </td>

                    {/* 2. Order Details */}
                    <td className="px-6 py-6 align-top">
                      <div className="space-y-1.5">
                        <p className="font-bold text-foreground text-xs line-clamp-2 w-[200px]">{order.item_name}</p>
                        <p className="text-[11px] text-muted-foreground font-bold flex items-center gap-1.5 pt-1">
                          <span className="bg-secondbg p-1 rounded-md"><Phone size={10}/></span> {order.customer_phone}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 w-[200px]" title={order.delivery_address}>{order.delivery_address}</p>
                      </div>
                    </td>
                    
                    {/* 3. Amount */}
                    <td className="px-6 py-6 align-top">
                        <span className="font-black text-foreground text-sm bg-secondbg px-2 py-1 rounded-lg">₹{order.total_amount}</span>
                        {order.payment_method === 'COD' && <div className="mt-1 text-[9px] font-bold text-orange-500">COD ORDER</div>}
                    </td>
                    
                    {/* 4. VERIFICATION COLUMN (The Core Logic) */}
                    <td className="px-6 py-6 align-top min-w-[200px]">
                      
                      {/* STATUS: NEEDS APPROVAL */}
                      {order.payment_status === 'needs_approval' && (
                        <div className="space-y-3 animate-in slide-in-from-left-2">
                           
                           <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm w-fit">
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                              Action Required
                           </div>

                           {/* PROOF VIEWER (Image or Text) */}
                           <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                              {order.screenshot_id ? (
                                 <button onClick={() => setPreviewImage(order.screenshot_id)} className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-600 hover:underline">
                                    <Eye size={12}/> View Screenshot
                                 </button>
                              ) : order.transaction_id ? (
                                 <div className="text-[10px]">
                                    <span className="text-muted-foreground font-semibold">UTR / Ref:</span>
                                    <p className="font-mono font-bold text-slate-800 select-all">{order.transaction_id}</p>
                                 </div>
                              ) : (
                                 <span className="text-[9px] text-red-400 italic">No proof attached</span>
                              )}
                           </div>

                           <div className="flex gap-2">
                             <button onClick={() => handlePaymentVerification(order.id, 'APPROVE')} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-1">
                                Accept
                             </button>
                             <button onClick={() => handlePaymentVerification(order.id, 'REJECT')} className="flex-1 bg-white border border-red-200 text-red-500 px-3 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-red-50 transition-all flex items-center justify-center gap-1">
                                Reject
                             </button>
                           </div>
                        </div>
                      )}

                      {/* STATUS: AWAITING SCREENSHOT */}
                      {(order.payment_status === 'awaiting_screenshot' || !order.payment_status) && order.payment_method !== 'COD' && (
                         <div className="opacity-60">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2 mb-2">
                               <Clock size={12} /> Waiting for user...
                            </span>
                            {/* DEBUG: Force verify for testing */}
                            <button onClick={() => handlePaymentVerification(order.id, 'APPROVE')} className="text-[9px] text-blue-500 underline decoration-dotted">
                               [Test] Force Approve
                            </button>
                         </div>
                      )}

                      {/* STATUS: PAID */}
                     {/* CASE C: Verified / Paid */}
  {(order.payment_status === 'paid' || order.status === 'PAID') && (
     <div className="space-y-2">
        <span className="bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
          ✅ Verified Paid
        </span>
        
        {/* RESEND BUTTON: The Safety Net */}
        <button 
            onClick={() => handleResendMsg(order.id)}
            className="text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100"
        >
            <MessageCircle size={10} /> Resend Receipt
        </button>
     </div>
  )}

                      {/* STATUS: FAILED */}
                      {order.payment_status === 'failed' && (
                         <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit">
                           ❌ Payment Failed
                         </span>
                      )}
                    </td>

                    {/* 5. FULFILLMENT (Ship Button) */}
                    <td className="px-6 py-6 align-top text-right">
                      {order.delivery_status === 'processing' && (order.payment_status === 'paid' || order.status === 'PAID') ? (
                        <button onClick={() => setShippingOrder(order)} className="bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md flex items-center gap-2 ml-auto">
                          <Package size={14} /> Ship Now
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                              order.delivery_status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                            }`}>
                              <Truck size={12} /> {order.delivery_status}
                            </span>
                            
                            {order.shipping_label_url && (
                               <button onClick={() => window.open(order.shipping_label_url, '_blank')} className="w-full bg-white border border-border text-foreground px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-secondbg transition-colors flex items-center justify-center gap-2 shadow-sm">
                                 <Printer size={12} /> Label
                               </button>
                            )}
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && !loading && (
               <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-60 gap-4">
                  <Package size={48} strokeWidth={1} />
                  <p className="font-bold text-sm">No orders found.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* --- IMAGE MODAL --- */}
{/* --- IMAGE MODAL --- */}
    {/* --- IMAGE MODAL (Fixed) --- */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setPreviewImage(null)} // 1. CLOSE ON BACKDROP CLICK
        >
          {/* Stop click propagation so clicking the image doesn't close it */}
          <div 
            className="bg-card rounded-[1.5rem] p-2 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 border border-white/10 cursor-default"
            onClick={(e) => e.stopPropagation()} 
          >
            
            {/* 2. VISIBLE CLOSE BUTTON (Inside the card for safety) */}
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="aspect-[3/5] w-full bg-black rounded-[1rem] overflow-hidden flex items-center justify-center relative">
               <img 
                 src={`/api/media/${previewImage}`} 
                 alt="Payment Proof" 
                 className="w-full h-full object-contain" 
               />
            </div>

            <div className="p-3 text-center bg-white dark:bg-slate-900 rounded-b-[1rem]">
                <p className="text-[10px] font-mono text-muted-foreground">ID: {previewImage}</p>
            </div>
          </div>
        </div>
      )}

      {shippingOrder && (
        <ShipmentModal 
          order={shippingOrder} 
          onClose={() => setShippingOrder(null)} 
          onSuccess={() => { fetchOrders(); toast.success("Shipped successfully!"); }} 
        />
      )}

    </div>
  )
}