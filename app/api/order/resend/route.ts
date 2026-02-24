import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    
    // 🧹 Clean the environment variables to prevent ENOTFOUND errors
    const API_KEY = process.env.ADMIN_SECRET_KEY?.trim()
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim()

    if (!API_KEY || !API_URL) {
        console.error("🔥 CRITICAL: Missing ADMIN_SECRET_KEY or NEXT_PUBLIC_API_URL")
        throw new Error("Server Config Error")
    }

    // 🔒 Call the Python Backend (The Single Source of Truth)
    const res = await fetch(`${API_URL}/dashboard/resend-receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      body: JSON.stringify({ order_id: orderId })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("🔥 Python Resend Error:", JSON.stringify(err, null, 2))
      throw new Error(err.detail || "Backend Failed to Resend")
    }
    
    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("Resend Proxy Error:", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}