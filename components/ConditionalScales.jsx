'use client'
import { usePathname } from 'next/navigation'
import { Scales } from './Scales'

export function ConditionalScales() {
  const pathname = usePathname()
  const hide = pathname !== '/technical/' && pathname !== '/technical' && pathname?.startsWith('/technical')
  if (hide) return null
  return <Scales />
}