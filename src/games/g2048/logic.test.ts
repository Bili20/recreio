import { describe, it, expect } from 'vitest'
import { slide, mover, temMovimento, venceu, adicionarAleatorio, gridVazio } from './logic'

describe('slide (desliza+funde p/ esquerda)', () => {
  it('funde par igual', () => expect(slide([2, 2, 0, 0])).toEqual({ linha: [4, 0, 0, 0], ganho: 4 }))
  it('funde dois pares', () => expect(slide([2, 2, 2, 2])).toEqual({ linha: [4, 4, 0, 0], ganho: 8 }))
  it('sem fusão dupla em cadeia', () => expect(slide([4, 4, 8, 0])).toEqual({ linha: [8, 8, 0, 0], ganho: 8 }))
  it('compacta sem fundir diferentes', () => expect(slide([2, 0, 4, 0])).toEqual({ linha: [2, 4, 0, 0], ganho: 0 }))
  it('linha vazia', () => expect(slide([0, 0, 0, 0])).toEqual({ linha: [0, 0, 0, 0], ganho: 0 }))
})

describe('mover', () => {
  it('move para a esquerda e marca mudança', () => {
    const r = mover([[0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'esquerda')
    expect(r.grid[0]).toEqual([4, 0, 0, 0])
    expect(r.ganho).toBe(4)
    expect(r.mudou).toBe(true)
  })
  it('move para a direita', () => {
    const r = mover([[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'direita')
    expect(r.grid[0]).toEqual([0, 0, 0, 4])
  })
  it('move para baixo', () => {
    const r = mover([[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 'baixo')
    expect(r.grid[3][0]).toBe(4)
  })
  it('mudou=false quando nada se move', () => {
    const g = [[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]
    expect(mover(g, 'esquerda').mudou).toBe(false)
  })
})

describe('temMovimento / venceu', () => {
  it('grade cheia sem fusões não tem movimento', () => {
    expect(temMovimento([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]])).toBe(false)
  })
  it('grade com casa vazia tem movimento', () => {
    expect(temMovimento([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 0]])).toBe(true)
  })
  it('detecta 2048', () => {
    expect(venceu([[2048, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])).toBe(true)
  })
})

describe('adicionarAleatorio', () => {
  it('preenche uma casa vazia com 2 (rng baixo)', () => {
    const g = adicionarAleatorio(gridVazio(), () => 0)
    expect(g[0][0]).toBe(2)
    expect(g.flat().filter((v) => v !== 0).length).toBe(1)
  })
})
