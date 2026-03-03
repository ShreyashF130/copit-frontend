'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { ShieldCheck, Sun, Moon, Store, Instagram } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PublicHeader({ shop, storeLink }: { shop: any, storeLink: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* SHOP INFO */}
        <div className="flex items-center gap-3">
          <Link href={storeLink} className="w-10 h-10 shrink-0 rounded-full bg-secondbg overflow-hidden border border-border hover:opacity-80 transition-opacity">
            {shop.logo_url ? (
              <img src={shop.logo_url} className="w-full h-full object-cover" alt={shop.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground"><Store size={18}/></div>
            )}
          </Link>
          
          <div className="flex flex-col justify-center">
            <Link href={storeLink} className="text-sm font-black text-foreground leading-none hover:text-primary transition-colors">
              {shop.name}
            </Link>
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-[10px] font-bold text-[var(--success)] uppercase tracking-widest flex items-center gap-1 bg-[var(--success)]/10 px-1.5 py-0.5 rounded-md">
                <ShieldCheck size={10} /> Verified
              </p>
              
              {/* INSTAGRAM TRUST ANCHOR */}
              {shop.instagram_handle && (
                <a 
                  href={`https://instagram.com/${shop.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 bg-secondbg px-1.5 py-0.5 rounded-md border border-transparent hover:border-primary/20"
                >
                  <Instagram size={10} /> @{shop.instagram_handle.replace('@', '')}
                </a>
              )}
            </div>
          </div>
        </div>

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

          <Link href={storeLink} className="bg-foreground text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-white transition-colors whitespace-nowrap">
            Visit Store
          </Link>
        </div>
      </div>
    </div>
  )
}