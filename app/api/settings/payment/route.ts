import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // 🧹 THE FIX: .trim() removes hidden spaces, \n, and \r from copy-pasting
    const API_KEY = process.env.ADMIN_SECRET_KEY?.trim()
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim()

    if (!API_KEY || !API_URL) {
      console.error("🔥 CRITICAL: Missing ADMIN_SECRET_KEY or NEXT_PUBLIC_API_URL")
      throw new Error("Server Config Error")
    }

    const targetUrl = `${API_URL}/dashboard/settings/payment`
    console.log(`[DEBUG] Cleaned Fetch URL: ${targetUrl}`)

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("🔥 FastAPI Error Detail:", JSON.stringify(errorData, null, 2))
      
      if (res.status === 422) throw new Error("Data Validation Error. Check Python Console.")
      
      throw new Error(errorData.detail || "Backend Update Failed")
    }
    
    return NextResponse.json({ success: true })

  } catch (e: any) {
    // 🔍 THE DEEP DEBUGGER: This will tell us if it's ECONNREFUSED or INVALID_URL
    console.error("Next.js Proxy Caught Error:", e.message)
    console.error("Fetch Cause (The Real Reason):", e.cause) 
    
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}