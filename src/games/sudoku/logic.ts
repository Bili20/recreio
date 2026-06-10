// Lógica pura do Sudoku — sem React, testável. Grade 9×9, 0 = vazio.

export type Grade = number[][]
export type Dificuldade = 'facil' | 'medio' | 'dificil'

const PISTAS: Record<Dificuldade, number> = { facil: 40, medio: 32, dificil: 26 }

export const gradeVazia = (): Grade => Array.from({ length: 9 }, () => Array(9).fill(0))

const clonar = (g: Grade): Grade => g.map((l) => [...l])

function embaralhar<T>(a: T[], rng: () => number): T[] {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}

// `val` pode ocupar (r,c)? Checa linha, coluna e caixa 3×3, ignorando a própria célula.
export function posValido(grid: Grade, r: number, c: number, val: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (i !== c && grid[r][i] === val) return false
    if (i !== r && grid[i][c] === val) return false
  }
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  for (let i = br; i < br + 3; i++) {
    for (let j = bc; j < bc + 3; j++) {
      if ((i !== r || j !== c) && grid[i][j] === val) return false
    }
  }
  return true
}

export const conflito = (grid: Grade, r: number, c: number, val: number): boolean =>
  !posValido(grid, r, c, val)

// Backtracking in-place. Com rng, embaralha os candidatos (para gerar variedade).
export function resolver(grid: Grade, rng?: () => number): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const base = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const cand = rng ? embaralhar(base, rng) : base
        for (const v of cand) {
          if (posValido(grid, r, c, v)) {
            grid[r][c] = v
            if (resolver(grid, rng)) return true
            grid[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

export function gerarSolucao(rng: () => number = Math.random): Grade {
  const g = gradeVazia()
  resolver(g, rng)
  return g
}

// Conta as soluções de um puzzle por backtracking, cortando ao atingir `limite`.
// Não muta a grade de entrada. Usado para garantir puzzles de solução única.
export function contarSolucoes(grid: Grade, limite = 2): number {
  const g = clonar(grid)
  let achadas = 0
  const busca = (): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === 0) {
          for (let v = 1; v <= 9; v++) {
            if (posValido(g, r, c, v)) {
              g[r][c] = v
              if (busca()) return true // atingiu o limite — corta
              g[r][c] = 0
            }
          }
          return false
        }
      }
    }
    achadas++
    return achadas >= limite
  }
  busca()
  return achadas
}

// Gera puzzle + solução. Remove células aleatórias até as pistas do nível, mas só
// quando a remoção preserva a UNICIDADE da solução — sem isso, um número válido de
// outra solução possível seria injustamente marcado como erro durante o jogo.
export function gerar(dif: Dificuldade, rng: () => number = Math.random): { puzzle: Grade; solucao: Grade } {
  const solucao = gerarSolucao(rng)
  const puzzle = clonar(solucao)
  let remover = 81 - PISTAS[dif]
  const posicoes = embaralhar(Array.from({ length: 81 }, (_, i) => i), rng)
  for (const p of posicoes) {
    if (remover <= 0) break
    const r = Math.floor(p / 9)
    const c = p % 9
    if (puzzle[r][c] === 0) continue
    const guardado = puzzle[r][c]
    puzzle[r][c] = 0
    if (contarSolucoes(puzzle) > 1) {
      puzzle[r][c] = guardado // remoção quebraria a unicidade — desfaz
    } else {
      remover--
    }
  }
  return { puzzle, solucao }
}

export const completo = (grid: Grade): boolean => grid.every((l) => l.every((v) => v !== 0))
