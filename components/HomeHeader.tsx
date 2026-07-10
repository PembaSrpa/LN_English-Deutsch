'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { IconBookmarkFilled } from '@tabler/icons-react'

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
      <div className="flex items-center justify-between px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-3">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <a href="https://artt-folio.vercel.app/" rel="noopener noreferrer" className="text-sm font-bold text-neutral-100 tracking-tight hover:text-white transition-colors">
            Arttfolio
          </a>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Link href="/vocab" className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium hover:text-white transition-colors">
            <IconBookmarkFilled size={14} />
            Saved Words
          </Link>
        </motion.div>
      </div>
    </header>
  )
}