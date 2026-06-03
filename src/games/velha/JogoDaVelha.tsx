import { useEffect, useState } from 'react'
import Panel, { StatRow, PanelActions } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import Pill from '../../components/Pill'
import { useRecords } from '../../hooks/useRecords'
import {
  vencedor, tabuleiroCheio, escolherJogada,
  type Tabuleiro, type Nivel, type Marca,
} from './logic'

type Modo = 'cpu' | 'dois'
const VAZIO: Tabuleiro = Array(9).fill(null)

// Marca SVG para X (traço) e O (círculo), herdando a cor da célula.
const MarcaSVG = ({ m }: { m: Marca }) =>
  m === 'X' ? (
    <svg className="ttt-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19" /></svg>
  ) : (
    <svg className="ttt-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="8" /></svg>
  )

export default function JogoDaVelha() {
  const { records, submit, addPlay } = useRecords()
  const [modo, setModo] = useState<Modo>('cpu')
  const [nivel, setNivel] = useState<Nivel>('medio')
  const [tab, setTab] = useState<Tabuleiro>(VAZIO)
  const [vez, setVez] = useState<Marca>('X') // humano (ou jogador 1) é sempre X
  const [placar, setPlacar] = useState({ voce: 0, cpu: 0, empates: 0 })
  const [streak, setStreak] = useState(0) // sequência de vitórias contra a CPU
  const [registrado, setRegistrado] = useState(false) // evita contar a rodada 2x

  const resultado = vencedor(tab)
  const cheio = tabuleiroCheio(tab)
  const acabou = Boolean(resultado) || cheio

  function aplicar(i: number) {
    setTab((t) => {
      if (t[i] || vencedor(t)) return t
      const copia = [...t]; copia[i] = vez
      return copia
    })
    setVez((v) => (v === 'X' ? 'O' : 'X'))
  }

  // Jogada da CPU quando for a vez do O no modo cpu.
  useEffect(() => {
    if (modo !== 'cpu' || acabou || vez !== 'O') return
    const tempo = setTimeout(() => {
      const i = escolherJogada(tab, 'O', nivel)
      if (i >= 0) aplicar(i)
    }, 380)
    return () => clearTimeout(tempo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vez, modo, acabou])

  // Ao terminar a rodada: atualiza placar, sequência e recorde (uma vez só).
  useEffect(() => {
    if (!acabou || registrado) return
    setRegistrado(true)

    if (resultado) {
      const venceuVoce = resultado.jogador === 'X'
      setPlacar((p) => ({
        ...p,
        voce: p.voce + (venceuVoce ? 1 : 0),
        cpu: p.cpu + (!venceuVoce ? 1 : 0),
      }))
      if (modo === 'cpu') {
        if (venceuVoce) {
          const nova = streak + 1
          setStreak(nova)
          submit('velha', nova) // grava recorde de maior sequência
        } else {
          setStreak(0)
          addPlay('velha')
        }
      }
    } else {
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }))
      if (modo === 'cpu') { setStreak(0); addPlay('velha') }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acabou])

  function jogarHumano(i: number) {
    if (acabou || tab[i]) return
    if (modo === 'cpu' && vez !== 'X') return
    aplicar(i)
  }

  function novaRodada() {
    setTab(VAZIO); setVez('X'); setRegistrado(false)
  }
  function reiniciarPlacar() {
    setPlacar({ voce: 0, cpu: 0, empates: 0 }); setStreak(0); novaRodada()
  }

  // Texto do status acima do tabuleiro.
  const status = resultado
    ? resultado.jogador === 'X' ? 'Você venceu a rodada!' : (modo === 'cpu' ? 'A CPU venceu' : 'O venceu!')
    : cheio ? 'Empate!'
    : modo === 'cpu'
      ? vez === 'X' ? 'Sua vez' : 'Vez da CPU…'
      : `Vez do ${vez}`

  const recorde = records.velha && !Number.isNaN(records.velha.value) ? records.velha.value : 0
  const linhaWin: number[] = resultado?.linha ?? []

  return (
    <div className="game-layout">
      {/* Painéis esquerdos */}
      <div className="panel-side-left">
        <Panel title="Placar da rodada">
          <StatRow k={<>Você <Pill tone="accent">X</Pill></>} v={placar.voce} />
          <StatRow k={<>{modo === 'cpu' ? 'CPU' : 'Jogador 2'} <Pill tone="muted">O</Pill></>} v={placar.cpu} />
          <StatRow k="Empates" v={placar.empates} />
        </Panel>

        <Panel title="Modo">
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip active={modo === 'cpu'} onClick={() => { setModo('cpu'); reiniciarPlacar() }}>vs CPU</Chip>
            <Chip active={modo === 'dois'} onClick={() => { setModo('dois'); reiniciarPlacar() }}>2 jogadores</Chip>
          </div>
        </Panel>

        {modo === 'cpu' && (
          <Panel title="Dificuldade">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip active={nivel === 'facil'} onClick={() => setNivel('facil')}>Fácil</Chip>
              <Chip active={nivel === 'medio'} onClick={() => setNivel('medio')}>Médio</Chip>
              <Chip active={nivel === 'dificil'} onClick={() => setNivel('dificil')}>Difícil</Chip>
            </div>
          </Panel>
        )}
      </div>

      {/* Tabuleiro central */}
      <BoardArea status={status}>
        <div className="ttt-board" role="grid" aria-label="Tabuleiro do jogo da velha">
          {tab.map((c, i) => (
            <button
              key={i}
              className={`ttt-cell${c === 'X' ? ' x' : c === 'O' ? ' o' : ''}${linhaWin.includes(i) ? ' win' : ''}`}
              onClick={() => jogarHumano(i)}
              disabled={Boolean(c) || acabou || (modo === 'cpu' && vez !== 'X')}
              aria-label={c ? `Casa ${i + 1}: ${c}` : `Casa ${i + 1} vazia`}
            >
              {c && <MarcaSVG m={c} />}
            </button>
          ))}
        </div>
      </BoardArea>

      {/* Painel direito: ações + recorde */}
      <div className="panel-side-right">
        <Panel title="Ações">
          <PanelActions>
            <Button variant="primary" onClick={novaRodada}>Nova rodada</Button>
            <Button variant="ghost" onClick={reiniciarPlacar}>Reiniciar placar</Button>
          </PanelActions>
        </Panel>
        <Panel title="Recorde">
          <StatRow k="Vitórias seguidas" v={recorde} />
          {modo === 'cpu' && <StatRow k="Sequência atual" v={streak} />}
        </Panel>
      </div>
    </div>
  )
}
