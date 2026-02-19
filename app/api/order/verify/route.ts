import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, decision } = body

    // 🔒 CALL FASTAPI SECURELY
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/verify-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': process.env.ADMIN_SECRET_KEY! 
      },
      body: JSON.stringify({ order_id: orderId, decision: decision })
    })

    if (!res.ok) {
        // If Python rejects it (401), we throw error here
        const err = await res.json()
        throw new Error(err.detail || "Backend Rejected Request")
    }
    
    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("Verification Proxy Failed:", e.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}