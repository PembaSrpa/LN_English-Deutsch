'use client'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react'
import { useSettings } from './SettingsContext'
import {
  getLastPage,
  setLastPage,
  getPdfScrollPosition,
  setPdfScrollPosition,
  type PdfScrollPosition,
} from '@/lib/storage'

type Props = {
  bookId: string
  bookTitle: string
  pdfFile: string
}

type NavHandle = {
  goPrev: () => void
  goNext: () => void
  jump: (page: number) => void
}

const MIN_SCALE = 0.6
const MAX_SCALE = 2.6
const SCALE_STEP = 0.2
const MAX_PAGE_WIDTH = 900

export function PdfReaderClient({ bookId, bookTitle, pdfFile }: Props) {
  const { pdfMode } = useSettings()
  const containerRef = useRef<HTMLDivElement>(null)
  const docRef = useRef<any>(null)
  const navRef = useRef<NavHandle | null>(null)

  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        const doc = await pdfjsLib.getDocument({ url: pdfFile }).promise
        if (cancelled) return
        docRef.current = doc
        setNumPages(doc.numPages)
        setLoading(false)
      } catch {
        if (!cancelled) setError('Could not load this PDF.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [bookId, pdfFile])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    setPageInput(String(page))
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') navRef.current?.goNext()
      if (e.key === 'ArrowLeft') navRef.current?.goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function zoomIn() {
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)))
  }

  function zoomOut() {
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)))
  }

  function submitPageInput() {
    const parsed = parseInt(pageInput, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      navRef.current?.jump(parsed)
    } else {
      setPageInput(String(currentPage))
    }
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      <header className="sticky top-0 z-40 bg-neutral-750 border-b border-neutral-600 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <motion.div
            className="min-w-0 flex-1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/technical"
              title={bookTitle}
              className="flex items-center gap-1.5 min-w-0 text-xs text-neutral-100 font-medium hover:text-[var(--n-emphasis)] transition-colors"
            >
              <IconArrowLeft size={14} className="shrink-0" />
              <span className="truncate">{bookTitle}</span>
            </Link>
          </motion.div>
          {pdfMode !== 'continuous' && (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={zoomOut} className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 transition-colors">
                <IconZoomOut size={16} />
              </button>
              <button onClick={zoomIn} className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 transition-colors">
                <IconZoomIn size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main ref={containerRef} className="flex-1 overflow-auto flex flex-col items-center px-2 py-4">
        {error && <p className="text-xs text-neutral-400 mt-8">{error}</p>}
        {!error && loading && <p className="text-xs text-neutral-400 mt-8">Loading…</p>}
        {!error && !loading && numPages > 0 && (
          pdfMode === 'continuous' ? (
            <ContinuousReader
              doc={docRef.current}
              numPages={numPages}
              bookId={bookId}
              scale={scale}
              containerRef={containerRef}
              onPageChange={handlePageChange}
              navRef={navRef}
            />
          ) : (
            <PaginatedReader
              doc={docRef.current}
              numPages={numPages}
              bookId={bookId}
              scale={scale}
              containerRef={containerRef}
              onPageChange={handlePageChange}
              navRef={navRef}
            />
          )
        )}
      </main>

      {!error && !loading && (
        <footer className="sticky bottom-0 z-40 bg-neutral-750 border-t border-neutral-600 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            <button
              onClick={() => navRef.current?.goPrev()}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <IconChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300">
              <input
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={submitPageInput}
                onKeyDown={(e) => e.key === 'Enter' && submitPageInput()}
                className="w-10 text-center bg-neutral-700 border border-neutral-600 rounded-md py-0.5 text-neutral-100"
              />
              <span>/ {numPages}</span>
            </div>
            <button
              onClick={() => navRef.current?.goNext()}
              disabled={currentPage >= numPages}
              className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <IconChevronRight size={16} />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

type ReaderProps = {
  doc: any
  numPages: number
  bookId: string
  scale: number
  containerRef: React.RefObject<HTMLDivElement | null>
  onPageChange: (page: number) => void
  navRef: React.MutableRefObject<NavHandle | null>
}

function PaginatedReader({ doc, numPages, bookId, scale, containerRef, onPageChange, navRef }: ReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<any>(null)
  const [pageNum, setPageNum] = useState(() => Math.min(Math.max(getLastPage(bookId), 1), numPages))

  const renderPage = useCallback(async (num: number, currentScale: number) => {
    const canvas = canvasRef.current
    if (!doc || !canvas) return

    const page = await doc.getPage(num)
    const baseViewport = page.getViewport({ scale: 1 })
    const containerWidth = containerRef.current?.clientWidth ?? baseViewport.width
    const targetWidth = Math.min(containerWidth - 16, MAX_PAGE_WIDTH)
    const fitScale = (targetWidth / baseViewport.width) * currentScale
    const viewport = page.getViewport({ scale: fitScale })

    const outputScale = window.devicePixelRatio || 1
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
    }

    const task = page.render({
      canvasContext: context,
      viewport,
      transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
    })
    renderTaskRef.current = task

    try {
      await task.promise
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') throw err
    }
  }, [doc, containerRef])

  useEffect(() => {
    renderPage(pageNum, scale)
    setLastPage(bookId, pageNum)
    onPageChange(pageNum)
    containerRef.current?.scrollTo({ top: 0 })
  }, [pageNum, scale, renderPage, bookId, onPageChange, containerRef])

  useEffect(() => {
    function onResize() {
      renderPage(pageNum, scale)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pageNum, scale, renderPage])

  useEffect(() => {
    navRef.current = {
      goPrev: () => setPageNum((p) => Math.max(1, p - 1)),
      goNext: () => setPageNum((p) => Math.min(numPages, p + 1)),
      jump: (n: number) => setPageNum(Math.min(Math.max(n, 1), numPages)),
    }
  }, [numPages, navRef])

  return <canvas ref={canvasRef} className="h-fit shadow-lg" />
}

const GAP = 12
const MAX_RENDERED = 24

function ContinuousReader({ doc, numPages, bookId, scale, containerRef, onPageChange, navRef }: ReaderProps) {
  const [ready, setReady] = useState(false)
  const dimsRef = useRef<{ w: number; h: number }[]>([])
  const offsetsRef = useRef<number[]>([])
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const renderedRef = useRef<Set<number>>(new Set())
  const renderOrderRef = useRef<number[]>([])
  const currentPageRef = useRef(1)
  const initializedRef = useRef(false)

  const computeLayout = useCallback(async () => {
    const containerWidth = containerRef.current?.clientWidth ?? MAX_PAGE_WIDTH
    const targetWidth = Math.min(containerWidth - 16, MAX_PAGE_WIDTH)
    const pages = await Promise.all(
      Array.from({ length: numPages }, (_, i) => doc.getPage(i + 1))
    )
    const dims = pages.map((page) => {
      const base = page.getViewport({ scale: 1 })
      const fitScale = targetWidth / base.width
      return { w: base.width * fitScale, h: base.height * fitScale }
    })
    const offsets: number[] = []
    let acc = 0
    for (const d of dims) {
      offsets.push(acc)
      acc += d.h + GAP
    }
    dimsRef.current = dims
    offsetsRef.current = offsets
  }, [doc, numPages, containerRef])

  const renderSlot = useCallback(async (pageNum: number) => {
    const dims = dimsRef.current[pageNum - 1]
    const canvas = canvasRefs.current[pageNum - 1]
    if (!dims || !canvas) return

    const page = await doc.getPage(pageNum)
    const base = page.getViewport({ scale: 1 })
    const fitScale = dims.w / base.width
    const viewport = page.getViewport({ scale: fitScale })
    const outputScale = window.devicePixelRatio || 1
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    try {
      await page.render({
        canvasContext: context,
        viewport,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
      }).promise
    } catch {
      /* transient render errors from rapid scrolling are expected */
    }
  }, [doc])

  const evictIfNeeded = useCallback(() => {
    while (renderOrderRef.current.length > MAX_RENDERED) {
      const idx = renderOrderRef.current[0]
      if (Math.abs(idx - currentPageRef.current) < 6) break
      renderOrderRef.current.shift()
      renderedRef.current.delete(idx)
      const canvas = canvasRefs.current[idx - 1]
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
      }
    }
  }, [])

  const scrollToPosition = useCallback((pos: PdfScrollPosition) => {
    const el = containerRef.current
    const offsets = offsetsRef.current
    const dims = dimsRef.current
    const idx = Math.min(Math.max(pos.page, 1), numPages) - 1
    const base = offsets[idx] ?? 0
    const h = dims[idx]?.h ?? 0
    el?.scrollTo({ top: base + pos.ratio * h })
  }, [containerRef, numPages])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setReady(false)
      await computeLayout()
      if (cancelled) return
      setReady(true)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [computeLayout])

  useEffect(() => {
    if (!ready) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.page)
          if (entry.isIntersecting && !renderedRef.current.has(idx)) {
            renderedRef.current.add(idx)
            renderOrderRef.current.push(idx)
            renderSlot(idx)
            evictIfNeeded()
          }
        }
      },
      { root: containerRef.current, rootMargin: '800px 0px', threshold: 0.01 }
    )
    slotRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    const pos = initializedRef.current
      ? { page: currentPageRef.current, ratio: 0 }
      : getPdfScrollPosition(bookId)
    scrollToPosition(pos)
    currentPageRef.current = pos.page
    onPageChange(pos.page)
    initializedRef.current = true

    return () => observer.disconnect()
  }, [ready, bookId, onPageChange, renderSlot, evictIfNeeded, scrollToPosition, containerRef])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !ready) return

    let raf = 0
    let saveTimer: ReturnType<typeof setTimeout>

    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrollTop = el!.scrollTop
        const offsets = offsetsRef.current
        const dims = dimsRef.current
        let page = 1
        for (let i = 0; i < offsets.length; i++) {
          if (offsets[i] <= scrollTop + 4) page = i + 1
          else break
        }
        currentPageRef.current = page
        onPageChange(page)
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          const d = dims[page - 1]
          const ratio = d && d.h > 0 ? Math.min(1, Math.max(0, (scrollTop - offsets[page - 1]) / d.h)) : 0
          setPdfScrollPosition(bookId, { page, ratio })
        }, 400)
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(saveTimer)
    }
  }, [ready, bookId, onPageChange, containerRef])

  useEffect(() => {
    navRef.current = {
      goPrev: () => scrollToPosition({ page: Math.max(1, currentPageRef.current - 1), ratio: 0 }),
      goNext: () => scrollToPosition({ page: Math.min(numPages, currentPageRef.current + 1), ratio: 0 }),
      jump: (n: number) => scrollToPosition({ page: Math.min(Math.max(n, 1), numPages), ratio: 0 }),
    }
  }, [numPages, navRef, scrollToPosition])

  return (
    <div className="flex flex-col items-center gap-3 w-full" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      {!ready && <p className="text-xs text-neutral-400 mt-8">Preparing continuous view…</p>}
      {Array.from({ length: numPages }, (_, i) => i + 1).map((num) => {
        const dims = dimsRef.current[num - 1]
        return (
          <div
            key={num}
            data-page={num}
            ref={(el) => {
              slotRefs.current[num - 1] = el
            }}
            className="bg-white shadow-lg"
            style={{ width: dims?.w, height: dims?.h ?? 300 }}
          >
            <canvas
              ref={(el) => {
                canvasRefs.current[num - 1] = el
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
