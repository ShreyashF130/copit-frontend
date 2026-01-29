'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes" 
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check local storage or system preference on mount
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)
    if (isDarkMode) document.documentElement.classList.add('dark')
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondbg transition-colors border border-border"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-foreground" />}
    </button>
  )
}