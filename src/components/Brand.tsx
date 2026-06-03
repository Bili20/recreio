import { Link } from 'react-router-dom'

// `compact` mostra só o selo (usado no cabeçalho de jogo em telas pequenas).
export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="Recreio — início">
      <span className="mark" aria-hidden />
      {!compact && <span>Recreio</span>}
    </Link>
  )
}
