import type { ReactNode } from 'react'

export type Tom = 'vitoria' | 'derrota'

export const BoardStatus = ({ tom, children }: { tom?: Tom; children: ReactNode }) => (
  <div className="board-status">
    <span className={`dot${tom ? ` ${tom}` : ''}`} aria-hidden />
    {children}
  </div>
)

// `tom` colore o ponto do status conforme o desfecho (vitória / derrota).
export default function BoardArea({ status, tom, children }: { status: ReactNode; tom?: Tom; children: ReactNode }) {
  return (
    <div className="board-area">
      <BoardStatus tom={tom}>{status}</BoardStatus>
      {children}
    </div>
  )
}
