'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/app/lib/supabase-browser'
import { Loader2, MapPin } from 'lucide-react'

// 1. YOUR LOGIC COMPONENT (Internal)
function AddressFormContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') 
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 🛑 FIX: Capture the form data BEFORE any 'await' calls
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Now extract values immediately so we have them ready
    const pincode = formData.get('pincode') as string
    const house_no = formData.get('house_no') as string
    const area = formData.get('area') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string

    if (!token) return alert("Error: Invalid Link")
    setLoading(true)

    // 🛡️ SECURITY CHECK (Now we can safely await)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('phone_number')
      .eq('magic_token', token)
      .single()

    if (userError || !user) {
      setLoading(false)
      return alert("❌ Security Error: Invalid or Expired Link. Please restart the chat.")
    }

    const phone = user.phone_number 
    
    // Save Address (Using the variables we captured at the start)
    const { error } = await supabase.from('addresses').insert({
      user_id: phone,
      pincode: pincode,
      house_no: house_no,
      area: area,
      city: city,
      state: state,
      is_default: true
    })

    if (error) {
      alert("Database Error: " + error.message)
      setLoading(false)
    } else {
      // Clear token
      await supabase.from('users').update({ magic_token: null }).eq('phone_number', phone)
      
      // Redirect
      window.location.href = `https://wa.me/?text=ADDRESS_DONE` 
    }
  }

  if (!token) return <div className="p-10 text-center text-red-500 font-bold">❌ Invalid Link</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-xl border border-slate-100 space-y-5">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Delivery Details</h1>
          <p className="text-sm text-slate-500 font-medium">Secure Check for your order</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <input required name="pincode" type="text" placeholder="Pincode" pattern="[0-9]{6}" className="col-span-1 bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" />
           <input required name="city" type="text" placeholder="City" className="col-span-1 bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" />
        </div>
        <input required name="house_no" type="text" placeholder="House No / Flat" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" />
        <input required name="area" type="text" placeholder="Area / Road" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none" />
        <select name="state" className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm outline-none">
           <option value="Maharashtra">Maharashtra</option>
           <option value="Delhi">Delhi</option>
        </select>

        <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg flex justify-center">
          {loading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
        </button>
      </form>
    </div>
  )
}



export default function AddressPage() {
  return (

    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AddressFormContent />
    </Suspense>
  )
}
