'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductLinkDisplay({ productId, productName }: { productId: string, productName: string }) {
  const [copied, setCopied] = useState(false)
  
  // Create the tracking link
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shareLink = `${baseUrl}/p/${productId}?ref=social`

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    toast.success("Link copied! Paste this in your Insta Bio/Stories.")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl animate-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
          <Share2 size={12} /> Social Sales Link
        </span>
        <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
          Preview <ExternalLink size={10} />
        </button>
      </div>
      
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border dark:border-slate-700 shadow-sm">
        <code className="text-xs text-slate-500 truncate flex-1">{shareLink}</code>
        <button 
          onClick={copyLink}
          className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-[9px] text-slate-400 mt-2 italic">
        *Paste this link in Instagram Stories to track where your customers come from.
      </p>
    </div>
  )
}