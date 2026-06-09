# Recreio — Spec de Design (Fase 2: Jogo da Forca)

**Data:** 2026-06-03 · **Status:** Aprovado
**Escopo:** Jogo da Forca com banco de ≥50 palavras em categorias e boneco progressivo, reaproveitando a fundação.

## Referências
- Mockup `design/forca.png`; catálogo `componentes.md` §15 (Forca: `.hm-slot`/`.blank`, boneco SVG em `--accent`, teclado `.key` com `.hit`/`.miss`).
- Recordes: `records.ts` define `forca` → "aproveitamento", maior, formato `${v}%`.

## Comportamento
- Rota `/forca`; `ativo: true`.
- Banco de **60 palavras sem acento (A–Z), em 5 categorias** (Animais, Frutas, Países, Objetos, Profissões) em `src/games/forca/palavras.ts`.
- Sorteia palavra + categoria. Jogador tenta letras (teclado na tela A–Z ou teclado físico). **6 erros** completam o boneco = derrota; revelar todas as letras = vitória.
- "Pedir dica": revela 1 letra ainda oculta (1× por palavra).
- "Nova palavra": sorteia outra (conta a partida atual se ainda não contada).

## Layout (fiel ao mockup)
2 colunas (`game-layout cols-2`):
- Esquerda: painel "Rodada" (Categoria · Erros x/6 · Letras certas x/total); painel "Letras erradas" (pills `pill-muted`); painel "Aproveitamento" (`.hm-apro` grande, %); painel "Ações" (Pedir dica `btn-soft` · Nova palavra `btn-primary`).
- Centro (`board-area`): status; **forca SVG com boneco progressivo** (6 partes em `--accent` por nº de erros; forca em `--text`); palavra em `.hm-word`/`.hm-slot` (traço; letra revelada quando tentada/dica); **teclado** `.keyboard`/`.key` (`.hit` acerto, `.miss` erro riscado, desabilitada se já usada/fim).

## Lógica pura testável (`src/games/forca/logic.ts`)
- `MAX_ERROS = 6`, `ALFABETO` (A–Z).
- `normalizar(s)` (maiúsculas, sem acento, Ç→C).
- `escolherPalavra(categorias, rng)` → `{ palavra, categoria }`.
- `letrasErradas(palavra, tentadas)`, `venceu(palavra, tentadas)`, `perdeu(palavra, tentadas)`.
- Testado com Vitest.

## Recorde (aproveitamento %)
- Forca mantém contadores próprios `{ vitorias, partidas }` em `localStorage` (`recreio-forca`, via `useLocalStorage`).
- Ao fim de cada partida: atualiza contadores e **espelha** `aproveitamento = round(vitorias/partidas*100)` no sistema de recordes via novo helper **`definirRecorde(id, valor, plays?)`** (define o valor diretamente — métrica de "valor atual", não máximo) + `useRecords().definir`. Hub/Placar exibem o % real.

## Arquivos
- Criar: `src/games/forca/palavras.ts`, `logic.ts`, `logic.test.ts`, `Forca.tsx`.
- Modificar: `src/utils/records.ts` (+`definirRecorde`, +teste), `src/hooks/useRecords.ts` (+`definir`), `src/index.css` (`.hm-*`, `.keyboard`/`.key`, `.hm-apro`), `src/games/games.ts` (`forca.ativo=true`), `src/App.tsx` (rota), `README.md`.

## Critérios de aceite
- Testes e build passam; tsc limpo.
- 60 palavras em 5 categorias; A–Z; sorteio funciona.
- Acertos revelam letras; 6 erros → boneco completo → derrota; vitória ao revelar tudo; dica revela 1 letra (1×).
- Aproveitamento calculado e exibido (painel, Hub, Placar) refletindo vitórias/partidas reais.
- Teclado físico e na tela; `.hit`/`.miss` corretos. Fiel ao mockup, claro/escuro, 4 acentos, responsivo, pt-BR.

## Fora de escopo
Sudoku (próximo sub-projeto).
