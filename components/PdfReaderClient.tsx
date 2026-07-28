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
import { getLastPage, setLastPage } from '@/lib/storage'

type Props = {
  bookId: string
  bookTitle: string
  pdfFile: string
}

const MIN_SCALE = 0.6
const MAX_SCALE = 2.6
const SCALE_STEP = 0.2
const MAX_PAGE_WIDTH = 900

export function PdfReaderClient({ bookId, bookTitle, pdfFile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const docRef = useRef<any>(null)
  const renderTaskRef = useRef<any>(null)

  const [numPages, setNumPages] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const startPage = Math.min(Math.max(getLastPage(bookId), 1), doc.numPages)
        setPageNum(startPage)
        setPageInput(String(startPage))
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

  const renderPage = useCallback(async (num: number, currentScale: number) => {
    const doc = docRef.current
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
  }, [])

  useEffect(() => {
    if (loading || numPages === 0) return
    renderPage(pageNum, scale)
    setLastPage(bookId, pageNum)
    setPageInput(String(pageNum))
    containerRef.current?.scrollTo({ top: 0 })
  }, [pageNum, scale, loading, numPages, renderPage, bookId])

  useEffect(() => {
    function onResize() {
      if (!loading) renderPage(pageNum, scale)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pageNum, scale, loading, renderPage])

  const goPrev = useCallback(() => {
    setPageNum((p) => Math.max(1, p - 1))
  }, [])

  const goNext = useCallback(() => {
    setPageNum((p) => Math.min(numPages || p, p + 1))
  }, [numPages])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  function zoomIn() {
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)))
  }

  function zoomOut() {
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)))
  }

  function submitPageInput() {
    const parsed = parseInt(pageInput, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      setPageNum(parsed)
    } else {
      setPageInput(String(pageNum))
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
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <button onClick={zoomOut} className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 transition-colors">
              <IconZoomOut size={16} />
            </button>
            <button onClick={zoomIn} className="p-1.5 rounded-lg text-neutral-300 hover:bg-neutral-600 transition-colors">
              <IconZoomIn size={16} />
            </button>
          </div>
        </div>
      </header>

      <main ref={containerRef} className="flex-1 overflow-auto flex justify-center px-2 py-4">
        {error && <p className="text-xs text-neutral-400 self-start mx-auto mt-8">{error}</p>}
        {!error && loading && <p className="text-xs text-neutral-400 self-start mx-auto mt-8">Loading…</p>}
        <canvas ref={canvasRef} className="h-fit shadow-lg" />
      </main>

      {!error && !loading && (
        <footer className="sticky bottom-0 z-40 bg-neutral-750 border-t border-neutral-600 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 px-4 py-2">
            <button
              onClick={goPrev}
              disabled={pageNum <= 1}
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
              onClick={goNext}
              disabled={pageNum >= numPages}
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