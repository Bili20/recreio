import type { ButtonHTMLAttributes, ReactNode } from 'react'

export default function IconButton(
  { children, ...rest }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <button type="button" className="icon-btn" {...rest}>{children}</button>
}
