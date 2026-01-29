'use client'

import { useState } from 'react'
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react'
import { toast } from 'sonner'

export function SmartLinkGenerator({ productId }: { productId: string | number }) {
  const [platform, setPlatform] = useState('insta')
  const [copied, setCopied] = useState(false)

  // Determine the base URL dynamically
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  // The "Magic" Tracking Link
  const trackingLink = `${baseUrl}/p/${productId}?ref=${platform}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingLink)
    setCopied(true)
    toast.success(`Link copied for ${platform.toUpperCase()}!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { id: 'insta', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { id: 'fb', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'yt', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'other', name: 'Other', icon: Globe, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800' },
  ]

  return (
    <div className="space-y-6">
      {/* PLATFORM SELECTOR */}
      <div className="flex justify-center gap-3">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              platform === p.id 
              ? `border-blue-600 ${p.bg} scale-110 shadow-md` 
              : 'border-transparent bg-slate-50 dark:bg-slate-800 opacity-50 hover:opacity-100'
            }`}
            title={`Generate for ${p.name}`}
          >
            <p.icon size={24} className={p.color} />
          </button>
        ))}
      </div>

      {/* THE LINK BOX */}
      <div className="relative group">
        <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-slate-900 text-[10px] font-black text-blue-600 uppercase tracking-widest z-10">
          {platform} Tracking URL
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 group-hover:border-blue-400 transition-all">
          <code className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
            {trackingLink}
          </code>
          <button 
            onClick={copyToClipboard}
            className={`p-3 rounded-xl transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
        *When a customer clicks this, your WhatsApp bot will automatically <br />
        receive the source tag: <b>"{platform}"</b>
      </p>
    </div>
  )
}