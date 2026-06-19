import { useState } from 'react'
import Panel, { StatRow, Divider } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord } from '../../utils/records'
import { IconPedra, IconPapel, IconTesoura } from '../../components/icons'
import {
  resultado, frase, jogadaCpu, serieEncerrada, ALVO, JOGADAS,
  type Jogada, type ResultadoRodada,
} from './logic'

// Ícone geométrico de cada jogada (mesma linguagem do design).
function iconeDe(j: Jogada) {
  return j === 'pedra' ? <IconPedra /> : j === 'papel' ? <IconPapel /> : <IconTesoura />
}
const ROTULO: Record<Jogada, string> = { pedra: 'Pedra', papel: 'Papel', tesoura: 'Tesoura' }

export default function Jokenpo() {
  const { records, submit, addPlay } = useRecords()
  const [escolha, setEscolha] = useState<Jogada | null>(null)
  const [cpu, setCpu] = useState<Jogada | null>(null)
  const [ultimo, setUltimo] = useState<ResultadoRodada | null>(null)
  const [placar, setPlacar] = useState({ voce: 0, cpu: 0 })
  const [historico, setHistorico] = useState<('vitoria' | 'derrota')[]>([])
  const [streak, setStreak] = useState(0)
  const [revealKey, setRevealKey] = useState(0)

  const fim = serieEncerrada(placar.voce, placar.cpu)
  const venceuSerie = placar.voce >= ALVO

  function jogar(j: Jogada) {
    if (fim) return
    const c = jogadaCpu()
    const r = resultado(j, c)
    setEscolha(j); setCpu(c); setUltimo(r); setRevealKey((k) => k + 1)
    let voce = placar.voce
    let cpuPts = placar.cpu
    if (r === 'vitoria') {
      voce += 1
      setPlacar({ voce, cpu: cpuPts })
      setHistorico((h) => [...h, 'vitoria'])
    } else if (r === 'derrota') {
      cpuPts += 1
      setPlacar({ voce, cpu: cpuPts })
      setHistorico((h) => [...h, 'derrota'])
    }
    // empate: repete a rodada (não altera placar nem histórico)

    // Série encerrada nesta rodada: registra uma única vez (recorde de séries seguidas).
    if (serieEncerrada(voce, cpuPts)) {
      if (voce >= ALVO) {
        const nova = streak + 1
        setStreak(nova)
        submit('jokenpo', nova)
      } else {
        setStreak(0)
        addPlay('jokenpo')
      }
    }
  }

  function novaSerie() {
    setPlacar({ voce: 0, cpu: 0 }); setHistorico([])
    setEscolha(null); setCpu(null); setUltimo(null)
  }

  // Texto de status acima da arena.
  let status: string
  if (fim) status = venceuSerie ? 'Você venceu a série! 🎉' : 'A CPU venceu a série.'
  else if (ultimo === null) status = 'Escolha sua jogada'
  else if (ultimo === 'empate') status = 'Empate — joguem de novo'
  else status = `${ultimo === 'vitoria' ? 'Você venceu a rodada' : 'A CPU venceu a rodada'} — ${frase(escolha!, cpu!).toLowerCase()}`

  const recorde = hasRecord(records.jokenpo) ? (records.jokenpo!.value as number) : '—'

  // Classe do token: destaca o vencedor da última rodada decidida.
  const tokenCls = (lado: 'voce' | 'cpu') => {
    if (ultimo === null || ultimo === 'empate') return 'rps-token'
    const win = (lado === 'voce' && ultimo === 'vitoria') || (lado === 'cpu' && ultimo === 'derrota')
    return `rps-token${win ? ' win' : ''}`
  }

  return (
    <div className="game-layout cols-2">
      <div className="panel-side-left">
        <Panel title="Melhor de 5">
          <StatRow k="Você" v={placar.voce} />
          <StatRow k="CPU" v={placar.cpu} />
          <div className="bo5" aria-label="Rodadas da série">
            {Array.from({ length: 5 }).map((_, i) => {
              const h = historico[i]
              return <span key={i} className={`pip${h === 'vitoria' ? ' win' : h === 'derrota' ? ' loss' : ''}`} />
            })}
          </div>
          <Divider />
          <StatRow k="Sequência atual" v={streak} />
          <StatRow k="Recorde" v={recorde} />
        </Panel>
      </div>

      <BoardArea status={status}>
        <div className="rps-arena">
          <div className="rps-side">
            <span className="rps-label">Você</span>
            <div key={`v${revealKey}`} className={`${tokenCls('voce')} rps-reveal`}>
              {escolha ? iconeDe(escolha) : null}
            </div>
          </div>
          <span className="rps-vs">VS</span>
          <div className="rps-side">
            <span className="rps-label">CPU</span>
            <div key={`c${revealKey}`} className={`${tokenCls('cpu')} rps-reveal`}>
              {cpu ? iconeDe(cpu) : null}
            </div>
          </div>
        </div>

        {fim ? (
          <Button variant="primary" onClick={novaSerie}>Nova série</Button>
        ) : (
          <div className="rps-choices">
            {JOGADAS.map((j) => (
              <button
                key={j}
                type="button"
                className={`rps-choice${escolha === j ? ' active' : ''}`}
                onClick={() => jogar(j)}
              >
                {iconeDe(j)}
                {ROTULO[j]}
              </button>
            ))}
          </div>
        )}
      </BoardArea>
    </div>
  )
}
