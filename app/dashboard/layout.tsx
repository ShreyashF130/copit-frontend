'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import Footer from '../Footer.tsx/page'
import Logo from '@/app/components/logo'
import SignOutButton from '../components/signoutbtn'
import DashboardFooter from '../components/DashboardFooter'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Store,
  Sun,
  Moon,
  ChartNoAxesColumnIncreasing,
  ReceiptIndianRupee,
  Send,
  Ticket,
  Star
} from 'lucide-react'
import Onlylogo from '../components/onlylogo'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Coupons', href: '/dashboard/coupans', icon: Ticket  },
  { name: 'Upsell', href: '/dashboard/growth/upsell', icon: ChartNoAxesColumnIncreasing },
  { name: 'Billing', href: '/dashboard/billing', icon: ReceiptIndianRupee },
  { name: 'Advertise', href: '/dashboard/marketing', icon: Send },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings }
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-background" /> 
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside 
        className="hidden lg:flex flex-col bg-card/80 backdrop-blur-xl border-r border-border transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group w-[88px] hover:w-72 h-screen sticky top-0 z-50 shadow-2xl shadow-black/5"
      >
        <div className="flex flex-col h-full w-full">
          
         
          <div className="h-24 flex items-center px-6 relative shrink-0 overflow-hidden">
        
          <div className="shrink-0 z-30 flex items-center justify-center w-8 h-8">

</div>
            
            {/* Text Wrapper - Fades/Slides in */}
            <div className="absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 whitespace-nowrap">
               <Link href='/' className='cursor-pointer'><Logo/></Link>
            </div>
          </div>

         
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              nav::-webkit-scrollbar { display: none; }
            `}</style>
            
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center h-12 px-3 rounded-xl transition-all duration-200 relative overflow-hidden group/item
                    ${isActive 
                      ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'text-muted-foreground hover:bg-secondbg hover:text-foreground'}
                  `}
                >
                  {/* Active Indicator Strip */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
                  )}

                  <item.icon size={22} className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'ml-2' : ''} group-hover/item:scale-110`} />
                  
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 whitespace-nowrap absolute left-14">
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* FOOTER ACTIONS */}
          <div className="p-4 border-t border-border shrink-0 space-y-2 bg-card/50">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center h-12 px-3 w-full rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondbg hover:text-foreground transition-all relative overflow-hidden"
            >
              <div className="flex-shrink-0 w-6 flex justify-center">
                {theme === 'dark' ? (
                  <Sun size={20} className="text-[var(--warning)]" />
                ) : (
                  <Moon size={20} />
                )}
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Logout */}
            <div className="flex items-center h-12 px-3 w-full rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all relative overflow-hidden">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute ">
                <SignOutButton/>
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden bg-card/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
               <Onlylogo />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">Shopinchat</span>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-foreground bg-secondbg rounded-full border border-border">
            {theme === 'dark' ? <Sun size={20} className="text-[var(--warning)]" /> : <Moon size={20} />}
          </button>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-background transition-colors duration-300 scroll-smooth">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
            {children}
          </div>
          <div className="px-6 lg:px-10">
             {/* <Footer/> */}
             <DashboardFooter/>
          </div>
        </main>
      </div>
    </div>
  )
}