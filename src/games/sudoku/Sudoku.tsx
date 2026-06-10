import { useEffect, useState } from 'react'
import Panel, { StatRow, Divider } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Chip from '../../components/Chip'
import Button from '../../components/Button'
import { useRecords } from '../../hooks/useRecords'
import { hasRecord, RECORD_DEFS } from '../../utils/records'
import { gerar, type Grade, type Dificuldade } from './logic'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const ROTULO: Record<Dificuldade, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' }
const clonar = (g: Grade): Grade => g.map((l) => [...l])

export default function Sudoku() {
  const { records, submit, addPlay } = useRecords()
  const [dif, setDif] = useState<Dificuldade>('facil')
  const [jogo, setJogo] = useState(() => gerar('facil'))
  const [grade, setGrade] = useState<Grade>(() => clonar(jogo.puzzle))
  const [sel, setSel] = useState<[number, number] | null>(null)
  const [erros, setErros] = useState(0)
  const [inicio, setInicio] = useState<number>(() => Date.now())
  const [agora, setAgora] = useState(0)
  const [registrado, setRegistrado] = useState(false)

  // Vitória = grade idêntica à solução (números errados ficam visíveis em vermelho
  // até serem corrigidos, então "completa" não basta).
  const venceu = grade.every((linha, r) => linha.every((v, c) => v === jogo.solucao[r][c]))
  const fim = venceu || erros >= 3
  const preenchidas = grade.flat().filter((v) => v !== 0).length
  const pct = Math.round((preenchidas / 81) * 100)

  useEffect(() => {
    if (fim) return
    const id = setInterval(() => setAgora(Math.floor((Date.now() - inicio) / 1000)), 250)
    return () => clearInterval(id)
  }, [inicio, fim])

  // Fim de jogo registra uma única vez: vitória grava o melhor tempo; derrota
  // (3 erros) ao menos conta a partida no placar global.
  useEffect(() => {
    if (!fim || registrado) return
    setRegistrado(true)
    if (venceu) {
      const seg = Math.max(1, Math.round((Date.now() - inicio) / 1000))
      setAgora(seg)
      submit('sudoku', seg)
    } else {
      addPlay('sudoku')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fim])

  function novoJogo(d: Dificuldade = dif) {
    const j = gerar(d)
    setDif(d); setJogo(j); setGrade(clonar(j.puzzle))
    setSel(null); setErros(0)
    setInicio(Date.now()); setAgora(0); setRegistrado(false)
  }

  // Coloca o número na célula selecionada (0 = apagar). Número diferente da solução
  // ENTRA na grade (em vermelho) e conta erro — o jogador pode apagar ou sobrescrever.
  function digitar(v: number) {
    if (fim || !sel) return
    const [r, c] = sel
    if (jogo.puzzle[r][c] !== 0) return // célula fixa
    if (grade[r][c] === v) return // sem mudança (evita contar o mesmo erro 2x)
    if (v !== 0 && v !== jogo.solucao[r][c]) setErros((e) => e + 1)
    setGrade((g) => { const n = clonar(g); n[r][c] = v; return n })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') { e.preventDefault(); digitar(Number(e.key)) }
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); digitar(0) }
      else if (sel && e.key.startsWith('Arrow')) {
        e.preventDefault() // sem isso, mover a seleção também rola a página
        const [r, c] = sel
        if (e.key === 'ArrowUp' && r > 0) setSel([r - 1, c])
        else if (e.key === 'ArrowDown' && r < 8) setSel([r + 1, c])
        else if (e.key === 'ArrowLeft' && c > 0) setSel([r, c - 1])
        else if (e.key === 'ArrowRight' && c < 8) setSel([r, c + 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, grade, fim])

  const ehPeer = (r: number, c: number) => {
    if (!sel) return false
    const [sr, sc] = sel
    return r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))
  }

  const selFixa = sel !== null && jogo.puzzle[sel[0]][sel[1]] !== 0
  const status = venceu
    ? `Resolvido em ${fmt(agora)}! 🎉`
    : erros >= 3 ? 'Fim de jogo — 3 erros'
    : selFixa ? 'Célula fixa — escolha uma célula vazia'
    : sel ? 'Selecione um número para a célula destacada'
    : 'Toque numa célula para começar'
  const recorde = hasRecord(records.sudoku) ? RECORD_DEFS.sudoku.format(records.sudoku!.value as number) : '—'

  return (
    <div className="game-layout cols-2">
      <div className="panel-side-left">
        <Panel title="Tempo">
          <div className="su-tempo">{fmt(agora)}</div>
          <Divider />
          <StatRow k="Dificuldade" v={ROTULO[dif]} />
          <StatRow k="Preenchido" v={`${pct}%`} />
          <StatRow k="Erros" v={`${erros} / 3`} />
          <StatRow k="Recorde" v={recorde} />
        </Panel>
        <Panel title="Níveis">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip active={dif === 'facil'} onClick={() => novoJogo('facil')}>Fácil</Chip>
            <Chip active={dif === 'medio'} onClick={() => novoJogo('medio')}>Médio</Chip>
            <Chip active={dif === 'dificil'} onClick={() => novoJogo('dificil')}>Difícil</Chip>
          </div>
        </Panel>
      </div>

      <BoardArea status={status}>
        <div className="su-board" role="grid" aria-label="Tabuleiro de Sudoku">
          {grade.map((linha, r) =>
            linha.map((v, c) => {
              const fixo = jogo.puzzle[r][c] !== 0
              const selecionada = sel?.[0] === r && sel?.[1] === c
              // Errada = valor do usuário que diverge da solução (fica vermelho até corrigir)
              const eErrada = !fixo && v !== 0 && v !== jogo.solucao[r][c]
              const cls = [
                'su-cell',
                (c === 2 || c === 5) ? 'box-r' : '',
                (r === 2 || r === 5) ? 'box-b' : '',
                fixo ? 'fixo' : v !== 0 ? 'user' : '',
                selecionada ? 'sel' : ehPeer(r, c) ? 'peer' : '',
                eErrada ? 'erro' : '',
              ].filter(Boolean).join(' ')
              return (
                <div key={`${r}-${c}`} className={cls} onClick={() => setSel([r, c])}>
                  {v !== 0 ? v : ''}
                </div>
              )
            }),
          )}
        </div>
        <div className="su-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} className="su-key" onClick={() => digitar(n)} disabled={fim}>{n}</button>
          ))}
          <button className="su-key" onClick={() => digitar(0)} disabled={fim} aria-label="Apagar">⌫</button>
        </div>
        {fim && <Button variant="primary" onClick={() => novoJogo()}>Novo jogo</Button>}
      </BoardArea>
    </div>
  )
}
