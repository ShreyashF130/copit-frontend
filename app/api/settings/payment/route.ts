import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const API_KEY = process.env.ADMIN_SECRET_KEY
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    

    if (!API_KEY || !API_URL) {
      console.error("🔥 CRITICAL: Missing ADMIN_SECRET_KEY or NEXT_PUBLIC_API_URL in Next.js .env")
      throw new Error("Server Config Error")
    }
     const cleanApiUrl = API_URL.replace(/\/$/, '')
    const res = await fetch(`${cleanApiUrl}/dashboard/settings/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      body: JSON.stringify(body)
    })

    // 🔥 THIS IS THE FIX: Read the actual Python error
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("🔥 FastAPI Error Detail:", JSON.stringify(errorData, null, 2))
      
      // If Pydantic validation failed, it throws 422
      if (res.status === 422) throw new Error("Data Validation Error. Check Python Console.")
      
      throw new Error(errorData.detail || "Backend Update Failed")
    }
    
    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("Next.js Proxy Caught Error:", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}