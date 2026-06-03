import type { JSX } from 'react'

// 18 formas geométricas distintas (suficiente p/ 6×6). Traço em currentColor.
const FORMAS: JSX.Element[] = [
  <circle cx="12" cy="12" r="7" />,
  <rect x="5" y="5" width="14" height="14" rx="2" />,
  <path d="M12 4 20 12 12 20 4 12Z" />,
  <path d="M12 5 20 19 4 19Z" />,
  <path d="M12 4l2.3 5.2 5.7.5-4.3 3.8 1.3 5.6L12 16l-5 3.1 1.3-5.6L4 9.7l5.7-.5z" />,
  <path d="M8 4h8l4 8-4 8H8l-4-8z" />,
  <path d="M12 5v14M5 12h14" />,
  <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.3A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />,
  <path d="M13 3 5 14h5l-1 7 8-11h-5z" />,
  <path d="M12 4c4 5 6 7 6 10a6 6 0 0 1-12 0c0-3 2-5 6-10z" />,
  <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /></>,
  <path d="M6 6 18 18M18 6 6 18" />,
  <path d="M12 5v14M6 11l6-6 6 6" />,
  <path d="M17 4a8 8 0 1 0 0 16 6.4 6.4 0 0 1 0-16z" />,
  <path d="M12 4l8 6-3 9H7L4 10z" />,
  <path d="M12 4v16M5 7l14 10M19 7 5 17" />,
  <path d="M6 8l6 5 6-5M6 14l6 5 6-5" />,
  <><rect x="5" y="5" width="14" height="14" rx="2" /><circle cx="12" cy="12" r="2.2" /></>,
]

export function Simbolo({ i }: { i: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {FORMAS[i]}
    </svg>
  )
}
