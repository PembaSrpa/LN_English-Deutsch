'use client'
import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { IconArrowLeft, IconArrowRight, IconLoader2 } from '@tabler/icons-react'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type Props = { novelTitle: string; novelId: string; pdfPath: string; totalPages: number }

export function PdfViewer({ novelTitle, novelId, pdfPath, totalPages }: Props) {
  const [page, setPage] = useState(1)
  const [numPages, setNumPages] = useState(totalPages)
  const [width, setWidth] = useState(600)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      setWidth(Math.min(w - 64, 700))
    })
    ro.observe(node)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-neutral-200 dark:bg-neutral-900">
      <header className="sticky top-0 z-40 bg-neutral-200/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-2">
          <Link href={`/${novelId}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            <IconArrowLeft size={14} />
            <span className="truncate max-w-[140px]">{novelTitle}</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main ref={containerRef} className="flex-1 flex flex-col items-center px-8 py-6">
        <Document
          file={pdfPath}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={
            <div className="flex items-center gap-2 text-xs text-neutral-400 py-20">
              <IconLoader2 size={16} className="animate-spin" /> Loading...
            </div>
          }
        >
          <Page
            pageNumber={page}
            width={width}
            renderAnnotationLayer
            renderTextLayer
            className="rounded-xl overflow-hidden shadow-section"
          />
        </Document>
      </main>

      <nav className="sticky bottom-0 z-40 bg-neutral-200/90 dark:bg-neutral-900/90 backdrop-blur border-t border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IconArrowLeft size={13} /> Prev
          </button>
          <span className="text-[11px] text-neutral-400 tabular-nums">{page} / {numPages}</span>
          <button
            onClick={() => setPage(p => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <IconArrowRight size={13} />
          </button>
        </div>
      </nav>
    </div>
  )
}
