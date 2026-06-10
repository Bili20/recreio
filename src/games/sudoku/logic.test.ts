import { describe, it, expect } from 'vitest'
import {
  posValido, conflito, resolver, gerarSolucao, gerar, completo, gradeVazia, contarSolucoes,
} from './logic'

const semConflitos = (g: number[][]) => {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const v = g[r][c]
    if (v === 0) return false
    g[r][c] = 0
    const ok = posValido(g, r, c, v)
    g[r][c] = v
    if (!ok) return false
  }
  return true
}

describe('gerarSolucao', () => {
  it('produz uma grade 9×9 completa e válida', () => {
    const g = gerarSolucao(() => 0.5)
    expect(g.length).toBe(9)
    expect(completo(g)).toBe(true)
    expect(semConflitos(g)).toBe(true)
  })
})

describe('posValido / conflito', () => {
  it('detecta conflito na linha', () => {
    const g = gradeVazia(); g[0][0] = 5
    expect(posValido(g, 0, 8, 5)).toBe(false)
    expect(conflito(g, 0, 8, 5)).toBe(true)
    expect(posValido(g, 0, 8, 6)).toBe(true)
  })
  it('detecta conflito na caixa', () => {
    const g = gradeVazia(); g[0][0] = 7
    expect(posValido(g, 2, 2, 7)).toBe(false)
  })
})

describe('contarSolucoes', () => {
  it('grade completa tem exatamente 1 solução', () => {
    expect(contarSolucoes(gerarSolucao(() => 0.5))).toBe(1)
  })
  it('grade vazia tem múltiplas soluções (corta no limite)', () => {
    expect(contarSolucoes(gradeVazia())).toBe(2)
  })
  it('não muta a grade de entrada', () => {
    const g = gradeVazia(); g[0][0] = 5
    contarSolucoes(g)
    expect(g[0][0]).toBe(5)
    expect(g.flat().filter((v) => v !== 0).length).toBe(1)
  })
})

describe('gerar', () => {
  it('Fácil: pistas próximas de 40 e puzzle é subconjunto da solução', () => {
    const { puzzle, solucao } = gerar('facil', () => 0.3)
    const pistas = puzzle.flat().filter((v) => v !== 0).length
    expect(pistas).toBeGreaterThanOrEqual(40)
    expect(pistas).toBeLessThanOrEqual(48)
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++)
      if (puzzle[r][c] !== 0) expect(puzzle[r][c]).toBe(solucao[r][c])
  })
  it('Difícil: menos pistas que o Fácil', () => {
    const pistas = gerar('dificil', () => 0.7).puzzle.flat().filter((v) => v !== 0).length
    expect(pistas).toBeGreaterThanOrEqual(26)
    expect(pistas).toBeLessThanOrEqual(40)
  })
  // Regressão do bug: puzzle com múltiplas soluções marcava como "errado" um
  // número sem nenhum conflito (pertencia a outra solução válida).
  it('todo puzzle gerado tem solução ÚNICA', () => {
    for (const dif of ['facil', 'medio', 'dificil'] as const) {
      const { puzzle } = gerar(dif, () => 0.42)
      expect(contarSolucoes(puzzle)).toBe(1)
    }
  })
  it('resolver resolve o puzzle gerado', () => {
    const { puzzle } = gerar('medio', () => 0.2)
    expect(resolver(puzzle)).toBe(true)
    expect(completo(puzzle)).toBe(true)
  })
})
