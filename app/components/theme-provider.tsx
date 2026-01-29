'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Change to default export
export default function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}