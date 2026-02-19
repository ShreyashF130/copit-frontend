import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const mediaId = params.id
  const WA_TOKEN = process.env.WHATSAPP_API_TOKEN

  if (!WA_TOKEN) {
    return new NextResponse("Server Config Error: Missing WA Token", { status: 500 })
  }

  try {
    // 1. Ask Facebook for the Download URL
    const urlRes = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${WA_TOKEN}` }
    })
    
    if (!urlRes.ok) throw new Error("Failed to find media URL")
    
    const json = await urlRes.json()
    const downloadUrl = json.url // This is the real link

    // 2. Download the Image Binary using the Token
    const imageRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${WA_TOKEN}` }
    })

    if (!imageRes.ok) throw new Error("Failed to download image binary")

    // 3. Stream it to the Browser
    const imageBlob = await imageRes.blob()
    
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': imageRes.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400' // Cache for 1 day
      }
    })

  } catch (e) {
    console.error("Media Proxy Error:", e)
    return new NextResponse("Failed to load image", { status: 500 })
  }
}