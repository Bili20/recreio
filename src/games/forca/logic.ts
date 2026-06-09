import type { Categoria } from './palavras'

export const MAX_ERROS = 6
export const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Maiúsculas, sem acentos, Ç→C.
export function normalizar(s: string): string {
  return s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Ç/g, 'C')
}

export interface PalavraSorteada {
  palavra: string
  categoria: string
}

// Sorteia uma categoria e uma palavra dela (rng injetável para teste).
export function escolherPalavra(categorias: Categoria[], rng: () => number = Math.random): PalavraSorteada {
  const cat = categorias[Math.floor(rng() * categorias.length)]
  const palavra = cat.palavras[Math.floor(rng() * cat.palavras.length)]
  return { palavra: normalizar(palavra), categoria: cat.nome }
}

export const letrasErradas = (palavra: string, tentadas: string[]): string[] =>
  tentadas.filter((l) => !palavra.includes(l))

export const venceu = (palavra: string, tentadas: string[]): boolean =>
  [...new Set(palavra.split(''))].every((l) => tentadas.includes(l))

export const perdeu = (palavra: string, tentadas: string[]): boolean =>
  letrasErradas(palavra, tentadas).length >= MAX_ERROS
