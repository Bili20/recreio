import { describe, it, expect, beforeEach } from 'vitest'
import { blocosDeGrade, gradeDeBlocos, moverBlocos, adicionarBloco, vazias, resetIds } from './blocos'

beforeEach(() => resetIds())

describe('blocosDeGrade / gradeDeBlocos', () => {
  it('faz o ciclo de ida e volta', () => {
    const g = [
      [2, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 8, 0, 0],
      [0, 0, 0, 0],
    ]
    expect(gradeDeBlocos(blocosDeGrade(g))).toEqual(g)
  })
})

describe('moverBlocos', () => {
  it('funde dois iguais e marca survivor/removido', () => {
    const blocos = blocosDeGrade([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const r = moverBlocos(blocos, 'esquerda')
    expect(r.ganho).toBe(4)
    expect(r.mudou).toBe(true)
    expect(gradeDeBlocos(r.blocos)).toEqual([
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(r.blocos.some((b) => b.fundido)).toBe(true)
    expect(r.blocos.some((b) => b.removido)).toBe(true)
  })

  it('não funde em cadeia ([4,4,8] -> [8,8])', () => {
    const r = moverBlocos(blocosDeGrade([[4, 4, 8, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'esquerda')
    expect(gradeDeBlocos(r.blocos)[0]).toEqual([8, 8, 0, 0])
    expect(r.ganho).toBe(8)
  })

  it('mudou=false quando nada se move', () => {
    const r = moverBlocos(blocosDeGrade([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]), 'esquerda')
    expect(r.mudou).toBe(false)
  })

  it('move para baixo', () => {
    const r = moverBlocos(blocosDeGrade([[2, 0, 0, 0], [2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'baixo')
    expect(gradeDeBlocos(r.blocos)[3][0]).toBe(4)
  })
})

describe('adicionarBloco / vazias', () => {
  it('adiciona um bloco novo marcado em casa vazia', () => {
    const blocos = blocosDeGrade([[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 0]])
    expect(vazias(blocos)).toEqual([[3, 3]])
    const novo = adicionarBloco(blocos, () => 0) // casa [3,3], valor 2
    const adicionado = novo.find((b) => b.novo)
    expect(adicionado).toMatchObject({ r: 3, c: 3, valor: 2, novo: true })
  })
})
