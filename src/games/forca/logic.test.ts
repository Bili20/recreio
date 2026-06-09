import { describe, it, expect } from 'vitest'
import { normalizar, escolherPalavra, letrasErradas, venceu, perdeu, MAX_ERROS } from './logic'
import { CATEGORIAS } from './palavras'

describe('normalizar', () => {
  it('remove acentos e Ç, deixa maiúsculo', () => {
    expect(normalizar('açaí')).toBe('ACAI')
    expect(normalizar('Limão')).toBe('LIMAO')
  })
})

describe('escolherPalavra', () => {
  it('retorna palavra e categoria válidas do banco', () => {
    const { palavra, categoria } = escolherPalavra(CATEGORIAS, () => 0)
    const cat = CATEGORIAS.find((c) => c.nome === categoria)!
    expect(cat).toBeDefined()
    expect(cat.palavras).toContain(palavra)
  })
})

describe('letrasErradas / venceu / perdeu', () => {
  it('lista só as letras que não estão na palavra', () => {
    expect(letrasErradas('GATO', ['G', 'X', 'O', 'Z'])).toEqual(['X', 'Z'])
  })
  it('venceu quando todas as letras distintas foram tentadas', () => {
    expect(venceu('OVO', ['O', 'V'])).toBe(true)
    expect(venceu('OVO', ['O'])).toBe(false)
  })
  it(`perdeu com ${MAX_ERROS} erros`, () => {
    expect(perdeu('GATO', ['B', 'C', 'D', 'E', 'F', 'H'])).toBe(true)
    expect(perdeu('GATO', ['B', 'C'])).toBe(false)
  })
})
