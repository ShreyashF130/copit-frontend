import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const API_KEY = process.env.ADMIN_SECRET_KEY?.trim()
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim()

    if (!API_KEY || !API_URL) throw new Error("Server Config Error")

    const res = await fetch(`${API_URL}/api/dashboard/ship-manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      body: JSON.stringify({ 
          order_id: body.orderId,
          courier_name: body.courierName,
          tracking_url: body.trackingLink
      })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || "Backend Error")
    }
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}