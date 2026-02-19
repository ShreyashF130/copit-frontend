'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import Logo from './logo'
import { ThemeToggle } from './themetoggle' 

export default function Navbar({ user }: { user: any }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // 🧠 SMART SCROLL LOGIC
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY

        // IF SCROLLING DOWN (>10px) -> HIDE NAVBAR
        if (currentScrollY > lastScrollY && currentScrollY > 10) {
          setIsVisible(false)
        } 
        // IF SCROLLING UP -> SHOW NAVBAR
        else {
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  return (
    <nav 
      className={`fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
      
        <div className="cursor-pointer">
           <Link href="/">
             <Logo/>
           </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="/demo" className="hover:text-primary transition-colors">Demo</a>
          </div>
          
          <ThemeToggle />

          {/* CONDITIONAL RENDERING LOGIC */}
          {user ? (
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="hidden md:block text-sm font-bold hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/login?view=signup" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-black hover:opacity-90 transition-all btn-velocity shadow-xl">
                Get Started
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  )
}