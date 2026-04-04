'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Zap, ShoppingBag,
  Smartphone, CreditCard, Star, CheckCircle2,
  TrendingUp, ShieldCheck, Box,
  Globe, LayoutDashboard, Lock, Layers,
  RefreshCcw, Truck, MousePointerClick, Activity,
  MessageCircle, Sparkles, AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import Footer from '../Footer.tsx/page'
import Navbar from '../components/Navbar'

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */

interface User {
  id: string
  email?: string
  [key: string]: unknown
}

interface LandingClientProps {
  user: User | null
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
}

interface StatCardProps {
  end: number
  suffix?: string
  label: string
}

interface ActivityRowProps {
  icon: LucideIcon
  iconColor: string
  title: string
  badge: string
  badgeColor: string
  subtitle: string
}

interface StepCardProps {
  icon: LucideIcon
  title: string
  desc: string
  index: number
}

/* ─────────────────────────────────────────────
   HOOKS
   ───────────────────────────────────────────── */

/**
 * Intersection-Observer hook that adds a `.revealed` class
 * once the element scrolls into the viewport.
 */
function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!motionOk) {
      el.classList.add('revealed')
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin])

  return ref
}

/**
 * Animated number counter that counts up when visible.
 */
function useCountUp(end: number, duration: number = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setValue(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          obs.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, duration])

  return { ref, value }
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
   ───────────────────────────────────────────── */

