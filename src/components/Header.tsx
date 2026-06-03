import { Link, useNavigate } from 'react-router-dom'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import AccentPicker from './AccentPicker'
import IconButton from './IconButton'
import { IconVoltar } from './icons'

interface HeaderProps {
  variant: 'hub' | 'game'
  title?: string // usado na variante game
}

export default function Header({ variant, title }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="topbar">
      <div className="wrap">
        {variant === 'hub' ? (
          <>
            <Brand />
            <span className="topbar-spacer" />
            <AccentPicker />
            <Link to="/placar" className="hide-mobile" style={{ color: 'var(--muted)' }}>Placar global</Link>
            <ThemeToggle />
          </>
        ) : (
          <>
            <IconButton aria-label="Voltar" onClick={() => navigate('/')}><IconVoltar /></IconButton>
            <h1 className="topbar-title">{title}</h1>
            <AccentPicker />
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  )
}
