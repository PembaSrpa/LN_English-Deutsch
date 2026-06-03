'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IconBrightnessUpFilled, IconMoon } from '@tabler/icons-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="py-2 px-3 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-800 rounded-md transition-colors border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600"
    >
      {isDark
        ? <IconBrightnessUpFilled size={16} className="text-neutral-300" />
        : <IconMoon size={16} className="text-neutral-600" />}
    </button>
  )
}
