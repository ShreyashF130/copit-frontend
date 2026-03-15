'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Store, Clock, CreditCard, ShieldCheck, Loader2, Lock, CheckCircle2, Instagram, Upload, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function ShopSetupPage() {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false) 
  
  // 🚨 NEW: Image Upload States
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
      else router.push('/login')
    }
    getUser()
  }, [router, supabase.auth])

  // 🚨 NEW: Handle Image Selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        toast.error("Image must be less than 2MB")
        return
      }
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userId) return
    if (!agreed) {
        toast.error("You must agree to the Terms & Privacy Policy")
        return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // 1. Sanitize Data
    const rawInsta = formData.get('instagram_handle')?.toString() || ''
    const cleanInsta = rawInsta.replace('@', '').replace('https://instagram.com/', '').trim()
    const shopName = formData.get('name')?.toString() || ''
    
    // 🚨 2. Auto-Generate SEO Slug (e.g. "Urban Threads" -> "urban-threads")
    const generatedSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // 🚨 3. Upload Logo to Supabase Storage (If selected)
    let finalLogoUrl = null
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}` // Unique filename to prevent overwrites
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shop-logos') // Make sure this bucket exists and is PUBLIC!
        .upload(fileName, logoFile)

      if (uploadError) {
        toast.error(`Image Upload Failed: ${uploadError.message}`)
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('shop-logos')
        .getPublicUrl(fileName)
        
      finalLogoUrl = publicUrl
    }

    // 4. Construct Final DB Payload
    const shopData = {
      name: shopName,
      slug: generatedSlug, // Required for your dynamic routing to work!
      logo_url: finalLogoUrl, // The uploaded image URL
      phone_number: formData.get('phone'),
      category: formData.get('category'),
      instagram_handle: cleanInsta, 
      upi_id: formData.get('upi'),
      open_time: formData.get('open_time'),
      close_time: formData.get('close_time'),
      max_cod_limit: parseFloat(formData.get('cod_limit') as string) || 5000,
      owner_id: userId,
      plan_type: 'free'
    }

    // 5. Save to Database
    const { error } = await supabase.from('shops').insert([shopData])

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Shop Created Successfully! 🚀')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 font-sans text-foreground transition-colors duration-300">
      
      <div className="text-center mb-10 space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <Store className="text-primary-foreground w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Setup Your Store</h1>
        <p className="text-muted-foreground font-medium">Launch your WhatsApp commerce engine in seconds.</p>
      </div>

      <div className="w-full max-w-2xl bg-card rounded-[2.5rem] shadow-xl shadow-black/5 border border-border p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Store size={20} /></div>
              <h2 className="font-bold text-lg text-foreground">Shop Identity</h2>
            </div>
            
            {/* 🚨 NEW: Logo Upload UI */}
            <div className="flex items-center gap-6 p-5 bg-secondbg rounded-2xl border border-dashed border-border">
                <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Shop Logo" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon size={24} className="text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                        <Upload size={20} className="text-white" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-foreground">Store Logo</h3>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, max 2MB. This builds instant trust with buyers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Shop Name</label>
                <input name="name" placeholder="e.g. Urban Threads" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">WhatsApp Number</label>
                <input name="phone" type="tel" placeholder="e.g. 919876543210" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Category</label>
                <input name="category" placeholder="e.g. Fashion, Electronics" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1 flex items-center gap-1"><Instagram size={12}/> Instagram Handle</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                    <input name="instagram_handle" placeholder="yourstore" className="w-full p-4 pl-8 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-primary border border-transparent focus:bg-card transition-all" />
                </div>
              </div>
            </div>
          </section>

          {/* TIMING SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Clock size={20} /></div>
              <h2 className="font-bold text-lg text-foreground">Operational Hours</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Opens At</label>
                <input name="open_time" type="time" defaultValue="09:00" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:bg-card transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Closes At</label>
                <input name="close_time" type="time" defaultValue="21:00" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-purple-500 border border-transparent focus:bg-card transition-all" />
              </div>
            </div>
          </section>

          {/* PAYMENTS & SAFETY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--success)]/10 rounded-lg text-[var(--success)]"><CreditCard size={20} /></div>
              <h2 className="font-bold text-lg text-foreground">Payments & Safety</h2>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Personal UPI ID (For Direct Payments)</label>
                  <input name="upi" placeholder="e.g. yourname@okicici" required className="w-full p-4 bg-secondbg rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-[var(--success)] border border-transparent focus:bg-card transition-all" />
              </div>

              <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-border p-5 bg-secondbg/50">
                <Link href='/pricing' className="absolute top-3 right-3 bg-foreground text-background text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                   <Lock size={10} /> Pro Only
                </Link>
                <div className="opacity-40 select-none filter blur-[1px] pointer-events-none">
                   <label className="block text-xs font-bold text-muted-foreground mb-2">Razorpay Gateway Integration</label>
                   <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Key ID" className="w-full p-3 bg-card rounded-xl border border-border" disabled />
                      <input placeholder="Key Secret" className="w-full p-3 bg-card rounded-xl border border-border" disabled />
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className="text-[var(--warning)]" />
                     <label className="text-xs font-bold text-muted-foreground uppercase">Max COD Limit (₹)</label>
                  </div>
                  <input name="cod_limit" type="number" defaultValue={5000} className="w-full p-4 bg-[var(--warning)]/5 rounded-2xl font-bold text-foreground outline-none focus:ring-2 focus:ring-[var(--warning)] border border-transparent focus:bg-card transition-all" />
                  <p className="text-[10px] text-muted-foreground font-medium ml-1">Orders above this amount will force online payment.</p>
              </div>
            </div>
          </section>

          <hr className="border-border" />

          {/* LEGAL CHECKBOX */}
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex items-start gap-4 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={() => setAgreed(!agreed)}>
              <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-primary border-primary' : 'bg-card border-border group-hover:border-primary/50'}`}>
                 {agreed && <CheckCircle2 size={16} className="text-primary-foreground" />}
              </div>
              <div>
                 <p className="text-sm font-bold text-foreground select-none">I agree to the Terms & Policies</p>
                 <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    By creating a shop, I agree to the <Link href="/legal/terms" target="_blank" className="text-primary underline font-bold hover:opacity-80" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>, <Link href="/legal/privacy" target="_blank" className="text-primary underline font-bold hover:opacity-80" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>, and <Link href="/legal/refund" target="_blank" className="text-primary underline font-bold hover:opacity-80" onClick={(e) => e.stopPropagation()}>Refund Policy</Link>. 
                 </p>
              </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !agreed}
            className="w-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-black text-lg py-5 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "LAUNCH MY SHOP 🚀"}
          </button>
        </form>
      </div>
    </div>
  )
}