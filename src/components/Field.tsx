import type { InputHTMLAttributes } from 'react'
import {
  Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export function Input({ label, ...rest }: { label?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <input className="input" {...rest} />
    </label>
  )
}

export interface Opcao { value: string; label: string }

// Wrapper sobre o Select do shadcn, mantendo a API simples (label + opções)
// e o layout `.field` do nosso design system.
export function Select(
  { label, value, onValueChange, options, placeholder }:
  { label?: string; value?: string; onValueChange?: (v: string) => void; options: Opcao[]; placeholder?: string },
) {
  return (
    <div className="field">
      {label && <span>{label}</span>}
      <UISelect value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </UISelect>
    </div>
  )
}
