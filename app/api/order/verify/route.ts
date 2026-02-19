import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { orderId, decision } = await req.json()

    console.log(`[VERIFY] Processing Order #${orderId} - Decision: ${decision}`)

    if (!orderId || !decision) {
      return NextResponse.json({ error: "Missing Data" }, { status: 400 })
    }

    // 1. Fetch Order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('customer_phone, id')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      console.error("[VERIFY] Order not found in DB")
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // 2. Prepare Updates
    let updates = {}
    let messageBody = ""

    if (decision === 'APPROVE') {
      updates = { payment_status: 'paid', status: 'processing' }
      messageBody = `🎉 *Payment Verified!* \n\nYour Order #${orderId} is confirmed. We are packing it now! 📦`
    } else {
      updates = { payment_status: 'failed', status: 'cancelled' }
      messageBody = `⚠️ *Payment Rejected.*\n\nWe could not verify your payment for Order #${orderId}. Please contact support.`
    }

    // 3. Update Database
    const { error: updateError } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)

    if (updateError) {
      console.error("[VERIFY] DB Update Failed:", updateError)
      throw updateError
    }

    // 4. Send WhatsApp Notification (Aggressive Debugging)
    const WA_TOKEN = process.env.WHATSAPP_API_TOKEN
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID

    if (!WA_TOKEN || !PHONE_ID) {
      console.error("🔥 CRITICAL: Missing WHATSAPP_API_TOKEN or PHONE_ID in Environment Variables")
      // We don't fail the request, just log it, so at least the DB updates.
      return NextResponse.json({ success: true, warning: "WhatsApp config missing" })
    }

    console.log(`[VERIFY] Sending WhatsApp to ${order.customer_phone}...`)

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

    const waData = await waRes.json()

    if (!waRes.ok) {
      console.error("🔥 WhatsApp API Error:", JSON.stringify(waData, null, 2))
      // Returning success: true because the ORDER was updated, even if the message failed.
      return NextResponse.json({ success: true, warning: "Message failed to send" })
    }

    console.log("[VERIFY] WhatsApp Sent Successfully")
    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("🔥 [VERIFY] Fatal Error:", e.message)
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 })
  }
}