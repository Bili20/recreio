import { useEffect, useRef, useState } from 'react'
import type { TouchEvent as ReactTouchEvent, CSSProperties } from 'react'
import Panel, { StatRow, Divider } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import ResultadoOverlay from '../../components/ResultadoOverlay'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord, RECORD_DEFS } from '../../utils/records'
import { gridInicial, temMovimento, venceu, type Direcao } from './logic'
import {
  blocosDeGrade, gradeDeBlocos, moverBlocos, adicionarBloco, type Bloco,
} from './blocos'

const DURACAO = 140 // ms do deslize; combina com a transição em .tile

// Cor do bloco: intensidade do acento cresce com log2(valor); texto contrasta nos intensos.
function estiloTile(v: number): CSSProperties {
  const pct = Math.min(100, 16 + Math.log2(v) * 8) // 2≈24% … 2048≈100%
  return {
    background: `color-mix(in oklab, var(--accent) ${pct}%, var(--surface))`,
    color: pct > 52 ? 'var(--accent-fg)' : 'var(--text)',
  }
}

export default function Jogo2048() {
  const { records, submit } = useRecords()
  const [blocos, setBlocos] = useState<Bloco[]>(() => blocosDeGrade(gridInicial()))
  const [pontos, setPontos] = useState(0)
  const [jogadas, setJogadas] = useState(0)
  const [animando, setAnimando] = useState(false)
  const [registrado, setRegistrado] = useState(false)
  const [bateuRecorde, setBateuRecorde] = useState(false)
  const [nudge, setNudge] = useState(false) // "tremor" quando a jogada não move nada

  const grade = gradeDeBlocos(blocos)
  const ganhou = venceu(grade)
  const fim = !animando && !temMovimento(grade)
  const maiorBloco = Math.max(0, ...grade.flat())

  // Timeout da fase pós-deslize: guardado para cancelar em "Novo jogo"/unmount —
  // senão o callback (que carrega os blocos da jogada antiga) sobrescreveria o
  // tabuleiro recém-criado com o estado do jogo anterior.
  const animTimeout = useRef<number | null>(null)
  useEffect(() => () => { if (animTimeout.current !== null) clearTimeout(animTimeout.current) }, [])

  const nudgeTimeout = useRef<number | null>(null)
  useEffect(() => () => { if (nudgeTimeout.current !== null) clearTimeout(nudgeTimeout.current) }, [])

  function aplicar(dir: Direcao) {
    if (animando || fim) return
    const r = moverBlocos(blocos, dir)
    if (!r.mudou) {
      // jogada sem efeito: um tremor curto avisa que nada se moveu
      setNudge(false)
      requestAnimationFrame(() => setNudge(true))
      if (nudgeTimeout.current !== null) clearTimeout(nudgeTimeout.current)
      nudgeTimeout.current = window.setTimeout(() => { setNudge(false); nudgeTimeout.current = null }, 320)
      return
    }
    setAnimando(true)
    setBlocos(r.blocos) // desliza e funde (os removidos deslizam sobre os sobreviventes)
    setPontos((p) => p + r.ganho)
    setJogadas((j) => j + 1)
    // após o deslize: limpa flags, remove os absorvidos e faz surgir um novo bloco
    animTimeout.current = window.setTimeout(() => {
      animTimeout.current = null
      const limpos = r.blocos
        .filter((b) => !b.removido)
        .map((b) => ({ ...b, novo: false, fundido: false }))
      setBlocos(adicionarBloco(limpos))
      setAnimando(false)
    }, DURACAO)
  }

  // Teclado (setas). Re-vincula quando o estado muda p/ ler o atual.
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
  }, [blocos, animando, fim])

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

  // Grava o recorde uma vez por jogo (pontuação monotônica → final = máximo).
  useEffect(() => {
    if (fim && !registrado && pontos > 0) {
      setBateuRecorde(submit('g2048', pontos))
      setRegistrado(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fim])

  function novoJogo() {
    if (animTimeout.current !== null) { clearTimeout(animTimeout.current); animTimeout.current = null }
    if (!registrado && pontos > 0) submit('g2048', pontos) // registra jogo abandonado
    setBlocos(blocosDeGrade(gridInicial()))
    setPontos(0)
    setJogadas(0)
    setAnimando(false)
    setRegistrado(false)
    setBateuRecorde(false)
  }

  const status = ganhou ? 'Você chegou a 2048! 🎉' : 'Junte blocos iguais para chegar a 2048'
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

      <BoardArea status={status} tom={ganhou ? 'vitoria' : undefined}>
        <div className={`g2048${nudge ? ' shake' : ''}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="grid" aria-label="Tabuleiro do 2048">
          {/* casas de fundo (estáticas) */}
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="g2048-cell" style={{ '--r': Math.floor(i / 4), '--c': i % 4 } as CSSProperties} />
          ))}
          {/* blocos (posicionados e animados) */}
          {blocos.map((b) => (
            <div
              key={b.id}
              className={`tile${b.novo ? ' novo' : ''}${b.fundido ? ' fundido' : ''}${b.removido ? ' removido' : ''}`}
              style={{ '--r': b.r, '--c': b.c, ...estiloTile(b.valor) } as CSSProperties}
            >
              {b.valor}
            </div>
          ))}
          {fim && (
            <ResultadoOverlay
              tipo="derrota"
              titulo="Fim de jogo"
              detalhe={`${pontos.toLocaleString('pt-BR')} pontos · maior bloco ${maiorBloco}`}
              novoRecorde={bateuRecorde}
              acaoLabel="Novo jogo"
              onAcao={novoJogo}
            />
          )}
        </div>
      </BoardArea>
    </div>
  )
}
