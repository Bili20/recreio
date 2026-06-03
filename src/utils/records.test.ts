import { describe, it, expect, beforeEach } from 'vitest'
import { submitRecord, loadRecords, RECORD_DEFS } from './records'

describe('records', () => {
  beforeEach(() => localStorage.clear())

  it('grava o primeiro resultado como recorde', () => {
    const recs = submitRecord('velha', 3)
    expect(recs.velha?.value).toBe(3)
    expect(recs.velha?.updatedAt).toBeTypeOf('number')
  })

  it('só substitui quando o novo resultado é melhor (maior é melhor na velha)', () => {
    submitRecord('velha', 5)
    const recs = submitRecord('velha', 2)
    expect(recs.velha?.value).toBe(5) // 2 não supera 5
  })

  it('para métrica "menor é melhor", tempo menor vence', () => {
    expect(RECORD_DEFS.memoria.melhor).toBe('menor')
    submitRecord('memoria', 90)
    const recs = submitRecord('memoria', 40)
    expect(recs.memoria?.value).toBe(40)
  })

  it('loadRecords devolve {} quando vazio', () => {
    expect(loadRecords()).toEqual({})
  })

  it('formata o valor conforme a definição do jogo', () => {
    expect(RECORD_DEFS.velha.format(12)).toBe('12 vitórias seguidas')
    expect(RECORD_DEFS.memoria.format(75)).toBe('1:15')
  })
})
