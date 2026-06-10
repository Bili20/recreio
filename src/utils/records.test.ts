import { describe, it, expect, beforeEach } from 'vitest'
import { submitRecord, incrementPlays, loadRecords, hasRecord, RECORD_DEFS, definirRecorde } from './records'

describe('records', () => {
  beforeEach(() => localStorage.clear())

  it('grava o primeiro resultado como recorde e sinaliza novoRecorde', () => {
    const { state, novoRecorde } = submitRecord('velha', 3)
    expect(state.velha?.value).toBe(3)
    expect(state.velha?.updatedAt).toBeTypeOf('number')
    expect(novoRecorde).toBe(true)
  })

  it('grava o recorde mesmo após uma derrota/empate prévia (sentinela sem recorde)', () => {
    incrementPlays('velha') // derrota: registra partida, ainda sem recorde
    expect(hasRecord(loadRecords().velha)).toBe(false)
    const { state } = submitRecord('velha', 2) // primeira vitória
    expect(state.velha?.value).toBe(2)
    expect(state.velha?.plays).toBe(2)
    expect(hasRecord(state.velha)).toBe(true)
  })

  it('sentinela "sem recorde" sobrevive ao ciclo JSON do localStorage', () => {
    incrementPlays('memoria')
    const recarregado = loadRecords() // relê via JSON.parse
    expect(hasRecord(recarregado.memoria)).toBe(false)
    expect(recarregado.memoria?.plays).toBe(1)
  })

  it('só substitui quando o novo resultado é melhor (maior é melhor na velha)', () => {
    submitRecord('velha', 5)
    const { state, novoRecorde } = submitRecord('velha', 2)
    expect(state.velha?.value).toBe(5) // 2 não supera 5
    expect(novoRecorde).toBe(false)
  })

  it('para métrica "menor é melhor", tempo menor vence', () => {
    expect(RECORD_DEFS.memoria.melhor).toBe('menor')
    submitRecord('memoria', 90)
    const { state, novoRecorde } = submitRecord('memoria', 40)
    expect(state.memoria?.value).toBe(40)
    expect(novoRecorde).toBe(true)
  })

  it('loadRecords devolve {} quando vazio', () => {
    expect(loadRecords()).toEqual({})
  })

  it('formata o valor conforme a definição do jogo', () => {
    expect(RECORD_DEFS.velha.format(12)).toBe('12 vitórias seguidas')
    expect(RECORD_DEFS.memoria.format(75)).toBe('1:15')
  })

  it('definirRecorde grava o valor exato (não usa "maior é melhor")', () => {
    definirRecorde('forca', 90, 10)
    const recs = definirRecorde('forca', 80, 11) // menor, mas deve sobrescrever
    expect(recs.forca?.value).toBe(80)
    expect(recs.forca?.plays).toBe(11)
  })
})
