// Lógica pura do Jogo da Memória — sem React, testável.

export interface Carta {
  id: number
  simbolo: number
}

// Fisher-Yates; não muta o original; rng injetável para teste.
export function embaralhar<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Baralho com `pares` símbolos (0..pares-1), cada um em duas cartas, embaralhado.
export function criarBaralho(pares: number, rng: () => number = Math.random): Carta[] {
  const cartas: Carta[] = []
  for (let s = 0; s < pares; s++) {
    cartas.push({ id: cartas.length, simbolo: s })
    cartas.push({ id: cartas.length, simbolo: s })
  }
  return embaralhar(cartas, rng)
}
