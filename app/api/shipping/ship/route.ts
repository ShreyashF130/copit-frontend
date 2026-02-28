import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // 1. 📦 EXTRACT WEIGHT from the React frontend
    const { orderId, weight } = await req.json()
    
    const API_KEY = process.env.ADMIN_SECRET_KEY?.trim()
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim()

    if (!API_KEY || !API_URL) throw new Error("Server Config Error")

    const res = await fetch(`${API_URL}/dashboard/ship-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': API_KEY 
      },
      // 2. ⚖️ PASS WEIGHT TO PYTHON
      body: JSON.stringify({ 
        order_id: orderId,
        weight: weight ? parseFloat(weight) : 0.5 // Fallback to 500g if missing
      })
    })

    // 3. Extract the JSON from Python
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.detail || "Shiprocket API Error")
    }
    
    // 4. Pass the Python data back to React so the label auto-opens
    return NextResponse.json({ 
        success: true, 
        label_url: data.label_url, 
        tracking_url: data.tracking_url 
    })

  } catch (e: any) {
    console.error("Shipping Proxy Error:", e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}