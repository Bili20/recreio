import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'soft'

export default function Button(
  { variant = 'primary', sm = false, children, className = '', ...rest }:
  { variant?: Variant; sm?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const cls = `btn btn-${variant}${sm ? ' btn-sm' : ''} ${className}`.trim()
  return <button type="button" className={cls} {...rest}>{children}</button>
}
