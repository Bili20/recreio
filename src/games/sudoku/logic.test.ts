import { describe, it, expect } from 'vitest'
import { posValido, conflito, resolver, gerarSolucao, gerar, completo, gradeVazia } from './logic'

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

describe('gerar', () => {
  it('Fácil tem 40 pistas e o puzzle é subconjunto da solução', () => {
    const { puzzle, solucao } = gerar('facil', () => 0.3)
    const pistas = puzzle.flat().filter((v) => v !== 0).length
    expect(pistas).toBe(40)
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++)
      if (puzzle[r][c] !== 0) expect(puzzle[r][c]).toBe(solucao[r][c])
  })
  it('Difícil tem 26 pistas', () => {
    expect(gerar('dificil', () => 0.7).puzzle.flat().filter((v) => v !== 0).length).toBe(26)
  })
  it('resolver resolve o puzzle gerado', () => {
    const { puzzle } = gerar('medio', () => 0.2)
    expect(resolver(puzzle)).toBe(true)
    expect(completo(puzzle)).toBe(true)
  })
})
