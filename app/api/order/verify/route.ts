import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, decision } = body

    const API_KEY = process.env.ADMIN_SECRET_KEY
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    // Safety Check
    if (!API_KEY || !API_URL) {
        console.error("Missing Server Config (API_KEY or API_URL)")
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 })
    }

    // 🔒 CALL FASTAPI SECURELY
    const res = await fetch(`${API_URL}/dashboard/verify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      // Ensure data structure matches Pydantic model
      body: JSON.stringify({ 
          order_id: Number(orderId), // Ensure it's a number
          decision: decision 
      })
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Backend Error:", err)
        throw new Error(err.detail || "Backend Rejected Request")
    }
    
    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("Verification Proxy Failed:", e.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}