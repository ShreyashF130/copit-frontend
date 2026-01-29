'use server'

import { createServerClientInstance } from '@/app/lib/supabase-server' // Use your SERVER client
import { toSlug } from '@/app/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createShop(formData: FormData) {
  const supabase = await createServerClientInstance()

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to create a shop.' }
  }

  // 2. Extract Data
  const name = formData.get('name') as string
  const phoneNumber = formData.get('phone') as string
  
  // 3. Generate Unique Slug (The "Loop of Safety")
  let baseSlug = toSlug(name)
  let uniqueSlug = baseSlug
  let counter = 1

  while (true) {
    // Check if this slug exists
    const { data } = await supabase
      .from('shops')
      .select('id')
      .eq('slug', uniqueSlug)
      .single()

    if (!data) break; // Slug is free! Break the loop.

    // If taken, try next number (shop-1, shop-2)
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  // 4. Insert into Database
  const { error } = await supabase.from('shops').insert({
    owner_id: user.id,
    name: name,
    slug: uniqueSlug, // <--- SAVING THE SLUG
    phone_number: phoneNumber,
    category: formData.get('category'),
    upi_id: formData.get('upi'),
    open_time: formData.get('open_time'),
    close_time: formData.get('close_time'),
    max_cod_limit: parseFloat(formData.get('cod_limit') as string) || 5000,
    plan_type: 'free'
  })

  if (error) {
    return { error: error.message }
  }

  // 5. Success! Redirect
  revalidatePath('/dashboard')
  return { success: true }
}