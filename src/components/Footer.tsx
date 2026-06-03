import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>Recreio — joguinhos leves, sem cadastro.</span>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/placar">Placar</Link>
        </nav>
      </div>
    </footer>
  )
}
