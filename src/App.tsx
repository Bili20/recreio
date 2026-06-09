import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hub from './pages/Hub'
import Placar from './pages/Placar'
import JogoDaVelha from './games/velha/JogoDaVelha'
import Jokenpo from './games/jokenpo/Jokenpo'
import Memoria from './games/memoria/Memoria'
import Jogo2048 from './games/g2048/Jogo2048'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/placar" element={<Placar />} />
        <Route path="/velha" element={<JogoDaVelha />} />
        <Route path="/jokenpo" element={<Jokenpo />} />
        <Route path="/memoria" element={<Memoria />} />
        <Route path="/2048" element={<Jogo2048 />} />
      </Routes>
    </Layout>
  )
}
