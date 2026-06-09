// Lógica pura do 2048 — sem React, testável. Grade 4×4, 0 = casa vazia.

export type Direcao = 'esquerda' | 'direita' | 'cima' | 'baixo'
export type Grade = number[][]

// Desliza uma linha para a esquerda, fundindo pares iguais (uma fusão por bloco).
export function slide(linha: number[]): { linha: number[]; ganho: number } {
  const nums = linha.filter((n) => n !== 0)
  const out: number[] = []
  let ganho = 0
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const fundido = nums[i] * 2
      out.push(fundido)
      ganho += fundido
      i++ // pula o próximo (já fundido)
    } else {
      out.push(nums[i])
    }
  }
  while (out.length < linha.length) out.push(0)
  return { linha: out, ganho }
}

const transpor = (g: Grade): Grade => g[0].map((_, c) => g.map((linha) => linha[c]))
const inverter = (g: Grade): Grade => g.map((linha) => [...linha].reverse())

// Move a grade na direção dada; retorna nova grade, pontos ganhos e se algo mudou.
export function mover(grade: Grade, dir: Direcao): { grid: Grade; ganho: number; mudou: boolean } {
  let g = grade
  if (dir === 'direita') g = inverter(g)
  else if (dir === 'cima') g = transpor(g)
  else if (dir === 'baixo') g = inverter(transpor(g))

  let ganho = 0
  let novo: Grade = g.map((linha) => {
    const r = slide(linha)
    ganho += r.ganho
    return r.linha
  })

  if (dir === 'direita') novo = inverter(novo)
  else if (dir === 'cima') novo = transpor(novo)
  else if (dir === 'baixo') novo = transpor(inverter(novo))

  const mudou = JSON.stringify(novo) !== JSON.stringify(grade)
  return { grid: novo, ganho, mudou }
}

export const gridVazio = (): Grade => Array.from({ length: 4 }, () => Array(4).fill(0))

// Adiciona um bloco (2 com 90%, 4 com 10%) em uma casa vazia aleatória.
export function adicionarAleatorio(grade: Grade, rng: () => number = Math.random): Grade {
  const vazias: [number, number][] = []
  grade.forEach((linha, i) => linha.forEach((v, j) => { if (v === 0) vazias.push([i, j]) }))
  if (vazias.length === 0) return grade
  const [i, j] = vazias[Math.floor(rng() * vazias.length)]
  const valor = rng() < 0.9 ? 2 : 4
  const novo = grade.map((linha) => [...linha])
  novo[i][j] = valor
  return novo
}

export function gridInicial(rng: () => number = Math.random): Grade {
  return adicionarAleatorio(adicionarAleatorio(gridVazio(), rng), rng)
}

// Há algum movimento possível? (casa vazia ou vizinhos iguais)
export function temMovimento(grade: Grade): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grade[i][j] === 0) return true
      if (j < 3 && grade[i][j] === grade[i][j + 1]) return true
      if (i < 3 && grade[i][j] === grade[i + 1][j]) return true
    }
  }
  return false
}

export const venceu = (grade: Grade): boolean => grade.some((linha) => linha.some((v) => v >= 2048))
