import { describe, it, expect } from 'vitest'
import {
  vencedor, jogadasValidas, tabuleiroCheio, escolherJogada,
  type Tabuleiro, type Marca,
} from './logic'

const T = (s: string): Tabuleiro =>
  s.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O')))

describe('vencedor', () => {
  it('detecta linha horizontal', () => {
    expect(vencedor(T('XXX' + 'OO.' + '...'))?.jogador).toBe('X')
  })
  it('detecta diagonal', () => {
    expect(vencedor(T('X.O' + '.X.' + 'O.X'))?.jogador).toBe('X')
  })
  it('retorna null quando não há vencedor', () => {
    expect(vencedor(T('XO.' + '.X.' + '..O'))).toBeNull()
  })
  it('expõe os índices da linha vencedora', () => {
    expect(vencedor(T('XXX' + '...' + '...'))?.linha).toEqual([0, 1, 2])
  })
})

describe('jogadasValidas', () => {
  it('lista as casas vazias', () => {
    expect(jogadasValidas(T('XO.' + '...' + '...'))).toEqual([2, 3, 4, 5, 6, 7, 8])
  })
})

describe('escolherJogada (difícil/minimax)', () => {
  it('vence quando tem a jogada vencedora', () => {
    expect(escolherJogada(T('OO.' + 'XX.' + '...'), 'O', 'dificil')).toBe(2)
  })
  it('bloqueia a vitória do oponente', () => {
    expect(escolherJogada(T('XX.' + 'O..' + '...'), 'O', 'dificil')).toBe(2)
  })
  it('devolve uma jogada para o tabuleiro vazio', () => {
    expect(typeof escolherJogada(T('.........'), 'X', 'dificil')).toBe('number')
  })
})

describe('escolherJogada (médio/defensivo)', () => {
  it('bloqueia ameaça imediata', () => {
    expect(escolherJogada(T('XX.' + '...' + 'O..'), 'O', 'medio')).toBe(2)
  })
  it('vence se possível em vez de bloquear', () => {
    expect(escolherJogada(T('OO.' + 'XX.' + '...'), 'O', 'medio')).toBe(2)
  })
})

describe('escolherJogada (fácil)', () => {
  it('devolve uma jogada válida', () => {
    const m = escolherJogada(T('X........'), 'O', 'facil')
    expect(jogadasValidas(T('X........'))).toContain(m)
  })
})

describe('minimax é imbatível', () => {
  it('O (minimax) nunca perde para um oponente aleatório em 50 partidas', () => {
    for (let p = 0; p < 50; p++) {
      let t: Tabuleiro = Array(9).fill(null)
      let vez: Marca = 'X' // oponente aleatório começa
      while (!vencedor(t) && !tabuleiroCheio(t)) {
        const i = vez === 'X'
          ? escolherJogada(t, 'X', 'facil')   // aleatório
          : escolherJogada(t, 'O', 'dificil') // minimax
        t = t.map((c, idx) => (idx === i ? vez : c))
        vez = vez === 'X' ? 'O' : 'X'
      }
      expect(vencedor(t)?.jogador).not.toBe('X')
    }
  })
})
