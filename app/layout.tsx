import type { Metadata } from 'next'
import { Lora, Crimson_Pro } from 'next/font/google'
import './globals.css'
import { Scales } from '@/components/Scales'

const body = Lora({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Schatten Lesen',
  description: 'Read light novels. Learn German.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
        <Scales />
        <div className="px-5">{children}</div>
      </body>
    </html>
  )
}
