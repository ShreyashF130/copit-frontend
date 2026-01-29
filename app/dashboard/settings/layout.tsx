'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, CreditCard, Truck } from 'lucide-react'

const tabs = [
  { name: 'General & Bot', href: '/dashboard/settings', icon: User },
  { name: 'Payments', href: '/dashboard/settings/payments', icon: CreditCard },
  { name: 'Shipping', href: '/dashboard/settings/shipping', icon: Truck },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-foreground mb-8 tracking-tight">STORE SETTINGS</h1>
      
      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-6 border-b border-border mb-8 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.name} href={tab.href}>
              <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                  : 'bg-card text-muted-foreground hover:bg-secondbg hover:text-foreground border-transparent hover:border-border'
              }`}>
                <tab.icon size={18} /> {tab.name}
              </div>
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}