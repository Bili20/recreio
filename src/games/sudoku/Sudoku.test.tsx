import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Sudoku from './Sudoku'

// Tabuleiro fixo para tornar o teste determinístico (gerar usa Math.random).
// Em (0,0) a solução é 5, mas 3 também NÃO conflita com a linha/coluna/caixa
// (porque (0,1) e (8,0) ficam vazios) — é um palpite válido do jogador.
vi.mock('./logic', async (importActual) => {
  const actual = await importActual<typeof import('./logic')>()
  const solucao = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]
  const puzzle = solucao.map((l) => [...l])
  puzzle[0][0] = 0; puzzle[0][1] = 0; puzzle[8][0] = 0
  return { ...actual, gerar: () => ({ puzzle, solucao }) }
})

describe('Sudoku — validação por conflito (regressão)', () => {
  // Antes da correção a validação comparava com a solução escondida e marcava como
  // erro qualquer número diferente dela, mesmo sem repetição na linha/coluna/caixa.
  it('NÃO marca erro num número válido que difere da solução (sem conflito)', () => {
    const { container } = render(<Sudoku />)
    const cells = () => container.querySelectorAll<HTMLElement>('.su-cell')
    const pad = container.querySelectorAll<HTMLElement>('.su-pad .su-key')

    fireEvent.click(cells()[0]) // seleciona (0,0) — solução = 5
    fireEvent.click(pad[2])     // digita 3 — não repete nada na linha/coluna/caixa

    expect(cells()[0].textContent).toBe('3')
    expect(cells()[0].classList.contains('erro')).toBe(false)
  })

  it('marca erro num número que repete outro na linha/coluna/caixa', () => {
    const { container } = render(<Sudoku />)
    const cells = () => container.querySelectorAll<HTMLElement>('.su-cell')
    const pad = container.querySelectorAll<HTMLElement>('.su-pad .su-key')

    fireEvent.click(cells()[0]) // (0,0)
    fireEvent.click(pad[3])     // digita 4 — já existe em (0,2), mesma linha

    expect(cells()[0].textContent).toBe('4')
    expect(cells()[0].classList.contains('erro')).toBe(true)
  })
})
