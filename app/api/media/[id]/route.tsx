import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> } // 👈 1. Type as Promise
) {
  try {
    const params = await props.params // 👈 2. Await the Promise
    const mediaId = params.id
    
    const WA_TOKEN = process.env.WHATSAPP_API_TOKEN

    if (!WA_TOKEN) {
      console.error("Missing WHATSAPP_API_TOKEN env var")
      return new NextResponse("Server Config Error", { status: 500 })
    }

    // 3. Log what we are fetching (Debug)
    console.log(`[PROXY] Fetching media ID: ${mediaId}`)

    // 4. Ask Facebook for the Download URL
    const urlRes = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${WA_TOKEN}` }
    })
    
    if (!urlRes.ok) {
      const err = await urlRes.json()
      console.error("[PROXY] Facebook API Error:", JSON.stringify(err, null, 2))
      return new NextResponse("Failed to find media URL", { status: 404 })
    }
    
    const json = await urlRes.json()
    const downloadUrl = json.url 

    // 5. Download the Image Binary using the Token
    const imageRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${WA_TOKEN}` }
    })

    if (!imageRes.ok) {
      return new NextResponse("Failed to download image binary", { status: 502 })
    }

    // 6. Stream it to the Browser
    const imageBlob = await imageRes.blob()
    
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400' 
      }
    })

  } catch (e: any) {
    console.error("[PROXY] Fatal Error:", e.message)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}