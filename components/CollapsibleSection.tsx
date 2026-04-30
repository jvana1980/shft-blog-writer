'use client'

import { useState } from 'react'

interface Props {
  step?: number
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function CollapsibleSection({ step, label, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 mt-8 mb-4 w-full group text-left"
      >
        {step != null && (
          <div className="w-6 h-6 rounded-full bg-[#D48B00]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-[#D48B00]">{step}</span>
          </div>
        )}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
        <svg
          className={`w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-transform flex-shrink-0 ${open ? '' : '-rotate-90'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && <div>{children}</div>}
    </div>
  )
}
