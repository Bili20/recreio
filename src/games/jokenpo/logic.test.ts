import { describe, it, expect } from 'vitest'
import { resultado, frase, jogadaCpu, serieEncerrada, ALVO, JOGADAS } from './logic'

describe('resultado', () => {
  it('pedra vence tesoura', () => expect(resultado('pedra', 'tesoura')).toBe('vitoria'))
  it('tesoura vence papel', () => expect(resultado('tesoura', 'papel')).toBe('vitoria'))
  it('papel vence pedra', () => expect(resultado('papel', 'pedra')).toBe('vitoria'))
  it('perde no caso inverso', () => expect(resultado('tesoura', 'pedra')).toBe('derrota'))
  it('empata com jogadas iguais', () => expect(resultado('papel', 'papel')).toBe('empate'))
})

describe('frase', () => {
  it('descreve a vitória do jogador', () => expect(frase('papel', 'pedra')).toBe('Papel cobre pedra'))
  it('descreve quando a CPU vence', () => expect(frase('papel', 'tesoura')).toBe('Tesoura corta papel'))
  it('texto de empate', () => expect(frase('pedra', 'pedra')).toMatch(/empate/i))
})

describe('jogadaCpu', () => {
  it('usa o rng injetado de forma determinística', () => {
    expect(jogadaCpu(() => 0)).toBe(JOGADAS[0])
    expect(jogadaCpu(() => 0.99)).toBe(JOGADAS[2])
  })
})

describe('serieEncerrada', () => {
  it(`encerra quando alguém chega a ${ALVO}`, () => {
    expect(serieEncerrada(3, 1)).toBe(true)
    expect(serieEncerrada(2, 2)).toBe(false)
  })
})
