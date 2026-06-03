import type { ReactNode } from 'react'

export const BoardStatus = ({ children }: { children: ReactNode }) => (
  <div className="board-status"><span className="dot" aria-hidden />{children}</div>
)

export default function BoardArea({ status, children }: { status: ReactNode; children: ReactNode }) {
  return (
    <div className="board-area">
      <BoardStatus>{status}</BoardStatus>
      {children}
    </div>
  )
}
