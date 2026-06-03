import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hub from './pages/Hub'
import JogoDaVelha from './games/velha/JogoDaVelha'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/velha" element={<JogoDaVelha />} />
      </Routes>
    </Layout>
  )
}
