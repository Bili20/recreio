import { describe, it, expect } from 'vitest'
import { criarBaralho, embaralhar } from './logic'

describe('criarBaralho', () => {
  it('cria 2×pares cartas', () => expect(criarBaralho(8).length).toBe(16))
  it('cada símbolo aparece exatamente duas vezes', () => {
    const cont: Record<number, number> = {}
    for (const c of criarBaralho(8)) cont[c.simbolo] = (cont[c.simbolo] ?? 0) + 1
    expect(Object.keys(cont).length).toBe(8)
    expect(Object.values(cont).every((n) => n === 2)).toBe(true)
  })
  it('ids são únicos', () => {
    const ids = criarBaralho(6).map((c) => c.id)
    expect(new Set(ids).size).toBe(12)
  })
})

describe('embaralhar', () => {
  it('preserva os elementos (mesmo multiconjunto)', () => {
    const out = embaralhar([1, 2, 3, 4, 5], () => 0)
    expect([...out].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
  })
  it('não muta o array original', () => {
    const orig = [1, 2, 3]
    embaralhar(orig, () => 0.5)
    expect(orig).toEqual([1, 2, 3])
  })
})
