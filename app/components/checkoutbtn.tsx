export default function CheckoutButton() {
  return (
    <button className="btn-velocity bg-brand-blue text-white px-8 py-4 rounded-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
      <span>COP IT NOW</span>
      <svg 
        width="20" height="20" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        className="animate-pulse"
      >
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  )
}