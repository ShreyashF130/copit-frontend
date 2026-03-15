'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation' // 🚨 ADDED: Router for cache clearing
import { toast } from 'sonner'
import { Save, Store, MessageSquare, ShieldAlert, ImageIcon, Loader2, Instagram } from 'lucide-react'

export default function GeneralSettings() {
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter() // 🚨 ADDED

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('shops').select('*').eq('owner_id', user.id).single()
    setShop(data)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return
    setUploading(true)
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `logo-${Math.random()}.${fileExt}`
    const filePath = `${shop.id}/${fileName}`

    try {
        // 🚨 FIX 1: Using the correct shop-logos bucket
        const { error: uploadError } = await supabase.storage.from('shop-logos').upload(filePath, file)
        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('shop-logos').getPublicUrl(filePath)
        const newLogoUrl = data.publicUrl
        
        // 🚨 FIX 2: AUTO-SAVE TO DATABASE IMMEDIATELY
        const { error: dbError } = await supabase.from('shops').update({ logo_url: newLogoUrl }).eq('id', shop.id)
        if (dbError) throw dbError

        // Update local state for the preview
        setShop({ ...shop, logo_url: newLogoUrl })
        
        toast.success("Logo updated successfully!")
        router.refresh() // 🚨 FIX 3: Clear Next.js cache so the navbar updates instantly

    } catch (error) {
        toast.error("Upload failed")
    }
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const rawInsta = formData.get('instagram_handle')?.toString() || ''
    const cleanInsta = rawInsta.replace('@', '').replace('https://instagram.com/', '').trim()
    
    const updates = {
      name: formData.get('shop_name'),
      welcome_message: formData.get('welcome_msg'),
      return_policy: formData.get('return_policy'),
      instagram_handle: cleanInsta,
      // logo_url is removed from here because it now auto-saves during upload!
    }

    const { error } = await supabase.from('shops').update(updates).eq('id', shop.id)
    if (error) {
        toast.error("Failed to save")
    } else {
        toast.success("Shop settings updated!")
        fetchSettings() 
        router.refresh() // 🚨 FIX 3: Clear Next.js cache
    }
    setLoading(false)
  }

  if (!shop) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* 1. BRANDING SECTION */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h3 className="font-black text-lg text-foreground mb-6 flex items-center gap-2">
            <Store className="text-primary" /> Store Branding
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-full bg-secondbg border-4 border-card shadow-lg overflow-hidden flex items-center justify-center relative group">
                    {shop.logo_url ? (
                        <img src={shop.logo_url} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-muted-foreground" size={32} />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-xs font-bold">Change</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {uploading && <span className="text-xs font-bold text-primary animate-pulse">Uploading...</span>}
            </div>

            <div className="flex-1 w-full space-y-4">
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Shop Name</label>
                    <input 
                        name="shop_name" 
                        defaultValue={shop.name} 
                        className="w-full p-4 mt-1 bg-secondbg text-foreground rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all" 
                    />
                </div>
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 flex items-center gap-2"><Instagram size={12}/> Instagram Handle</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                        <input 
                            name="instagram_handle" 
                            defaultValue={shop.instagram_handle} 
                            placeholder="yourstore" 
                            className="w-full p-4 pl-8 bg-secondbg text-foreground rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all placeholder:text-muted-foreground/50" 
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 flex items-center gap-2"><MessageSquare size={12}/> Bot Welcome Message</label>
                    <input 
                        name="welcome_msg" 
                        defaultValue={shop.welcome_message} 
                        placeholder="Hi! Welcome to [Name]." 
                        className="w-full p-4 mt-1 bg-secondbg text-foreground rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all placeholder:text-muted-foreground/50" 
                    />
                </div>
            </div>
        </div>
      </div>

      {/* 2. RETURN POLICY */}
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h3 className="font-black text-lg text-foreground mb-2 flex items-center gap-2">
            <ShieldAlert className="text-[var(--warning)]" /> Return & Refund Policy
        </h3>
        <p className="text-sm text-muted-foreground mb-6">This text will be visible to customers on your Storefront.</p>
        
        <textarea 
            name="return_policy" 
            defaultValue={shop.return_policy} 
            placeholder="e.g. No returns allowed unless the item is damaged."
            className="w-full p-4 bg-[var(--warning)]/5 rounded-2xl font-medium text-foreground outline-none focus:ring-2 focus:ring-[var(--warning)] border border-[var(--warning)]/20 min-h-[120px] placeholder:text-muted-foreground/50"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin inline mr-2" /> : null}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  )
}