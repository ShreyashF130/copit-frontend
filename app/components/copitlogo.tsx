type CopItLogoProps = {
  className?: string
}

export default function CopItLogo({ className }: CopItLogoProps) {
  return (
    <svg
      viewBox="0 0 512 128"
      xmlns="Cop"
      className={className}
      fill="currentColor"
    >
      {/* ICON */}
      <path d="M..." />

      {/* COP */}
      <path d="M..." />

      {/* IT */}
      <path
        d="M..."
        className="text-slate-900 dark:text-white"
      />
    </svg>
  )
}
