import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hub from './pages/Hub'
import Placar from './pages/Placar'
import JogoDaVelha from './games/velha/JogoDaVelha'
import Jokenpo from './games/jokenpo/Jokenpo'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/placar" element={<Placar />} />
        <Route path="/velha" element={<JogoDaVelha />} />
        <Route path="/jokenpo" element={<Jokenpo />} />
      </Routes>
    </Layout>
  )
}
