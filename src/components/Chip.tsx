import type { ReactNode } from 'react'

export default function Chip(
  { active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode },
) {
  return (
    <button type="button" className="chip" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
