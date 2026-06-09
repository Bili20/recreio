import { useEffect, useRef, useState } from 'react'
import type { TouchEvent as ReactTouchEvent } from 'react'
import Panel, { StatRow, Divider } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord, RECORD_DEFS } from '../../utils/records'
import {
  mover, adicionarAleatorio, gridInicial, temMovimento, venceu,
  type Direcao, type Grade,
} from './logic'

// Cor do bloco: intensidade do acento cresce com log2(valor); texto contrasta nos blocos intensos.
function estiloTile(v: number) {
  if (v === 0) return undefined
  const pct = Math.min(100, 16 + Math.log2(v) * 8) // 2≈24% … 2048≈100%
  return {
    background: `color-mix(in oklab, var(--accent) ${pct}%, var(--surface))`,
    color: pct > 52 ? 'var(--accent-fg)' : 'var(--text)',
  }
}

export default function Jogo2048() {
  const { records, submit } = useRecords()
  const [grade, setGrade] = useState<Grade>(() => gridInicial())
  const [pontos, setPontos] = useState(0)
  const [jogadas, setJogadas] = useState(0)
  const [registrado, setRegistrado] = useState(false)

  const ganhou = venceu(grade)
  const fim = !temMovimento(grade)
  const maiorBloco = Math.max(...grade.flat())

  function aplicar(dir: Direcao) {
    if (fim) return
    const r = mover(grade, dir)
    if (!r.mudou) return
    setGrade(adicionarAleatorio(r.grid))
    setPontos((p) => p + r.ganho)
    setJogadas((j) => j + 1)
  }

  // Teclado (setas). Re-vincula quando a grade muda p/ usar o estado atual.
  useEffect(() => {
    const mapa: Record<string, Direcao> = {
      ArrowLeft: 'esquerda', ArrowRight: 'direita', ArrowUp: 'cima', ArrowDown: 'baixo',
    }
    const onKey = (e: KeyboardEvent) => {
      const dir = mapa[e.key]
      if (!dir) return
      e.preventDefault()
      aplicar(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, fim])

  // Swipe (touch).
  const toque = useRef<{ x: number; y: number } | null>(null)
  function onTouchStart(e: ReactTouchEvent) {
    const t = e.touches[0]
    toque.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e: ReactTouchEvent) {
    if (!toque.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - toque.current.x
    const dy = t.clientY - toque.current.y
    toque.current = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) aplicar(dx > 0 ? 'direita' : 'esquerda')
    else aplicar(dy > 0 ? 'baixo' : 'cima')
  }

  // Grava o recorde uma vez por jogo: ao fim de jogo (pontuação é monotônica → final = máximo).
  useEffect(() => {
    if (fim && !registrado && pontos > 0) {
      submit('g2048', pontos)
      setRegistrado(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fim])

  function novoJogo() {
    if (!registrado && pontos > 0) submit('g2048', pontos) // registra jogo abandonado
    setGrade(gridInicial())
    setPontos(0)
    setJogadas(0)
    setRegistrado(false)
  }

  const status = fim
    ? 'Fim de jogo — sem movimentos'
    : ganhou ? 'Você chegou a 2048! 🎉'
    : 'Junte blocos iguais para chegar a 2048'
  const recorde = hasRecord(records.g2048) ? RECORD_DEFS.g2048.format(records.g2048!.value as number) : '—'

  return (
    <div className="game-layout cols-2">
      <div className="panel-side-left">
        <Panel title="Pontos">
          <div className="g2048-score">{pontos.toLocaleString('pt-BR')}</div>
          <Divider />
          <StatRow k="Maior bloco" v={maiorBloco} />
          <StatRow k="Jogadas" v={jogadas} />
          <StatRow k="Recorde" v={recorde} />
        </Panel>
        <Panel title="Como jogar">
          <p style={{ color: 'var(--muted)', fontSize: 'var(--t-sm)', marginBottom: 12 }}>
            Use as setas do teclado ou deslize para mover os blocos.
          </p>
          <Button variant="primary" onClick={novoJogo}>Novo jogo</Button>
        </Panel>
      </div>

      <BoardArea status={status}>
        <div className="g2048" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="grid" aria-label="Tabuleiro do 2048">
          {grade.flat().map((v, i) => (
            <div key={i} className={`tile${v === 0 ? ' empty' : ''}`} style={estiloTile(v)}>
              {v !== 0 ? v : ''}
            </div>
          ))}
        </div>
      </BoardArea>
    </div>
  )
}
