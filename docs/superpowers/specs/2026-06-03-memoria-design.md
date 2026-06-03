# Recreio — Spec de Design (Fase 2: Jogo da Memória)

**Data:** 2026-06-03
**Status:** Aprovado
**Escopo:** Implementar o **Jogo da Memória** (grid 4×4 ou 6×6, contagem de tentativas/movimentos e cronômetro), reaproveitando a fundação. Sub-projeto independente.

## Referências
- Mockup: `design/memoria.png`.
- Catálogo `componentes.md` §15 — `.mem-card` com estados `.down` (verso em `--accent`), `.up` (virada) e `.matched` (par em `--accent-soft`).
- Recordes: `src/utils/records.ts` já define `memoria` → "melhor tempo", menor é melhor, formato `m:ss`.

## Comportamento
- **Rota** `/memoria` (reservada); `ativo: true` em `games.ts`.
- **Grade 4×4 (8 pares)** ou **6×6 (18 pares)**, trocável por `Chip`s (reinicia o jogo).
- Vira duas cartas: par → ficam `matched`; não-par → desviram após ~750ms (input travado nesse intervalo).
- **Movimentos** = nº de tentativas (cada par de viradas). **Pares** = encontrados / total.
- **Cronômetro** começa na 1ª virada, para ao completar; exibido em `m:ss`.
- Ao completar: status de vitória + botão "Novo jogo".
- **Recorde:** melhor (menor) tempo de conclusão entre quaisquer partidas — `submit('memoria', segundos)`. Exibido no Hub e Placar.

## Layout (fiel ao mockup)
Página de jogo em 2 colunas (`game-layout cols-2`):
- **Painel esquerdo "Tempo":** cronômetro grande (`.mem-tempo`), `Divider`, `StatRow` "Movimentos", "Pares (x / total)", "Recorde". Segundo painel "Tamanho da grade" com `Chip`s 4×4 / 6×6.
- **Centro (`board-area`):** status com ponto; grade `.mem-grid` (`repeat(N,1fr)`), cartas `.mem-card`:
  - `.down` = quadrado sólido `--accent` (marquinha central sutil);
  - `.up` = `--accent-soft` + símbolo em `--accent`;
  - `.matched` = `--accent-soft` + borda `--accent` (permanece).

## Símbolos
Conjunto de **18 formas geométricas** SVG distintas (círculo, quadrado, losango, triângulo, estrela, hexágono, cruz, coração, raio, gota, anel, X, seta, lua, pentágono, asterisco, chevron duplo, alvo) — em `src/games/memoria/simbolos.tsx`. Traço em `currentColor`. 6×6 usa as 18; 4×4 usa as 8 primeiras. Mantém a linguagem geométrica do design.

## Lógica pura testável (`src/games/memoria/logic.ts`)
- `interface Carta { id: number; simbolo: number }`.
- `criarBaralho(pares, rng = Math.random): Carta[]` — `2×pares` cartas (cada símbolo 0..pares-1 duas vezes), embaralhadas.
- `embaralhar<T>(arr, rng): T[]` — Fisher-Yates, não muta o original, rng injetável.
- Testado com Vitest.

## Arquivos
- Criar: `src/games/memoria/logic.ts`, `logic.test.ts`, `simbolos.tsx`, `Memoria.tsx`.
- Modificar: `src/index.css` (classes `.mem-*`, `.mem-grid`, `.mem-tempo`), `src/games/games.ts` (`memoria.ativo = true`), `src/App.tsx` (rota), `README.md`.

## Critérios de aceite
- `npm run test` e `npm run build` passam; tsc limpo.
- Baralho correto (cada símbolo 2×); embaralhamento não perde cartas.
- Match/no-match, contagem de movimentos e pares, cronômetro start/stop corretos.
- Troca de grade reinicia; 4×4 e 6×6 funcionam e são responsivos.
- Concluir grava melhor tempo (menor) no recorde; aparece no Hub e Placar.
- Card sai de "Em breve". Fiel ao `memoria.png` em claro/escuro e nos 4 acentos; pt-BR.

## Fora de escopo
2048, Forca, Sudoku (sub-projetos seguintes).
