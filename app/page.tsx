'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import './landing.css' // <-- Changed to the isolated file
import Footer from './Footer.tsx/page'
import Navbar from './components/Navbar'

type Theme = 'light' | 'dark'

const TICKER_ITEMS = [
  'WhatsApp Orders Automated',
  'Razorpay Auto-Reconciliation',
  'Shiprocket AWB in Seconds',
  '0% RTO with Magic Link',
  'Instagram DM Commerce',
  'Smart Upsell Engine',
]

const ACTIVITY_ROWS = [
  {
    icon: '🛍️',
    title: 'New Order #2931',
    pill: 'PAID',
    pillClass: 'pill-green',
    sub: '₹1,499 received via UPI · just now',
  },
  {
    icon: '🚚',
    title: 'Shipment Booked',
    pill: 'AWB: 10293',
    pillClass: 'pill-blue',
    sub: 'Pickup scheduled for tomorrow',
  },
  {
    icon: '✨',
    title: 'Smart Upsell',
    pill: '+ ₹499',
    pillClass: 'pill-purple',
    sub: 'Customer added "Matching Belt" via bot',
  },
]

const TRUST_ITEMS = [
  { icon: '🛡️', label: 'Razorpay Secure', bg: '#f0fdf4' },
  { icon: '🚚', label: 'Shiprocket',       bg: '#faf5ff' },
  { icon: '💬', label: 'WhatsApp API',     bg: '#f0fdf4' },
]