/** Reusable reveal wrapper */
function Reveal({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
  const ref = useScrollReveal()
  const dirClass: Record<string, string> = {
    up: 'reveal-up',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }

  return (
    <div
      ref={ref}
      className={`reveal-base ${dirClass[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/** Animated stat card */
function StatCard({ end, suffix = '', label }: StatCardProps) {
  const { ref, value } = useCountUp(end)
  return (
    <div
      ref={ref}
      className="p-5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-300"
    >
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
        {value}
        {suffix}
      </p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

/** Live-activity notification row */
function ActivityRow({ icon: Icon, iconColor, title, badge, badgeColor, subtitle }: ActivityRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50/60 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-100/80 dark:border-slate-600/60 hover:scale-[1.015] transition-transform duration-300">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-600 shadow-sm flex items-center justify-center">
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm text-slate-800 dark:text-white truncate">{title}</span>
          <span
            className={`text-[10px] font-bold ${badgeColor} px-2 py-0.5 rounded-full whitespace-nowrap ml-2`}
          >
            {badge}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
      </div>
    </div>
  )
}

/** Step card in "How it Works" */
function StepCard({ icon: Icon, title, desc, index }: StepCardProps) {
  return (
    <Reveal delay={index * 120} className="flex flex-col items-center text-center relative z-10">
      <div className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-blue-900/50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20 group-hover:shadow-xl transition-shadow duration-300 relative">
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
          {index + 1}
        </span>
        <Icon size={24} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">{desc}</p>
    </Reveal>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export default function LandingClient({ user }: LandingClientProps) {
  const heroRef = useScrollReveal({ threshold: 0.05 })

  return (
    <>
      {/*
        ┌──────────────────────────────────────────┐
        │  GLOBAL ANIMATION STYLES (injected once) │
        └──────────────────────────────────────────┘
      */}
      <style jsx global>{`
        /* ── Scroll-Reveal Primitives ────────────────────── */
        .reveal-base {
          opacity: 0;
          will-change: transform, opacity;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-up {
          transform: translateY(36px);
        }
        .reveal-left {
          transform: translateX(-36px);
        }
        .reveal-right {
          transform: translateX(36px);
        }
        .reveal-scale {
          transform: scale(0.92);
        }
        .revealed.reveal-base,
        .revealed .reveal-base {
          opacity: 1;
          transform: translate(0) scale(1);
        }
        /* Stagger children inside a .stagger container */
        .stagger .reveal-base {
          transition-delay: calc(var(--i, 0) * 100ms);
        }

        /* ── Floating Orbs ───────────────────────────────── */
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 15px) scale(0.97);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-25px, -30px) scale(1.08);
          }
        }
        .orb {
          animation: float-slow 12s ease-in-out infinite;
        }
        .orb-alt {
          animation: float-medium 15s ease-in-out infinite;
        }

        /* ── Gradient Text Shimmer ───────────────────────── */
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .gradient-shimmer {
          background-size: 200% 200%;
          animation: shimmer 4s ease-in-out infinite;
        }

        /* ── Pulse Ring ──────────────────────────────────── */
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 2px solid currentColor;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* ── Step Connector Animation ────────────────────── */
        @keyframes draw-line {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .step-connector.revealed {
          animation: draw-line 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ── Reduced Motion ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .reveal-base,
          .orb,
          .orb-alt,
          .gradient-shimmer {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 overflow-x-hidden antialiased">
        <Navbar user={user} />

        {/* ════════════════════════════════════════════════
            HERO SECTION
            ════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="reveal-base reveal-up relative pt-32 pb-20 lg:pt-44 lg:pb-36 px-6 overflow-hidden"
        >
          {/* ── Floating Gradient Orbs ── */}
          <div className="absolute top-[-5%] left-[10%] w-[420px] h-[420px] rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-[100px] orb pointer-events-none -z-10" />
          <div className="absolute top-[20%] right-[5%] w-[320px] h-[320px] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-[90px] orb-alt pointer-events-none -z-10" />
          <div className="absolute bottom-[0%] left-[40%] w-[280px] h-[280px] rounded-full bg-violet-400/10 dark:bg-violet-500/8 blur-[80px] orb pointer-events-none -z-10" />
          {/* ── Subtle Grid Overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none -z-10 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-blue-200/50 dark:border-blue-700/40 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-10 shadow-lg shadow-blue-100/30 dark:shadow-blue-900/20">
              <span className="relative flex h-2.5 w-2.5 pulse-ring text-blue-400">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              Now supporting WhatsApp &amp; Instagram
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-extrabold tracking-tight mb-7 leading-[1.08] text-slate-900 dark:text-white">
              Turn your DMs into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 gradient-shimmer">
                Orders on Autopilot.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Stop replying manually to &quot;Price?&quot; and &quot;Available?&quot;.{' '}
              <br className="hidden sm:block" />
              CopIt handles orders, payments, and shipping automatically—so you can focus on
              growing your brand.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 dark:shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-500/30 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 flex items-center justify-center gap-2.5"
                >
                  <LayoutDashboard
                    size={20}
                    className="group-hover:rotate-6 transition-transform duration-300"
                  />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 flex items-center justify-center gap-2.5"
                >
                  Get Started for Free
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              )}
              <Link
                href="/workflow"
                className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Workflow
              </Link>
            </div>

            {/* Social proof strip */}
            <Reveal delay={300} className="mt-20 pt-8 border-t border-slate-200/40 dark:border-slate-800/40">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-7">
                Powering Modern Indian Brands
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2.5 font-bold text-lg text-slate-700 dark:text-slate-300">
                  <ShieldCheck size={22} className="text-green-500" /> Razorpay Secure
                </div>
                <div className="flex items-center gap-2.5 font-bold text-lg text-slate-700 dark:text-slate-300">
                  <Truck size={22} className="text-purple-500" /> Shiprocket
                </div>
                <div className="flex items-center gap-2.5 font-bold text-lg text-slate-700 dark:text-slate-300">
                  <MessageCircle size={22} className="text-green-600" /> WhatsApp API
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            PROBLEM / SOLUTION
            ════════════════════════════════════════════════ */}
        <section className="py-28 bg-slate-50/80 dark:bg-slate-900/40 relative overflow-hidden">
          {/* Decorative corner gradients */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-indigo-400/10 dark:bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
              <Reveal direction="left" className="space-y-6">
                <div className="inline-flex p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
                  <Activity size={24} className="text-blue-600" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 dark:text-white leading-tight">
                  You started a business to create,{' '}
                  <br className="hidden lg:block" />
                  <span className="text-slate-400 dark:text-slate-500">
                    not to be a chat operator.
                  </span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Drowning in DMs? Manually copy-pasting tracking numbers? Chasing payments?
                  CopIt acts like your smart manager. It works 24/7, replying to customers and
                  managing orders instantly.
                </p>

                <div className="space-y-5 pt-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Auto-Reconciliation
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        We verify every payment automatically. No fake screenshots.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Instant Logistics
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        AWB created and Pickup scheduled the moment payment is done.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Live Activity Card */}
              <Reveal direction="right" className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-blue-500/15 dark:bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/70 dark:border-slate-700/70 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-black/20">
                  {/* Window Chrome */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      Live Activity
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ActivityRow
                      icon={ShoppingBag}
                      iconColor="text-green-500"
                      title="New Order #2931"
                      badge="PAID"
                      badgeColor="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      subtitle="₹1,499 received via UPI"
                    />
                    <ActivityRow
                      icon={Truck}
                      iconColor="text-blue-500"
                      title="Shipment Booked"
                      badge="AWB: 10293"
                      badgeColor="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      subtitle="Pickup scheduled for tomorrow"
                    />
                    <ActivityRow
                      icon={Sparkles}
                      iconColor="text-purple-500"
                      title="Smart Upsell"
                      badge="+ ₹499"
                      badgeColor="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      subtitle='Customer added "Matching Belt" via bot'
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            MAGIC LINK SECTION
            ════════════════════════════════════════════════ */}
        <section className="py-28 px-6 bg-white dark:bg-slate-950 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-amber-300/10 dark:bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-20">
            <Reveal direction="left" className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-200/60 dark:border-amber-800/60 shadow-sm">
                <MousePointerClick size={14} /> Solves &quot;Wrong Address&quot; Issues
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                No more &quot;Typing Address&quot; errors.
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Typing an address line-by-line in a chat is painful. We send your customer a
                secure{' '}
                <span className="text-slate-900 dark:text-white font-bold">Magic Link</span>.
                They click, fill a clean form (with Pincode check), and confirm. It takes 10
                seconds.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <StatCard end={0} suffix="%" label="Return to Origin (RTO)" />
                <StatCard end={100} suffix="%" label="Correct Pincodes" />
              </div>
            </Reveal>

            <Reveal direction="right" className="flex-1 relative w-full">
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-[2rem] shadow-2xl shadow-slate-200/40 dark:shadow-black/20 rotate-1 hover:rotate-0 transition-transform duration-500 group max-w-md mx-auto">
                {/* Browser bar */}
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex-1 text-center text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 py-2.5 rounded-lg mx-6">
                    copit.in/secure-checkout/8f92a...
                  </div>
                </div>
                {/* Form skeleton */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div
                      className="h-12 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
                      style={{ animationDelay: '0ms', animationDuration: '2s' }}
                    />
                    <div
                      className="h-12 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
                      style={{ animationDelay: '300ms', animationDuration: '2s' }}
                    />
                  </div>
                  <div
                    className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
                    style={{ animationDelay: '600ms', animationDuration: '2s' }}
                  />
                  <div className="h-14 w-full bg-blue-600 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center text-white font-bold text-sm mt-4 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] transition-all cursor-pointer">
                    Confirm &amp; Return to WhatsApp
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce">
                  <MousePointerClick size={16} /> Customer Clicks
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            BENTO GRID — FEATURES
            ════════════════════════════════════════════════ */}
        <section
          id="features"
          className="py-28 bg-slate-50/80 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-400/8 dark:bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <Reveal className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-block px-4 py-1.5 mb-5 text-xs font-bold tracking-[0.15em] text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-full uppercase border border-indigo-100/60 dark:border-indigo-800/40">
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Run your business on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                  Autopilot.
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Everything you need to run a professional e-commerce brand, without the
                complexity.
              </p>
            </Reveal>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ── Feature 1: Revenue Guard (2-col) ── */}
              <Reveal
                delay={0}
                className="md:col-span-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-2xl hover:shadow-purple-100/30 dark:hover:shadow-purple-900/10 transition-all duration-500 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/8 blur-[70px] rounded-full pointer-events-none group-hover:bg-purple-500/15 transition-all duration-700" />

                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                      Revenue Guard.
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                      Payment Gateway down? No problem. CopIt automatically switches to a{' '}
                      <span className="text-slate-900 dark:text-white font-bold">
                        &quot;Scan &amp; Upload&quot;
                      </span>{' '}
                      mode. Your customer can still pay via UPI instantly.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-2 flex-wrap">
                    <div className="px-3.5 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-xs font-bold rounded-lg border border-purple-100/60 dark:border-purple-800/40">
                      100% Uptime
                    </div>
                    <div className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">
                      Zero Revenue Loss
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ── Feature 2: Smart Upsells ── */}
              <Reveal
                delay={100}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-2xl hover:shadow-teal-100/30 dark:hover:shadow-teal-900/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
              >
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Smart Upsells
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  The bot waits exactly 5 seconds after an order to pitch a discount:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100/80 dark:border-slate-700/60">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Bot:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    &quot;Wait! Want to add matching socks for just ₹199?&quot;
                  </p>
                </div>
              </Reveal>

              {/* ── Feature 3: Cart Recovery ── */}
              <Reveal
                delay={200}
                className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 dark:hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Cart Recovery
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  If a customer stops replying, we nudge them after 30 mins with a small
                  discount code.
                  <span className="block mt-2 font-bold text-blue-600">
                    Recovers ~15% of lost sales.
                  </span>
                </p>
              </Reveal>

              {/* ── Feature 4: Reputation Firewall (2-col) ── */}
              <Reveal
                delay={300}
                className="md:col-span-2 bg-white dark:bg-slate-800/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-2xl hover:shadow-amber-100/30 dark:hover:shadow-amber-900/10 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                      <Star size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                      Reputation Firewall
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">
                      We ask for reviews automatically. Good ones go public. Bad ones come to
                      you first, so you can fix the issue privately.
                    </p>
                  </div>
                  <div className="space-y-3 min-w-[240px]">
                    <div className="flex items-center gap-3 p-3.5 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100/80 dark:border-green-900/20 hover:scale-[1.02] transition-transform duration-300">
                      <span className="text-green-500 font-bold text-sm">★★★★★</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100/80 dark:border-amber-900/20 opacity-70 hover:opacity-100 hover:scale-[1.02] transition-all duration-300">
                      <span className="text-amber-500 font-bold text-sm">★☆☆☆☆</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                        Alert Admin
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            HOW IT WORKS
            ════════════════════════════════════════════════ */}
        <section className="py-28 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 dark:bg-blue-500/3 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 mb-5 text-xs font-bold tracking-[0.15em] text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-full uppercase border border-blue-100/60 dark:border-blue-800/40">
                Simple Setup
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                How it Works
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-4 gap-8 lg:gap-12 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 dark:from-blue-900/40 dark:via-indigo-800/40 dark:to-blue-900/40 z-0" />

              {(
                [
                  { title: 'Trigger', desc: "User DMs you 'Buy' or clicks link", icon: Zap },
                  { title: 'Capture', desc: 'They fill address in secure form', icon: Lock },
                  { title: 'Verify', desc: 'We confirm payment automatically', icon: CreditCard },
                  { title: 'Ship', desc: 'AWB Generated instantly', icon: Truck },
                ] as const
              ).map((step, i) => (
                <StepCard key={step.title} icon={step.icon} title={step.title} desc={step.desc} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            FINAL CTA
            ════════════════════════════════════════════════ */}
        <section className="py-24 px-6">
          <Reveal direction="scale">
            <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-200/60 dark:shadow-blue-900/40">
              {/* Layered gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-800" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full pointer-events-none" />
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zm39 0h1v40h-1zM0 0h40v1H0zm0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 p-12 md:p-20 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                  Ready to automate your business?
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                  Join hundreds of Indian brands running on autopilot. Save time, reduce
                  errors, and sleep better.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className="group px-10 py-5 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-[1.03] active:scale-[0.99] transition-all duration-300"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/demo"
                    className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/25 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    Watch Demo
                  </Link>
                </div>
                <p className="mt-8 text-xs font-bold text-blue-200/80 uppercase tracking-[0.2em]">
                  Easy Setup • No Credit Card Required
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>
    </>
  )
}

