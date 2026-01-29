


import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // 👈 1. Import the Font
import './globals.css'
import { Toaster } from 'sonner'
 import ThemeProvider from "./components/theme-provider";


// 2. Configure the Font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CopIt | The OS for Instagram Sellers',
  description: 'Automate your Instagram DM sales with WhatsApp and AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}> {/* 👈 3. Apply it here */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}


