'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { 
  Search, Share2, Trash2, Loader2, Plus, X, Edit3, AlertTriangle,
  Package, Settings2, ImageIcon, Instagram, Youtube, Facebook, 
  Link as LinkIcon, Copy, Save, FileSpreadsheet
} from 'lucide-react'
import { toast } from 'sonner'
import BulkUploadModal from './bulkupload' 

// --- SMART LINK GENERATOR ---
const SmartLinkGenerator = ({ productId }: { productId: number }) => {
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${productId}` : `.../product/${productId}`
  const platforms = [
    { name: 'Instagram', ref: 'instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500', icon: <Instagram size={14} /> },
    { name: 'YouTube', ref: 'youtube', color: 'bg-red-600', icon: <Youtube size={14} /> },
    { name: 'Facebook', ref: 'facebook', color: 'bg-blue-600', icon: <Facebook size={14} /> },
    { name: 'Direct/Other', ref: 'direct', color: 'bg-slate-800', icon: <LinkIcon size={14} /> },
  ]
  const handleCopy = (ref: string) => {
    const url = `${baseUrl}?ref=${ref}`; navigator.clipboard.writeText(url); toast.success(`Copied ${ref} link! 📋`)
  }
  return (
    <div className="space-y-3 mt-6 w-full text-left">
      {platforms.map((p) => (
        <div key={p.name} className="flex items-center justify-between p-3 bg-secondbg rounded-xl border border-border group">
           <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center text-white shrink-0`}>{p.icon}</div>
              <div className="min-w-0"><p className="text-xs font-bold">{p.name}</p></div>
           </div>
           <button onClick={() => handleCopy(p.ref)} className="px-4 py-2 bg-card border rounded-lg text-xs font-black"><Copy size={12} /></button>
        </div>
      ))}
    </div>
  )
}

