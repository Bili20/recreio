import { useEffect, useRef, useState } from 'react'
import Panel, { StatRow, Divider } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord, RECORD_DEFS } from '../../utils/records'
import { Simbolo } from './simbolos'
import { criarBaralho, type Carta } from './logic'

type Grade = 4 | 6
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function Memoria() {
  const { records, submit } = useRecords()
  const [grade, setGrade] = useState<Grade>(4)
  const pares = (grade * grade) / 2
  const [cartas, setCartas] = useState<Carta[]>(() => criarBaralho(pares))
  const [viradas, setViradas] = useState<number[]>([]) // ids viradas (até 2)
  const [encontradas, setEncontradas] = useState<number[]>([]) // símbolos achados
  const [movimentos, setMovimentos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [inicio, setInicio] = useState<number | null>(null)
  const [agora, setAgora] = useState(0) // segundos decorridos

  const completo = encontradas.length === pares

  // Timeout do desvirar (par errado): guardado para poder cancelar quando o jogo
  // reinicia no meio dos 750ms — senão ele "engoliria" a 1ª virada do jogo novo.
  const desvirarTimeout = useRef<number | null>(null)
  useEffect(() => () => { if (desvirarTimeout.current !== null) clearTimeout(desvirarTimeout.current) }, [])

  // Cronômetro: roda enquanto há início e não completou.
  useEffect(() => {
    if (inicio === null || completo) return
    const id = setInterval(() => setAgora(Math.floor((Date.now() - inicio) / 1000)), 250)
    return () => clearInterval(id)
  }, [inicio, completo])

  function novoJogo(g: Grade = grade) {
    if (desvirarTimeout.current !== null) { clearTimeout(desvirarTimeout.current); desvirarTimeout.current = null }
    const p = (g * g) / 2
    setGrade(g)
    setCartas(criarBaralho(p))
    setViradas([]); setEncontradas([]); setMovimentos(0)
    setBloqueado(false); setInicio(null); setAgora(0)
  }

  function virar(carta: Carta) {
    if (bloqueado || completo) return
    if (viradas.includes(carta.id) || encontradas.includes(carta.simbolo)) return
    // Date.now() aqui roda só no clique (handler), não no render — uso legítimo. O
    // react-hooks/purity não reconhece `virar` como handler (só é usado em onClick,
    // sem addEventListener como no Sudoku), então marca um falso positivo.
    // eslint-disable-next-line react-hooks/purity
    if (inicio === null) setInicio(Date.now())
    const novas = [...viradas, carta.id]
    setViradas(novas)
    if (novas.length === 2) {
      setMovimentos((m) => m + 1)
      const a = cartas.find((c) => c.id === novas[0])!
      const b = cartas.find((c) => c.id === novas[1])!
      if (a.simbolo === b.simbolo) {
        const novasEncontradas = [...encontradas, a.simbolo]
        setEncontradas(novasEncontradas)
        setViradas([])
        if (novasEncontradas.length === pares) {
          // Completou nesta jogada: congela o tempo e grava o recorde (uma vez).
          // eslint-disable-next-line react-hooks/purity -- handler, não render (ver acima)
          const seg = Math.max(1, Math.round((Date.now() - inicio!) / 1000))
          setAgora(seg)
          submit('memoria', seg)
        }
      } else {
        setBloqueado(true)
        desvirarTimeout.current = window.setTimeout(() => {
          desvirarTimeout.current = null
          setViradas([]); setBloqueado(false)
        }, 750)
      }
    }
  }

  const estado = (c: Carta): 'down' | 'up' | 'matched' => {
    if (encontradas.includes(c.simbolo)) return 'matched'
    if (viradas.includes(c.id)) return 'up'
    return 'down'
  }

  const tempo = inicio === null ? 0 : agora
  const status = completo
    ? `Você completou em ${fmt(tempo)}!`
    : viradas.length > 0 ? 'Encontre o par da carta virada' : 'Vire duas cartas'
  const recorde = hasRecord(records.memoria)
    ? RECORD_DEFS.memoria.format(records.memoria!.value as number)
    : '—'

  return (
    <div className="game-layout cols-2">
      <div className="panel-side-left">
        <Panel title="Tempo">
          <div className="mem-tempo">{fmt(tempo)}</div>
          <Divider />
          <StatRow k="Movimentos" v={movimentos} />
          <StatRow k="Pares" v={`${encontradas.length} / ${pares}`} />
          <StatRow k="Recorde" v={recorde} />
        </Panel>
        <Panel title="Tamanho da grade">
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip active={grade === 4} onClick={() => novoJogo(4)}>4×4</Chip>
            <Chip active={grade === 6} onClick={() => novoJogo(6)}>6×6</Chip>
          </div>
        </Panel>
      </div>

      <BoardArea status={status}>
        <div className="mem-grid" style={{ gridTemplateColumns: `repeat(${grade}, 1fr)` }}>
          {cartas.map((c) => {
            const st = estado(c)
            return (
              <button
                key={c.id}
                type="button"
                className={`mem-card ${st}`}
                onClick={() => virar(c)}
                disabled={st !== 'down' || bloqueado || completo}
                aria-label={st === 'down' ? 'Carta virada para baixo' : `Carta ${st}`}
              >
                {st !== 'down' && <Simbolo i={c.simbolo} />}
              </button>
            )
          })}
        </div>
        {completo && <Button variant="primary" onClick={() => novoJogo()}>Novo jogo</Button>}
      </BoardArea>
    </div>
  )
}
