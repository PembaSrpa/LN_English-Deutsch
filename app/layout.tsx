import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Scales } from '@/components/Scales'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Schatten Lesen',
  description: 'Read light novels. Learn German.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body className="bg-neutral-200 dark:bg-neutral-900 font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Scales />
          <div className="max-w-3xl mx-auto min-h-screen relative">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
