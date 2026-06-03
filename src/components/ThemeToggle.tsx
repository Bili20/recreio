import IconButton from './IconButton'
import { IconLua, IconSol } from './icons'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <IconButton
      data-theme-toggle
      onClick={toggle}
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {dark ? <IconSol /> : <IconLua />}
    </IconButton>
  )
}