export default function ItemsManager({ shopId }: { shopId: number }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isBulkUploading, setIsBulkUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [specs, setSpecs] = useState<{name: string, options: string[]}[]>([])
  const [variants, setVariants] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => { if (shopId) fetchItems() }, [shopId])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase.from('items').select('*').eq('shop_id', shopId).order('id', { ascending: false })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setSpecs(item.attributes?.specs || [])
    setVariants(item.attributes?.variants || [])
    setIsEditing(true)
  }

  async function handleUpdateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true)
    const formData = new FormData(e.currentTarget)
    const variantStock = variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0)
    const finalStock = variants.length > 0 ? variantStock : (parseInt(formData.get('stock') as string) || 0)

    const updatedData = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      attributes: { specs, variants, has_complex_variants: variants.length > 0 },
      stock_count: finalStock
    }

    const { error } = await supabase.from('items').update(updatedData).eq('id', editingItem.id)
    if (!error) { toast.success('Updated! ⚡'); setIsEditing(false); fetchItems() }
    setLoading(false)
  }

  async function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true)
    const formData = new FormData(e.currentTarget)
    const variantStock = variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0)
    const productData = {
      shop_id: shopId, name: formData.get('name'), price: parseFloat(formData.get('price') as string),
      category: formData.get('category'), description: formData.get('description'),
      attributes: { specs, variants, has_complex_variants: variants.length > 0 },
      stock_count: variants.length > 0 ? variantStock : (parseInt(formData.get('stock') as string) || 0)
    }
    const { error } = await supabase.from('items').insert([productData])
    if (!error) { setIsAdding(false); fetchItems(); toast.success('Launched!') }
    setLoading(false)
  }

  async function handleDeleteItem(itemId: number) {
    if (!confirm("Delete product?")) return
    await supabase.from('items').delete().eq('id', itemId)
    fetchItems()
  }

  const generateVariants = () => {
    let result: any[] = []
    if (specs[0]?.options.length > 0) {
      specs[0].options.forEach(opt1 => {
        if (specs[1]?.options.length > 0) {
          specs[1].options.forEach(opt2 => result.push({ title: `${opt1.trim()} / ${opt2.trim()}`, price: 0, stock: 0, image: '' }))
        } else result.push({ title: opt1.trim(), price: 0, stock: 0, image: '' })
      })
    }
    setVariants(result)
  }

  const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* SEARCH & ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-[2rem] border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondbg border-none font-bold" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsBulkUploading(true)} className="bg-secondbg px-6 py-3 rounded-xl font-bold flex items-center gap-2"><FileSpreadsheet size={20} /> Bulk</button>
          <button onClick={() => { setSpecs([]); setVariants([]); setIsAdding(true); }} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black flex items-center gap-2"><Plus size={20} /> ADD</button>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((item) => {
          const isLowStock = item.stock_count > 0 && item.stock_count < 5;
          const isOutOfStock = item.stock_count <= 0;

          return (
            <div 
              key={item.id} 
              className={`bg-card p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all ${
                isLowStock ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-border'
              } ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="w-16 h-16 bg-secondbg rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-border">
                 {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <Package className="text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg truncate">{item.name}</h3>
                  {isLowStock && <span className="bg-rose-500 text-white text-[8px] px-2 py-1 rounded-full font-black animate-pulse">LOW STOCK</span>}
                  {isOutOfStock && <span className="bg-slate-800 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase">Sold Out</span>}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.category} • Stock: {item.stock_count}</p>
              </div>
              <div className="text-2xl font-black text-primary">₹{item.price}</div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(item)} className="p-3 bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-500/20"><Edit3 size={20} /></button>
                <button onClick={() => setSelectedItem(item)} className="p-3 bg-secondbg text-primary rounded-xl hover:bg-primary/10"><Share2 size={20} /></button>
                <button onClick={() => handleDeleteItem(item.id)} className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20"><Trash2 size={20} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           <div className="bg-card w-full max-w-5xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] border">
            <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="absolute right-8 top-8 p-2 bg-secondbg rounded-full"><X size={24} /></button>
            <h2 className="text-3xl font-black mb-8 uppercase italic flex items-center gap-2">
               {isEditing ? <Edit3 className="text-blue-500" /> : <Package className="text-primary" />}
               {isEditing ? `Edit: ${editingItem.name}` : 'New Collection'}
            </h2>
            
            <form onSubmit={isEditing ? handleUpdateProduct : handleAddItem} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Product Name</label>
                  <input name="name" defaultValue={editingItem?.name} required className="w-full p-4 rounded-2xl bg-secondbg font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Category</label>
                  <input name="category" defaultValue={editingItem?.category} required className="w-full p-4 rounded-2xl bg-secondbg font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Description</label>
                  <textarea name="description" defaultValue={editingItem?.description} required className="w-full p-4 rounded-2xl bg-secondbg font-bold outline-none min-h-[120px] resize-none" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Base Price (₹)</label>
                    <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full p-4 rounded-2xl bg-secondbg font-bold outline-none" />
                  </div>
                  {variants.length === 0 && (
                    <div className="flex-1 space-y-2">
                      <label className={`text-[10px] font-black uppercase ml-2 ${editingItem?.stock_count < 5 ? 'text-rose-500' : 'text-muted-foreground'}`}>Stock</label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock_count} className={`w-full p-4 rounded-2xl bg-secondbg font-bold outline-none ${editingItem?.stock_count < 5 ? 'border-2 border-rose-500' : ''}`} />
                    </div>
                  )}
                </div>

                {/* --- SPECS --- */}
                <div className="p-6 bg-primary/5 rounded-[2rem] space-y-4 border border-primary/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">Custom Specs</p>
                   {specs.map((s, i) => (
                     <div key={i} className="flex gap-2 bg-card p-3 rounded-xl">
                       <input placeholder="Size" value={s.name} onChange={(e) => { const n = [...specs]; n[i].name = e.target.value; setSpecs(n); }} className="w-1/3 p-2 bg-secondbg rounded-lg text-xs" />
                       <input placeholder="S, M, L" value={s.options.join(',')} onChange={(e) => { const n = [...specs]; n[i].options = e.target.value.split(','); setSpecs(n); }} className="flex-1 p-2 bg-secondbg rounded-lg text-xs" />
                       <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}><Trash2 size={16} className="text-destructive"/></button>
                     </div>
                   ))}
                   <div className="flex gap-2">
                      <button type="button" onClick={() => setSpecs([...specs, {name: '', options: []}])} className="flex-1 py-3 border-2 border-dashed rounded-xl text-xs font-bold">+ Add Spec</button>
                      {specs.length > 0 && <button type="button" onClick={generateVariants} className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold">Re-Generate Variants</button>}
                   </div>
                </div>
              </div>

              {/* --- VARIANTS LIST --- */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto bg-secondbg p-6 rounded-[2.5rem]">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variant Inventory</p>
                {variants.length > 0 ? variants.map((v, i) => {
                   const variantLowStock = v.stock > 0 && v.stock < 5;
                   return (
                    <div key={i} className={`flex gap-3 bg-card p-4 rounded-2xl border items-center ${variantLowStock ? 'border-rose-500' : 'border-border'}`}>
                      <div className="w-10 h-10 bg-secondbg rounded-lg overflow-hidden shrink-0">{v.image ? <img src={v.image} className="object-cover w-full h-full" /> : <ImageIcon size={14}/>}</div>
                      <div className="flex-1 text-xs font-black truncate">
                        {v.title}
                        {variantLowStock && <AlertTriangle size={10} className="text-rose-500 inline ml-1" />}
                      </div>
                      <input placeholder="₹" type="number" value={v.price} onChange={(e) => { const n = [...variants]; n[i].price = e.target.value; setVariants(n); }} className="w-16 p-2 bg-secondbg rounded-lg text-xs" />
                      <input placeholder="Qty" type="number" value={v.stock} onChange={(e) => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} className={`w-14 p-2 rounded-lg text-xs ${variantLowStock ? 'bg-rose-500/10 text-rose-600 font-black' : 'bg-secondbg'}`} />
                    </div>
                  )
                }) : <div className="p-10 text-center text-xs font-bold text-muted-foreground">No Variants Defined</div>}
              </div>

              <button type="submit" disabled={loading} className="lg:col-span-2 w-full py-6 bg-foreground text-background rounded-[2rem] font-black text-lg flex items-center justify-center gap-3">
                 {loading ? <Loader2 className="animate-spin" /> : (isEditing ? <><Save /> UPDATE PRODUCT</> : "LAUNCH PRODUCT")}
              </button>
            </form>
           </div>
        </div>
      )}

      {/* --- SHARE MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-card w-full max-w-md rounded-[2.5rem] p-8 text-center relative border shadow-2xl">
             <button onClick={() => setSelectedItem(null)} className="absolute right-6 top-6 text-muted-foreground"><X size={20}/></button>
             <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-primary mb-4"><Share2 size={32} /></div>
             <h2 className="text-xl font-black uppercase tracking-tight">Track Your Sales</h2>
             <SmartLinkGenerator productId={selectedItem.id} />
          </div>
        </div>
      )}

      {isBulkUploading && <BulkUploadModal shopId={shopId} onClose={() => { setIsBulkUploading(false); fetchItems(); }} />}
    </div>
  )
}