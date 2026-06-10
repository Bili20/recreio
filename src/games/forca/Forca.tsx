import { useEffect, useState } from 'react'
import Panel, { StatRow, Divider, PanelActions } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import Pill from '../../components/Pill'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord } from '../../utils/records'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CATEGORIAS } from './palavras'
import {
  escolherPalavra, letrasErradas, venceu, perdeu, normalizar, ALFABETO, MAX_ERROS,
  type PalavraSorteada,
} from './logic'

// Boneco progressivo: forca em --text; partes do corpo em --accent conforme os erros.
function Boneco({ erros }: { erros: number }) {
  return (
    <svg className="hm-svg" viewBox="0 0 200 220" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="var(--text)">
        <path d="M30 210 H150" />
        <path d="M60 210 V20 H140" />
        <path d="M140 20 V42" />
      </g>
      <g stroke="var(--accent)">
        {erros >= 1 && <circle cx="140" cy="60" r="18" />}
        {erros >= 2 && <path d="M140 78 V140" />}
        {erros >= 3 && <path d="M140 95 L114 118" />}
        {erros >= 4 && <path d="M140 95 L166 118" />}
        {erros >= 5 && <path d="M140 140 L116 178" />}
        {erros >= 6 && <path d="M140 140 L164 178" />}
      </g>
    </svg>
  )
}

export default function Forca() {
  const { records, definir } = useRecords()
  const [contadores, setContadores] = useLocalStorage('recreio-forca', { vitorias: 0, partidas: 0 })
  const [sorteada, setSorteada] = useState<PalavraSorteada>(() => escolherPalavra(CATEGORIAS))
  const [tentadas, setTentadas] = useState<string[]>([])
  const [dicaUsada, setDicaUsada] = useState(false)
  const [registrada, setRegistrada] = useState(false)

  const { palavra, categoria } = sorteada
  const erradas = letrasErradas(palavra, tentadas)
  const ganhou = venceu(palavra, tentadas)
  const perdeuJogo = perdeu(palavra, tentadas)
  const fim = ganhou || perdeuJogo
  const distintas = [...new Set(palavra.split(''))]
  const certas = distintas.filter((l) => tentadas.includes(l)).length

  // Ao terminar a partida: atualiza contadores e espelha o aproveitamento no recorde (1×).
  // Efeitos fora do updater do setState (updaters precisam ser puros — StrictMode os roda 2×).
  useEffect(() => {
    if (!fim || registrada) return
    setRegistrada(true)
    const novo = { vitorias: contadores.vitorias + (ganhou ? 1 : 0), partidas: contadores.partidas + 1 }
    setContadores(novo)
    definir('forca', Math.round((novo.vitorias / novo.partidas) * 100), novo.partidas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fim])

  function tentar(letra: string) {
    if (fim || tentadas.includes(letra)) return
    // dedupe também dentro do updater: protege contra autorepeat do teclado físico
    // disparando duas vezes antes do re-render
    setTentadas((t) => (t.includes(letra) ? t : [...t, letra]))
  }

  function pedirDica() {
    if (fim || dicaUsada) return
    const ocultas = distintas.filter((l) => !tentadas.includes(l))
    if (ocultas.length === 0) return
    setDicaUsada(true)
    setTentadas((t) => [...t, ocultas[Math.floor(Math.random() * ocultas.length)]])
  }

  function novaPalavra() {
    setSorteada(escolherPalavra(CATEGORIAS))
    setTentadas([]); setDicaUsada(false); setRegistrada(false)
  }

  // Teclado físico (a–z).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const l = normalizar(e.key)
      if (l.length === 1 && ALFABETO.includes(l)) tentar(l)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentadas, fim])

  const status = ganhou
    ? 'Você acertou a palavra! 🎉'
    : perdeuJogo ? `Fim de jogo — a palavra era ${palavra}`
    : erradas.length === MAX_ERROS - 1 ? 'Falta 1 erro — escolha com cuidado'
    : 'Adivinhe a palavra'
  const apro = hasRecord(records.forca) ? `${records.forca!.value as number}%` : '—'

  return (
    <div className="game-layout cols-2">
      <div className="panel-side-left">
        <Panel title="Rodada">
          <StatRow k="Categoria" v={categoria} />
          <StatRow k="Erros" v={`${erradas.length} / ${MAX_ERROS}`} />
          <StatRow k="Letras certas" v={`${certas} / ${distintas.length}`} />
        </Panel>
        <Panel title="Letras erradas">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 28 }}>
            {erradas.map((l) => <Pill key={l} tone="muted">{l}</Pill>)}
          </div>
        </Panel>
        <Panel title="Aproveitamento">
          <div className="hm-apro">{apro}</div>
          <Divider />
          <StatRow k="Partidas" v={contadores.partidas} />
        </Panel>
        <Panel title="Ações">
          <PanelActions>
            <Button variant="soft" onClick={pedirDica} disabled={dicaUsada || fim}>Pedir dica</Button>
            <Button variant="primary" onClick={novaPalavra}>Nova palavra</Button>
          </PanelActions>
        </Panel>
      </div>

      <BoardArea status={status}>
        <Boneco erros={erradas.length} />
        <div className="hm-word" aria-label="Palavra">
          {palavra.split('').map((l, i) => {
            // Letra oculta NÃO vai ao DOM (senão dava para revelar selecionando o texto);
            // no fim da partida a palavra inteira é revelada.
            const revelada = tentadas.includes(l) || fim
            return (
              <span key={i} className={`hm-slot${revelada ? '' : ' blank'}`}>{revelada ? l : ' '}</span>
            )
          })}
        </div>
        <div className="keyboard">
          {ALFABETO.map((l) => {
            const usada = tentadas.includes(l)
            const cls = usada ? (palavra.includes(l) ? 'key hit' : 'key miss') : 'key'
            return (
              <button key={l} className={cls} onClick={() => tentar(l)} disabled={usada || fim}>{l}</button>
            )
          })}
        </div>
      </BoardArea>
    </div>
  )
}
