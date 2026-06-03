import { describe, it, expect, beforeEach } from 'vitest'
import { readJSON, writeJSON } from './storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('retorna o fallback quando a chave não existe', () => {
    expect(readJSON('inexistente', { a: 1 })).toEqual({ a: 1 })
  })

  it('grava e lê JSON', () => {
    writeJSON('k', { n: 42 })
    expect(readJSON('k', null)).toEqual({ n: 42 })
  })

  it('retorna o fallback quando o valor é JSON inválido', () => {
    localStorage.setItem('ruim', '{não-json}')
    expect(readJSON('ruim', 'fallback')).toBe('fallback')
  })
})
