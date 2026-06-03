import type { ReactNode } from 'react'

export default function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="panel">
      {title && <h4>{title}</h4>}
      {children}
    </section>
  )
}

export const StatRow = ({ k, v }: { k: ReactNode; v: ReactNode }) => (
  <div className="stat-row"><span className="k">{k}</span><span className="v">{v}</span></div>
)

export const StatBig = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="stat-big"><small>{label}</small><b>{value}</b></div>
)

export const PanelActions = ({ children }: { children: ReactNode }) => (
  <div className="panel-actions">{children}</div>
)

export const Divider = () => <hr className="divider" />