const STEPS = [
  { icon: '⚡', title: 'Trigger', desc: 'User DMs "Buy" or clicks a product link' },
  { icon: '🔗', title: 'Capture', desc: 'They fill their address via secure Magic Link' },
  { icon: '✅', title: 'Verify',  desc: 'Payment auto-confirmed via Razorpay webhook' },
  { icon: '📦', title: 'Ship',    desc: 'AWB generated & pickup booked instantly' },
]

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('copit-theme') as Theme | null
    const preferred = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(preferred)
    setTheme(preferred)
  }, [])

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t)
  }

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
    localStorage.setItem('copit-theme', next)
  }, [theme])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS] 

  return (
    <main className="copit-wrapper"> 
      <Navbar/>
      <div className="ticker-wrap" aria-hidden>
        <div className="ticker">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="dot-accent">●</span> {item}
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="hero-grid" aria-hidden />
        <div className="hero-content">
          <div className="badge" role="status">
            <span className="badge-dot" aria-hidden />
            Now supporting WhatsApp &amp; Instagram
          </div>
          <h1>
            Turn your DMs into<br />
            <span className="gradient-text">Orders on Autopilot.</span>
          </h1>
          <p className="hero-sub">
            Stop replying manually to &quot;Price?&quot; and &quot;Available?&quot;.<br />
            CopIt handles orders, payments, and shipping automatically—so you focus on growing your brand.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="btn-primary">
              Get Started for Free <ArrowRight />
            </Link>
            <Link href="/workflow" className="btn-secondary">
              <PlayIcon /> Watch Demo
            </Link>
          </div>
          <div className="trust-strip">
            <p className="trust-label">Trusted Integrations</p>
            <div className="trust-logos">
              {TRUST_ITEMS.map((t) => (
                <div key={t.label} className="trust-item">
                  <div className="trust-icon" style={{ background: t.bg }}>{t.icon}</div>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-card-wrapper">
          <div className="live-card">
            <div className="live-card-header">
              <div className="mac-dots" aria-hidden>
                <div className="mac-dot" style={{ background: '#FF5F57' }} />
                <div className="mac-dot" style={{ background: '#FEBC2E' }} />
                <div className="mac-dot" style={{ background: '#28C840' }} />
              </div>
              <span className="live-tag">Live Activity</span>
            </div>
            {ACTIVITY_ROWS.map((row, i) => (
              <div key={i} className="activity-row">
                <div className="activity-icon" aria-hidden>{row.icon}</div>
                <div className="activity-info">
                  <div className="activity-title">
                    <span>{row.title}</span>
                    <span className={`pill ${row.pillClass}`}>{row.pill}</span>
                  </div>
                  <div className="activity-sub">{row.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="section-inner">
          <div className="two-col">
            <div className="reveal">
              <span className="section-label">The Problem</span>
              <h2>
                You started a brand to create,<br />
                <span className="muted">not to be a chat operator.</span>
              </h2>
              <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem' }}>
                Drowning in DMs? Manually copy-pasting tracking numbers? Chasing payments?
                CopIt acts like your smart business manager—working 24/7, so you never miss an order.
              </p>
              <ul className="check-list">
                <li className="check-item">
                  <div className="check-icon green" aria-hidden>✅</div>
                  <div className="check-body">
                    <h4>Auto-Reconciliation</h4>
                    <p>Every payment verified automatically. No fake screenshots, ever.</p>
                  </div>
                </li>
                <li className="check-item">
                  <div className="check-icon blue" aria-hidden>🚚</div>
                  <div className="check-body">
                    <h4>Instant Logistics</h4>
                    <p>AWB created and pickup scheduled the moment payment clears.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="reveal reveal-d2">
              <div className="dm-card">
                <div className="dm-bubble customer">
                  <div className="dm-avatar customer" aria-hidden>👤</div>
                  <div>
                    <div className="dm-sender">Customer DM</div>
                    <div className="dm-text">&quot;Price? Is this available?&quot;</div>
                  </div>
                </div>
                <div className="dm-bubble bot">
                  <div className="dm-avatar bot" aria-hidden>🤖</div>
                  <div>
                    <div className="dm-sender" style={{ color: 'var(--brand-blue)' }}>CopIt Bot (instant)</div>
                    <div className="dm-text" style={{ color: 'var(--brand-blue)' }}>
                      &quot;Hi! It&apos;s ₹1,499 ✅ Click to order → copit.in/buy/abc&quot;
                    </div>
                  </div>
                </div>
                <div className="dm-stats">
                  {[
                    { val: '2.3s', label: 'Response time' },
                    { val: '24/7', label: 'Always online' },
                  ].map((s) => (
                    <div key={s.label} className="dm-stat">
                      <div className="dm-stat-val">{s.val}</div>
                      <div className="dm-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="two-col">
            <div className="reveal">
              <span className="section-label" style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FED7AA' }}>
                Solves &quot;Wrong Address&quot; Issues
              </span>
              <h2>No more<br />&quot;Typing Address&quot; errors.</h2>
              <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '1rem' }}>
                Typing an address line-by-line in chat is painful. We send your customer a secure{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Magic Link</strong>. They click,
                fill a clean form with pincode validation, and confirm in 10 seconds flat.
              </p>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-num">0%</div>
                  <div className="stat-label">Return to Origin (RTO)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Correct Pincodes</div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-d2" style={{ position: 'relative' }}>
              <div className="magic-mockup">
                <div className="url-bar">copit.in/secure-checkout/8f92a...</div>
                <div className="mock-form-row">
                  <div className="mock-field" />
                  <div className="mock-field" style={{ width: '80px' }} />
                </div>
                <div className="mock-field-full" />
                <div className="mock-field-full" style={{ height: '36px', width: '120px' }} />
                <div className="mock-submit">
                  Confirm &amp; Return to WhatsApp ↗
                </div>
                <div className="bounce-badge" aria-hidden>
                  👆 Customer Clicks
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section bg-soft" style={{ borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label" style={{ background: '#EEF2FF', color: 'var(--brand-indigo)', borderColor: '#C7D2FE' }}>
              Powerful Features
            </span>
            <h2 style={{ marginTop: '0.75rem' }}>
              Run your business <span style={{ color: 'var(--brand-indigo)' }}>on Autopilot.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.0625rem', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.7 }}>
              Everything you need to run a professional D2C brand, without the complexity.
            </p>
          </div>
          <div className="bento-grid reveal">
            <div className="bento-card bento-wide">
              <div className="bento-icon purple" aria-hidden>🛡️</div>
              <h3>Revenue Guard.</h3>
              <p>
                Payment gateway down? No problem. CopIt automatically switches to a{' '}
                <strong>&quot;Scan &amp; Upload&quot;</strong> fallback mode. Your customer can
                still pay via UPI instantly—you never lose a sale.
              </p>
              <div className="tag-row">
                <span className="tag purple">100% Uptime</span>
                <span className="tag slate">Zero Revenue Loss</span>
              </div>
            </div>
            <div className="bento-card">
              <div className="bento-icon teal" aria-hidden>📈</div>
              <h3>Smart Upsells</h3>
              <p>The bot waits 5 seconds after an order to pitch a personalized add-on.</p>
              <div className="chat-bubble">
                <div className="chat-label">Bot says</div>
                <div className="chat-text">&quot;Wait! Add matching socks for just ₹199?&quot;</div>
              </div>
            </div>
            <div className="bento-card">
              <div className="bento-icon blue" aria-hidden>💬</div>
              <h3>Cart Recovery</h3>
              <p>
                Customer stopped replying? We nudge them after 30 mins with a small discount code.
              </p>
              <div className="tag-row">
                <span className="tag blue">~15% more revenue</span>
              </div>
            </div>
            <div className="bento-card bento-wide">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div className="bento-icon amber" style={{ marginBottom: '1.25rem' }} aria-hidden>⭐</div>
                  <h3>Reputation Firewall</h3>
                  <p>
                    We request reviews automatically. Good ones go public. Bad ones come to{' '}
                    <strong>you first</strong>, so you can fix the issue privately.
                  </p>
                </div>
                <div className="review-rows">
                  <div className="review-row good">
                    <span className="review-stars" aria-label="5 stars">★★★★★</span>
                    <span className="review-arrow" aria-hidden>→</span>
                    <span>Published ✓</span>
                  </div>
                  <div className="review-row bad">
                    <span className="review-stars" aria-label="1 star">★☆☆☆☆</span>
                    <span className="review-arrow" aria-hidden>→</span>
                    <span>Alert Admin ⚠</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2>How it Works</h2>
          </div>
          <div className="steps-row reveal">
            <div className="steps-line" aria-hidden />
            {STEPS.map((s) => (
              <div key={s.title} className="step">
                <div className="step-num" aria-hidden>{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-box reveal">
          <h2>Ready to automate<br />your business?</h2>
          <p>
            Join hundreds of Indian brands running on autopilot. Save time, reduce errors, and sleep better.
          </p>
          <div className="cta-btns">
            <Link href="/login" className="btn-white">Start Free Trial</Link>
            <Link href="/demo" className="btn-outline-white">Watch Demo</Link>
          </div>
          <p className="cta-fine">Easy Setup · No Credit Card Required</p>
        </div>
      </div>
 <Footer/>
      <footer className="cop-footer">
        <p>© 2025 CopIt · Made for Indian D2C brands · Built with ❤️ in India</p>
       
      </footer>
    </main>
  )
}