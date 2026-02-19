import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()

    // 1. Get Order
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // 2. Determine Message based on status
    let messageBody = ""
    if (order.status === 'PAID' || order.payment_status === 'paid') {
         messageBody = `🎉 *Payment Verified!* \n\nYour Order #${orderId} is confirmed. We are packing it now! 📦`
    } else {
         return NextResponse.json({ error: "Order is not paid yet." }, { status: 400 })
    }

    // 3. Send (No Retry logic needed here, user can just click again)
    const WA_TOKEN = process.env.WHATSAPP_API_TOKEN
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID?.trim()

    const waRes = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${WA_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: order.customer_phone,
            type: "text",
            text: { body: messageBody },
        }),
    })

    if (!waRes.ok) throw new Error("WhatsApp API Rejected request")

    return NextResponse.json({ success: true })

  } catch (e) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}