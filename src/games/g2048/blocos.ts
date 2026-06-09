// Modelo de blocos com identidade estável para o 2048 — permite animar o deslize,
// a fusão e o surgimento de cada bloco. Lógica pura (sem React), testável.

import type { Direcao } from './logic'

export interface Bloco {
  id: number
  valor: number
  r: number
  c: number
  novo?: boolean      // surgiu nesta jogada (anima "pop")
  fundido?: boolean   // resultado de uma fusão nesta jogada (anima "pop")
  removido?: boolean  // foi absorvido numa fusão (some após o deslize)
}

let seq = 1
export const novoId = () => seq++
export const resetIds = () => { seq = 1 } // determinismo em testes

// Cria blocos a partir de uma grade numérica (0 = vazio).
export function blocosDeGrade(grade: number[][]): Bloco[] {
  const bs: Bloco[] = []
  grade.forEach((linha, r) => linha.forEach((v, c) => { if (v !== 0) bs.push({ id: novoId(), valor: v, r, c }) }))
  return bs
}

// Grade numérica a partir dos blocos vivos (ignora os removidos).
export function gradeDeBlocos(blocos: Bloco[]): number[][] {
  const g = Array.from({ length: 4 }, () => Array(4).fill(0))
  blocos.filter((b) => !b.removido).forEach((b) => { g[b.r][b.c] = b.valor })
  return g
}

// Coordenadas de uma linha (k) na ordem de viagem da direção (frente primeiro).
function coords(dir: Direcao, k: number): [number, number][] {
  const seqIdx = dir === 'esquerda' || dir === 'cima' ? [0, 1, 2, 3] : [3, 2, 1, 0]
  return seqIdx.map((i) => (dir === 'esquerda' || dir === 'direita' ? [k, i] : [i, k]))
}

// Move os blocos na direção dada, fundindo iguais (uma fusão por bloco). Retorna a
// nova lista (incluindo os `removido` no destino, para a animação), pontos e se mudou.
export function moverBlocos(blocos: Bloco[], dir: Direcao): { blocos: Bloco[]; ganho: number; mudou: boolean } {
  const mapa = new Map<string, Bloco>()
  blocos.filter((b) => !b.removido).forEach((b) => mapa.set(`${b.r},${b.c}`, { id: b.id, valor: b.valor, r: b.r, c: b.c }))

  const out: Bloco[] = []
  let ganho = 0
  let mudou = false

  for (let k = 0; k < 4; k++) {
    const cs = coords(dir, k)
    const fila = cs.map(([r, c]) => mapa.get(`${r},${c}`)).filter((b): b is Bloco => Boolean(b))
    let alvo = 0
    let ultimo: Bloco | null = null
    let ultimoFundiu = false

    for (const b of fila) {
      if (ultimo && ultimo.valor === b.valor && !ultimoFundiu) {
        // funde no bloco anterior (que já está em cs[alvo-1])
        ultimo.valor *= 2
        ultimo.fundido = true
        ganho += ultimo.valor
        ultimoFundiu = true
        const [dr, dc] = cs[alvo - 1]
        b.r = dr; b.c = dc; b.removido = true
        out.push(b)
        mudou = true
      } else {
        const [dr, dc] = cs[alvo]
        if (b.r !== dr || b.c !== dc) mudou = true
        b.r = dr; b.c = dc
        out.push(b)
        ultimo = b
        ultimoFundiu = false
        alvo++
      }
    }
  }

  return { blocos: out, ganho, mudou }
}

// Posições vazias na grade dos blocos vivos.
export function vazias(blocos: Bloco[]): [number, number][] {
  const g = gradeDeBlocos(blocos)
  const v: [number, number][] = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) v.push([r, c])
  return v
}

// Adiciona um bloco novo (2 com 90%, 4 com 10%) numa casa vazia aleatória.
export function adicionarBloco(blocos: Bloco[], rng: () => number = Math.random): Bloco[] {
  const livres = vazias(blocos)
  if (livres.length === 0) return blocos
  const [r, c] = livres[Math.floor(rng() * livres.length)]
  const valor = rng() < 0.9 ? 2 : 4
  return [...blocos, { id: novoId(), valor, r, c, novo: true }]
}
