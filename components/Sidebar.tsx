'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700">
        <span className="text-lg font-bold tracking-tight">SHFT</span>
        <span className="text-slate-400 text-sm block mt-0.5">Blog Writer</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/'
              ? 'bg-slate-700 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        <Link
          href="/clients/new"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === '/clients/new'
              ? 'bg-slate-700 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Phase 1 — Internal</p>
      </div>
    </aside>
  )
}
