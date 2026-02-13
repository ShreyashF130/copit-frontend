'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  ShoppingBag, Phone, MapPin, Eye, Printer,
  Search, Download, Package, Truck, ExternalLink,
  Calendar, Clock, Copy, X
} from 'lucide-react'
import { toast } from 'sonner'
import ShipmentModal from '@/app/components/shipmentModel'

// 🛠️ Helper to format dates cleanly
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
  
  // 🚀 NEW: Date Filter State
  const [activeFilter, setActiveFilter] = useState('all') // Status Filter
  const [dateFilter, setDateFilter] = useState('all_time') // Date Filter

  // --- STATE FOR MODALS ---
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [shippingOrder, setShippingOrder] = useState<any>(null)
  
  const supabase = createClient()

  // Refetch when filters change
  useEffect(() => {
    fetchOrders()
    const channel = supabase.channel('realtime-orders').on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders()
    ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeFilter, dateFilter]) // 👈 Added dateFilter dependency

  async function fetchOrders() {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, shops!inner(active_payment_method, name, plan_type, is_shiprocket_enabled)')
      .order('created_at', { ascending: false })
    
    // 1️⃣ Apply Status Filter
    if (activeFilter !== 'all') {
      if(activeFilter === 'shipped') {
         query = query.in('delivery_status', ['shipped', 'SHIPPED'])
      } else {
         query = query.eq('delivery_status', activeFilter)
      }
    }

    // 2️⃣ 🚀 Apply Ruthless Date Filter (Server-Side)
    const now = new Date()
    const startOfToday = new Date(now.setHours(0,0,0,0)).toISOString()
    
    if (dateFilter === 'today') {
      query = query.gte('created_at', startOfToday)
    } 
    else if (dateFilter === 'yesterday') {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      const startOfYesterday = new Date(yesterday.setHours(0,0,0,0)).toISOString()
      query = query.gte('created_at', startOfYesterday).lt('created_at', startOfToday)
    }
    else if (dateFilter === 'last_7') {
      const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
      query = query.gte('created_at', sevenDaysAgo)
    }
    else if (dateFilter === 'last_30') {
      const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
      query = query.gte('created_at', thirtyDaysAgo)
    }

    const { data, error } = await query
    if (error) {
      console.error("Fetch Error:", error)
      toast.error("Could not load orders.")
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  // --- CSV EXPORT ---
  const filteredOrders = orders.filter(o => 
    o.item_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_phone?.includes(search)
  )

  const downloadCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export.");
      return;
    }
    // Added "Date" to CSV headers
    const headers = ["Order ID", "Date", "Product", "Amount", "Customer Phone", "Address", "Status"];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.created_at).toLocaleDateString(), // CSV Date Format
      o.item_name,
      o.total_amount,
      o.customer_phone,
      `"${o.delivery_address?.replace(/"/g, '""') || ''}"`,
      o.delivery_status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `CopIt_Orders_${activeFilter}_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredOrders.length} orders`);
  }

  const handleAction = async (id: number, field: string, value: string) => {
    const { error } = await supabase.from('orders').update({ [field]: value }).eq('id', id)
    if (!error) {
      toast.success(`Order updated`)
      fetchOrders()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!")
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
            
            {/* 🚀 NEW: DATE FILTER PRESETS */}
            <div className="flex bg-secondbg border border-border p-1 rounded-xl shadow-inner overflow-x-auto">
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'last_7', label: '7 Days' },
                { id: 'all_time', label: 'All Time' }
              ].map((d) => (
                <button 
                  key={d.id} 
                  onClick={() => setDateFilter(d.id)}
                  className={`whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    dateFilter === d.id 
                    ? 'bg-background text-foreground shadow-sm border border-border/50' 
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input 
                type="text" placeholder="Search phone or item..." 
                className="pl-9 pr-4 py-2.5 w-full rounded-xl border border-border bg-background text-foreground text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* STATUS FILTER */}
            <div className="flex bg-secondbg border border-border p-1 rounded-xl">
              {['all', 'processing', 'shipped'].map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all capitalize ${
                    activeFilter === f ? 'bg-primary text-white shadow-md transform scale-105' : 'text-muted-foreground hover:bg-background/50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {activeFilter === 'processing' && (
              <button onClick={downloadCSV} className="hidden md:flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-lg">
                <Download size={14} /> CSV
              </button>
            )}
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-secondbg/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 w-[140px]"><span className="flex items-center gap-1"><Calendar size={12}/> Date</span></th>
                  <th className="px-6 py-4">Product & Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-secondbg/30 transition-colors">
                    
                    {/* 🚀 NEW: DATE COLUMN */}
                    <td className="px-6 py-6 align-top">
                      <div className="flex flex-col gap-1">
                         <span className="text-xs font-bold text-foreground">
                            {formatDate(order.created_at).split(',')[0]}
                         </span>
                         <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                            <Clock size={10} /> {formatDate(order.created_at).split(',')[1]}
                         </span>
                         {/* Tag for "New" orders (less than 1 hour old) */}
                         { (new Date().getTime() - new Date(order.created_at).getTime()) < 3600000 && 
                           <span className="mt-1 bg-blue-500/10 text-blue-500 text-[9px] px-1.5 py-0.5 rounded w-fit font-black">JUST NOW</span>
                         }
                      </div>
                    </td>

                    <td className="px-6 py-6 align-top">
                      <div className="space-y-1.5">
                        {typeof order.items === 'string' && order.items.startsWith('[') 
                          ? JSON.parse(order.items).map((i:any, idx:number) => (
                              <p key={idx} className="font-bold text-foreground text-xs">{i.qty}x {i.name}</p>
                            ))
                          : <p className="font-bold text-foreground text-xs">{order.item_name}</p>
                        }
                        <p className="text-[11px] text-muted-foreground font-bold flex items-center gap-1.5 pt-1">
                          <span className="bg-secondbg p-1 rounded-md"><Phone size={10}/></span> {order.customer_phone}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 align-top">
                        <span className="font-black text-foreground text-sm bg-secondbg px-2 py-1 rounded-lg">
                           ₹{order.total_amount}
                        </span>
                    </td>
                    
                    <td className="px-6 py-6 align-top">
                      <div className="group/addr relative max-w-[200px]">
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                           {order.delivery_address}
                        </p>
                        <button onClick={() => copyToClipboard(order.delivery_address)} className="absolute -right-2 top-0 p-1.5 opacity-0 group-hover/addr:opacity-100 transition-all bg-foreground text-background rounded-full shadow-lg scale-75 hover:scale-100">
                          <Copy size={12}/>
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-6 align-top min-w-[180px]">
                      {order.payment_method === 'ONLINE' ? (
                          <span className="bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                            ⚡ Paid Online
                          </span>
                      ) : (
                        <div className="space-y-2">
                          {order.status !== 'PAID' && (
                            <div className="flex items-center gap-2">
                               {order.screenshot_id ? (
                                 <button onClick={() => setPreviewImage(order.screenshot_id)} className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline">
                                    <Eye size={12}/> View Proof
                                 </button>
                               ) : <span className="text-[9px] text-muted-foreground italic">No screenshot</span>}
                            </div>
                          )}

                          {order.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleAction(order.id, 'status', 'PAID')} className="bg-[var(--success)] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase hover:opacity-90 shadow-sm transition-transform active:scale-95">Accept</button>
                              <button onClick={() => handleAction(order.id, 'status', 'REJECTED')} className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-destructive hover:text-white transition-all">Reject</button>
                            </div>
                          ) : (
                            <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase border ${order.status === 'PAID' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-500 bg-red-50 border-red-200'}`}>
                              {order.status}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* <td className="px-6 py-6 align-top text-right">
                      {order.delivery_status === 'processing' ? (
                        <button 
                          onClick={() => setShippingOrder(order)} 
                          className="bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md flex items-center gap-2 ml-auto"
                        >
                          <Package size={14} /> Ship
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                              <Truck size={12} /> {order.delivery_status}
                            </span>
                            
                            <div className="flex gap-2">
                                {order.shipping_label_url && (
                                   <button onClick={() => window.open(order.shipping_label_url, '_blank')} className="p-1.5 rounded-lg bg-secondbg border border-border text-muted-foreground hover:text-foreground transition-colors" title="Print Label">
                                     <Printer size={12} />
                                   </button>
                                )}
                                {order.tracking_link && (
                                  <a href={order.tracking_link} target="_blank" className="p-1.5 rounded-lg bg-secondbg border border-border text-muted-foreground hover:text-primary transition-colors" title="Track">
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                            </div>
                            
                            {order.delivery_status !== 'delivered' && (
                                <button 
                                onClick={() => handleAction(order.id, 'delivery_status', 'delivered')}
                                className="text-[9px] font-bold text-muted-foreground hover:text-green-600 underline decoration-dotted underline-offset-2"
                                >
                                Mark Delivered
                                </button>
                            )}
                        </div>
                      )}
                    </td> */}

                    <td className="px-6 py-6 align-top text-right">
  {order.delivery_status === 'processing' ? (
    <button 
      onClick={() => setShippingOrder(order)} 
      className="bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md flex items-center gap-2 ml-auto"
    >
      <Package size={14} /> Ship Now
    </button>
  ) : (
    <div className="flex flex-col items-end gap-2">
        {/* 1. THE STATUS BADGE */}
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border ${
          order.delivery_status === 'delivered' 
            ? 'bg-green-50 text-green-600 border-green-200' 
            : 'bg-blue-50 text-blue-600 border-blue-200'
        }`}>
          <Truck size={12} /> {order.delivery_status}
        </span>
        
        {/* 2. THE BIG PRINT BUTTON (High Visibility) */}
        {order.shipping_label_url && (
           <button 
             onClick={() => window.open(order.shipping_label_url, '_blank')} 
             className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-foreground px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
           >
             <Printer size={12} /> Print Label
           </button>
        )}

        {/* 3. SECONDARY ACTIONS (Track / Mark Delivered) */}
        <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground">
           {order.tracking_link && (
             <a href={order.tracking_link} target="_blank" className="hover:text-primary flex items-center gap-1">
               <ExternalLink size={10} /> Track
             </a>
           )}
           
           {order.delivery_status !== 'delivered' && (
             <button 
               onClick={() => handleAction(order.id, 'delivery_status', 'delivered')}
               className="hover:text-green-600 decoration-dotted underline underline-offset-2"
             >
               Mark Delivered
             </button>
           )}
        </div>
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
                  <p className="font-bold text-sm">No orders found for this period.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-[2rem] p-2 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 border border-border">
            <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"><X size={24} /></button>
            <div className="aspect-[3/5] w-full bg-black rounded-[1.5rem] overflow-hidden flex items-center justify-center">
              <img src={`https://graph.facebook.com/v18.0/${previewImage}/`} className="w-full h-full object-contain" />
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