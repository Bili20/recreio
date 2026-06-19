# Recreio — Spec de Design (Fase 2: Sudoku)

**Data:** 2026-06-03 · **Status:** Aprovado
**Escopo:** Sudoku com geração automática de tabuleiros válidos em 3 níveis e validação de jogadas. Conclui a Fase 2.

## Referências
- Mockup `design/sudoku_light.png`; catálogo `componentes.md` §15 (Sudoku: `.sudoku-board`/`.su-cell`, dados fixos em `--text`, jogadas do usuário `.user` em `--accent`, `.sel`/`.peer` destacadas, teclado `.su-pad`).
- Recordes: `records.ts` define `sudoku` → "melhor tempo", menor, formato `m:ss`.

## Comportamento
- Rota `/sudoku`; `ativo: true`.
- **Geração válida:** solução completa por backtracking aleatorizado; remove células até as pistas do nível — **Fácil 40 · Médio 32 · Difícil 26** pistas.
- **Validação:** todo número entra na grade; se ele **repetir** um valor já presente na mesma linha/coluna/caixa (conflito) fica em vermelho (`.erro`) e conta **erro**; **3 erros = fim de jogo (derrota)**. A validação é por conflito (regras do Sudoku), não comparação com a solução escondida — assim um palpite válido (sem repetição) não é marcado como errado.
- Seleciona célula (não-fixa) → `.sel`; relacionadas (mesma linha/coluna/caixa) → `.peer`.
- Teclado numérico na tela (1–9 + apagar) e físico (1–9, Backspace, setas para mover seleção).
- **Preenchido %** = células preenchidas / 81. **Cronômetro** começa ao gerar o tabuleiro, para ao vencer/perder.
- Vitória ao preencher tudo corretamente → grava **melhor tempo** (menor) via `submit('sudoku', segundos)`. Trocar de nível gera novo tabuleiro.

## Layout (fiel ao mockup)
2 colunas (`game-layout cols-2`):
- Esquerda: painel "Tempo" (cronômetro grande `.su-tempo` · Dificuldade · Preenchido % · Erros x/3); painel "Níveis" (chips Fácil/Médio/Difícil).
- Centro (`board-area`): status; **tabuleiro 9×9** `.su-board`/`.su-cell` com bordas reforçadas a cada caixa 3×3; fixas em `--text`, do usuário `.user` em `--accent`, `.sel` (anel `--accent` + `--accent-soft`), `.peer` (`--accent-tint`), `.erro` (vermelho). Abaixo, `.su-pad` (1–9 + apagar).

## Lógica pura testável (`src/games/sudoku/logic.ts`)
- `type Grade = number[][]`, `type Dificuldade = 'facil'|'medio'|'dificil'`.
- `posValido(grid, r, c, val)`, `conflito(...)`, `resolver(grid, rng?)` (backtracking in-place), `gerarSolucao(rng)`, `gerar(dif, rng) → { puzzle, solucao }`, `completo(grid)`, `gradeVazia()`.
- Testado com Vitest (solução válida; conflito; nº de pistas; puzzle ⊆ solução; resolver resolve).

## Arquivos
- Criar: `src/games/sudoku/logic.ts`, `logic.test.ts`, `Sudoku.tsx`.
- Modificar: `src/index.css` (`.su-*`), `src/games/games.ts` (`sudoku.ativo=true`), `src/App.tsx` (rota), `README.md`.

## Critérios de aceite
- Testes e build passam; tsc limpo.
- Tabuleiros gerados são válidos/solúveis; pistas conforme o nível.
- Validação: número entra na grade; conflito (repetição na linha/coluna/caixa) fica vermelho e conta erro; 3 erros → fim; vitória ao completar correto grava melhor tempo (Hub/Placar).
- Seleção/peers/teclado (tela + físico) funcionam. Fiel ao mockup, claro/escuro, 4 acentos, responsivo, pt-BR.
- Card sai de "Em breve" — **Fase 2 concluída** (todos os 6 jogos ativos).
