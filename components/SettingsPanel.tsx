'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IconSettings, IconSun, IconMoon, IconDeviceDesktop, IconMinus, IconPlus,
} from '@tabler/icons-react'
import { useSettings } from './SettingsContext'
import {
  FONT_SIZE_MAX, FONT_SIZE_MIN, BRIGHTNESS_MIN, BRIGHTNESS_MAX, FONT_STACKS,
  type ReaderFontFamily, type ReaderTheme, type AnnotationMode, type LanguageMode,
} from '@/lib/settings'

const THEME_OPTIONS: { value: ReaderTheme; label: string; icon: typeof IconSun }[] = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'system', label: 'Auto', icon: IconDeviceDesktop },
]

const FONT_OPTIONS: { value: ReaderFontFamily; label: string }[] = [
  { value: 'mono', label: 'Mono' },
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
]

const ANNOTATION_MODE_OPTIONS: { value: AnnotationMode; label: string }[] = [
  { value: 'annotate', label: 'Annotate' },
  { value: 'reveal', label: 'Reveal' },
]

const LANGUAGE_MODE_OPTIONS: { value: LanguageMode; label: string }[] = [
  { value: 'de', label: 'DE' },
  { value: 'en', label: 'EN' },
  { value: 'both', label: 'Both' },
]

function SegmentedButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-colors text-[0.6875rem] font-medium ${
        active
          ? 'bg-neutral-600 border-neutral-500 text-neutral-100'
          : 'border-transparent text-neutral-400 hover:bg-neutral-600/50 hover:text-neutral-200'
      }`}
    >
      {children}
    </button>
  )
}

type Props = {
  showAnnotationToggle?: boolean
  showLanguageMode?: boolean
}

export function SettingsPanel({ showAnnotationToggle = false, showLanguageMode = false }: Props) {
  const {
    theme, fontSize, fontFamily, brightness, annotationMode, languageMode,
    setTheme, setFontSize, setFontFamily, setBrightness, setAnnotationMode, setLanguageMode,
  } = useSettings()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const computePos = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const panelWidth = 260
    const pad = 12
    let left = rect.right - panelWidth
    if (left < pad) left = pad
    if (left + panelWidth > window.innerWidth - pad) left = window.innerWidth - panelWidth - pad
    setPos({ top: rect.bottom + 8, left })
  }, [])

  const handleToggle = useCallback(() => {
    if (!open) computePos()
    setOpen((o) => !o)
  }, [open, computePos])

  useEffect(() => {
    if (!open) return
    const onResize = () => computePos()
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, computePos])

  const panel = mounted && open ? createPortal(
    <div
      ref={panelRef}
      className="fixed z-[200] w-[260px] rounded-xl border border-neutral-600 bg-neutral-800 p-3.5"
      style={{ top: pos.top, left: pos.left, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      {showLanguageMode && (
        <>
          <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-2">Language</div>
          <div className="flex gap-1.5 mb-4">
            {LANGUAGE_MODE_OPTIONS.map(({ value, label }) => (
              <SegmentedButton key={value} active={languageMode === value} onClick={() => setLanguageMode(value)}>
                {label}
              </SegmentedButton>
            ))}
          </div>
        </>
      )}

      {showAnnotationToggle && (
        <>
          <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-2">Word Display</div>
          <div className="flex gap-1.5 mb-4">
            {ANNOTATION_MODE_OPTIONS.map(({ value, label }) => (
              <SegmentedButton key={value} active={annotationMode === value} onClick={() => setAnnotationMode(value)}>
                {label}
              </SegmentedButton>
            ))}
          </div>
        </>
      )}

      <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-2">Theme</div>
      <div className="flex gap-1.5 mb-4">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <SegmentedButton key={value} active={theme === value} onClick={() => setTheme(value)}>
            <Icon size={15} />
            {label}
          </SegmentedButton>
        ))}
      </div>

      <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-2">Font Size</div>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFontSize(Math.max(FONT_SIZE_MIN, fontSize - 1))}
          disabled={fontSize <= FONT_SIZE_MIN}
          aria-label="Decrease font size"
          className="p-2 rounded-lg border border-neutral-600 text-neutral-200 hover:bg-neutral-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <IconMinus size={14} />
        </button>
        <div className="flex-1 text-center text-xs text-neutral-200 tabular-nums">{fontSize}px</div>
        <button
          type="button"
          onClick={() => setFontSize(Math.min(FONT_SIZE_MAX, fontSize + 1))}
          disabled={fontSize >= FONT_SIZE_MAX}
          aria-label="Increase font size"
          className="p-2 rounded-lg border border-neutral-600 text-neutral-200 hover:bg-neutral-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <IconPlus size={14} />
        </button>
      </div>

      <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-2">Font Style</div>
      <div className="flex gap-1.5 mb-4">
        {FONT_OPTIONS.map(({ value, label }) => (
          <SegmentedButton key={value} active={fontFamily === value} onClick={() => setFontFamily(value)}>
            <span style={{ fontFamily: FONT_STACKS[value] }} className="text-xs">Aa</span>
            {label}
          </SegmentedButton>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400">Brightness</div>
        <div className="text-[0.625rem] text-neutral-400 tabular-nums">{brightness}%</div>
      </div>
      <input
        type="range"
        min={BRIGHTNESS_MIN}
        max={BRIGHTNESS_MAX}
        step={5}
        value={brightness}
        onChange={(e) => setBrightness(Number(e.target.value))}
        className="w-full accent-amber-400"
        aria-label="Brightness"
      />
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label="Reading settings"
        title="Reading settings"
        className={`py-2 px-3 rounded-md transition-colors border ${
          open ? 'bg-neutral-600 border-neutral-500' : 'border-transparent hover:bg-neutral-600 hover:border-neutral-500'
        }`}
      >
        <IconSettings size={16} className="text-neutral-300" />
      </button>
      {panel}
    </>
  )
}
