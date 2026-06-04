import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Scales } from '@/components/Scales'
import { Analytics } from "@vercel/analytics/next";

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Schatten Lesen',
  description: 'Read light novels. Learn German.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body className="bg-neutral-100 dark:bg-neutral-800 font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="max-w-3xl mx-auto min-h-screen relative bg-neutral-300 dark:bg-neutral-600">
            <Scales />
            <Analytics />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
