import React from 'react'
import Link from 'next/link'
import { LifeBuoy } from 'lucide-react'

const DashboardFooter = () => {
  return (
    <footer className="w-full py-6 px-6 md:py-4 md:px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto transition-colors duration-300">
      {/* Container: Stack on mobile, Row on Desktop */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-5 md:gap-4">
        
        {/* LEFT: Copyright & Version */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300">© 2026 CopIt Inc.</span>
          <span className="hidden md:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-slate-800">
              v1.2.0
            </span>
            {/* Mobile Only Divider */}
            <span className="md:hidden text-slate-300 dark:text-slate-700">•</span>
            <span className="md:hidden text-[10px]">Patna, IN</span>
          </div>
        </div>

        {/* RIGHT: Status & Links */}
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          {/* Critical Links */}
          <div className="flex gap-6 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Link 
              href="/help" 
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <LifeBuoy size={12} /> Help
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              Terms
            </Link>
          </div>

          {/* System Status Indicator (Trust Builder) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
              Systems Normal
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter