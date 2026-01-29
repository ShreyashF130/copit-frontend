'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ShieldCheck, Sun, Moon, Store } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PublicHeader({ shop, storeLink }: { shop: any, storeLink: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* SHOP INFO */}
        <Link href={storeLink} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-secondbg overflow-hidden border border-border">
            {shop.logo_url ? (
              <img src={shop.logo_url} className="w-full h-full object-cover" alt={shop.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground"><Store size={18}/></div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground leading-none">{shop.name}</h2>
            <p className="text-[10px] font-bold text-[var(--success)] uppercase tracking-widest mt-1 flex items-center gap-1">
              <ShieldCheck size={10} /> Verified Seller
            </p>
          </div>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2.5 rounded-full bg-secondbg text-foreground hover:bg-border transition-colors border border-transparent hover:border-border"
            >
              {theme === 'dark' ? <Sun size={18} className="text-[var(--warning)]" /> : <Moon size={18} />}
            </button>
          )}

          <Link href={storeLink} className="bg-foreground text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-colors">
            Visit Store
          </Link>
        </div>
      </div>
    </div>
  )
}