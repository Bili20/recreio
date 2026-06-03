import type { ReactNode } from 'react'

export default function Pill(
  { tone = 'accent', children }: { tone?: 'accent' | 'muted'; children: ReactNode },
) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}
