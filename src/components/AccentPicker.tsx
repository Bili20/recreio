import { useAccent, ACCENTS } from '../hooks/useAccent'

// Cada bolinha mostra a própria cor do acento via inline style usando o token.
const COR: Record<string, string> = {
  indigo: 'oklch(0.55 0.16 270)',
  teal: 'oklch(0.62 0.105 192)',
  orange: 'oklch(0.66 0.15 52)',
  rose: 'oklch(0.62 0.16 12)',
}

export default function AccentPicker() {
  const { accent, setAccent } = useAccent()
  return (
    <div className="accent-picker hide-mobile" role="group" aria-label="Cor de destaque">
      {ACCENTS.map(({ id, nome }) => (
        <button
          key={id}
          className="accent-dot"
          style={{ background: COR[id] }}
          aria-label={nome}
          aria-pressed={accent === id}
          onClick={() => setAccent(id)}
        />
      ))}
    </div>
  )
}
