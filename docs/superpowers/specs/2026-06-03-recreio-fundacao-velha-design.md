# Recreio — Spec de Design (Fase 1: Fundação + Jogo da Velha)

**Data:** 2026-06-03
**Status:** Aprovado
**Escopo:** Fundação do portal (build, tokens, chrome, tema/acento, recordes, hub, placar global) + Jogo da Velha como vertical slice. Os outros 5 jogos são Fase 2 (cada um com seu próprio spec→plano, reaproveitando esta fundação).

## Referências obrigatórias
- `design/design-tokens.md` — paleta (claro/escuro, 4 acentos), tipografia, escala, espaçamentos, raios, sombras, movimento.
- `design/componentes.md` — catálogo de componentes reutilizáveis, variantes e estados.
- Mockups: `design/hub_light.png`, `design/hub_dark_teal.png`, `design/velha_light.png`, `design/placar.png`, `design/g2048.png` (e demais por jogo na Fase 2).

> Nota: nomes reais diferem do briefing inicial — `componentes.md` (não `components.md`); mockups são `hub_light.png`/`velha_light.png`/`placar.png` etc. (não `hub.png`/`pagina-jogo.png`).

## Decisões
1. **Stack:** React 19 + Vite + Tailwind v4 (`@tailwindcss/vite`, já scaffolded) + TypeScript + React Router. Sem backend; persistência em `localStorage`. Roda com `npm install` + `npm run dev`.
   - Conflito resolvido: os docs descrevem arquitetura vanilla (`portal.js`/`styles.css`/páginas HTML), mas seguimos React conforme scaffold. O **sistema de tokens (variáveis CSS) é honrado integralmente** — só muda o veículo (React em vez de páginas HTML).
2. **Entrega:** incremental com checkpoints. Fase 1 = esta spec. Fase 2 = 5 jogos restantes.

## Sistema de tokens (fidelidade)
Todos os tokens são **variáveis CSS** em `src/index.css`:
- Neutros em `:root` (claro) e `[data-theme="dark"]` — OKLCH, matiz 265, croma ≤ 0.012.
- Acentos em `[data-accent="indigo|teal|orange|rose"]`: `--accent`, `--accent-strong`; `--accent-soft`/`--accent-tint` via `color-mix` (ratios diferentes por tema).
- Tipografia: Space Grotesk (display) + Inter (corpo) via Google Fonts; escala `--t-hero..--t-xs`; regras de eyebrow (uppercase, letter-spacing 0.14em), line-heights, `text-wrap`.
- Layout: `--maxw: 1180px`, `--gap: 24px`, padding `.wrap` `clamp(18px,4vw,40px)`.
- Raios `--r-sm/--r/--r-lg/--r-pill`; sombras `--shadow-sm/--shadow/--shadow-lg` (densas no escuro); movimento (transições de tema 0.4s, micro 0.15–0.22s, hover de card `-5px`, `.reveal`).
- `@theme` do Tailwind v4 mapeia tokens → utilitários (`bg-surface`, `text-muted`, `rounded-lg`…). **Proibido valor hardcoded**; tudo resolve para `var(--token)`.
- Breakpoints: >1024 (3 col), ≤1024 (2 col), ≤768 (jogo em coluna única), ≤600 (1 col, `.hide-mobile`/`.hide-sm`).

## Componentes (mapeamento 1:1 com componentes.md)
Cada entrada do catálogo é um componente React isolado renderizando a classe documentada:
`Header` (.topbar, variantes hub/jogo) · `Brand` (.brand/.mark) · `ThemeToggle` (.icon-btn[data-theme-toggle], lua/sol) · `AccentPicker` (.accent-picker/.accent-dot) · `Button` (.btn + primary/ghost/soft/sm) · `GameCard` (.game-card + thumb/arrow/record, estado empty) · `Panel` (.panel + `StatRow`/`StatBig`/`PanelActions`/`Divider`, containers side-left/right) · `BoardArea` (.board-area + `BoardStatus` com .dot) · `Pill` (.pill-accent/.pill-muted) · `Chip` (.chip, estado aria-pressed) · `Field`/`Input`/`Select` (.field/.input/.select, foco com halo) · `ScoreTable` (.score-table + score-mini/value/rank, colunas .hide-sm) · `SummaryCard` (.summary-card) · `Footer` (.site-footer) · `Layout` (orquestra header/footer por rota).

## Estrutura de pastas
```
src/
  main.tsx            # ReactDOM + Router
  App.tsx             # definição de rotas dentro do Layout
  index.css           # @import tailwindcss; @theme; tokens; classes de componente
  components/         # um arquivo por entrada do catálogo (acima)
  hooks/
    useLocalStorage.ts  # genérico, com sync
    useTheme.ts         # data-theme + recreio-theme; default = prefers-color-scheme
    useAccent.ts        # data-accent + recreio-accent; default = indigo
    useRecords.ts       # leitura/escrita de recreio-records + agregação
  utils/
    storage.ts          # helpers localStorage (get/set JSON seguro)
    records.ts          # metadados por jogo (rótulo, métrica, formatação, melhor=maior|menor)
  pages/
    Hub.tsx             # hero + stat line + grade de game-cards
    Placar.tsx          # summary-cards + chips de filtro + score-table
  games/velha/
    JogoDaVelha.tsx     # UI/estado da página do jogo
    logic.ts            # tabuleiro, detecção de vitória, jogadas, IA (random/defensiva/minimax)
  data/                 # reservado para Fase 2
```

## Rotas & chrome
React Router. `Layout` escolhe a variante de cabeçalho pela rota:
- **Hub** (`/`, `/placar`): logo + AccentPicker + link "Placar global" + ThemeToggle; com Footer.
- **Jogo** (`/velha`, e Fase 2): botão voltar + título centralizado (via prop/route) + AccentPicker + ThemeToggle; sem Footer.

Rotas Fase 1: `/` (Hub), `/placar` (Placar), `/velha`. Reservadas Fase 2: `/jokenpo`, `/memoria`, `/2048`, `/forca`, `/sudoku`.

## Tema, acento e recordes
- `useTheme`: aplica `document.documentElement.dataset.theme`, persiste `recreio-theme`. Sem valor salvo → `matchMedia('(prefers-color-scheme: dark)')`.
- `useAccent`: aplica `data-accent`, persiste `recreio-accent`, default `indigo`.
- `useRecords` + `utils/records.ts`: chave única `recreio-records` (objeto por jogo: `{ value, updatedAt, meta }`). `records.ts` define por jogo: nome exibido, rótulo da métrica, formatação, comparador (maior/menor é melhor) e função de "submeter resultado" (só grava se bate o recorde). Também contabiliza `partidas jogadas` por jogo para o resumo do Placar.
- **Placar global** (`/placar`): `SummaryCard`s (jogos com recorde · partidas jogadas · tempo de recreio quando aplicável), `Chip`s de filtro (Todos/por jogo) e `ScoreTable` ordenada. Exibe **dados reais persistidos** (zerados/vazios no início) — os números do mockup (312/28h) são apenas ilustrativos.

## Jogo da Velha (vertical slice)
Define o padrão de página de jogo, integração de recordes e responsividade para todos os jogos.

- **Modos:** 2 jogadores no mesmo dispositivo · vs IA.
- **IA (3 níveis), em `logic.ts`:**
  - *Fácil* — jogada aleatória entre as válidas.
  - *Médio* — defensiva: vence se houver jogada vencedora; senão bloqueia ameaça do oponente; senão prioriza centro > cantos > lados.
  - *Difícil* — **minimax** completo (com poda/curto-circuito), imbatível.
- **Lógica isolada e testável:** representação do tabuleiro, `vencedor()` (8 linhas), `jogadasValidas()`, `minimax()`, seletor de jogada por nível.
- **UI fiel a `velha_light.png`:**
  - Painel esquerdo: "PLACAR DA RODADA" (`StatRow` Você/X, CPU/O, Empates com `Pill`) + bloco "DIFICULDADE" com `Chip`s (Fácil/Médio/Difícil) + seletor de modo (2 jogadores / vs CPU).
  - Centro: `BoardArea` com `BoardStatus` (ponto + texto: "Sua vez", "Vez do O", "Você venceu a rodada!", "Empate!"); `.ttt-board` 3×3, X em `--accent`, O em `--muted`, células vencedoras `.win` em `--accent-soft`.
  - Painel direito: `PanelActions` (Nova rodada · Reiniciar placar).
  - Responsivo: 3 col >1024; painel direito reflui ≤1024; coluna única ≤768; 1 col ≤600.
- **Recorde:** maior sequência de vitórias contra a CPU → métrica "vitórias seguidas" (maior é melhor). Incrementa partidas jogadas a cada rodada concluída.

## Idioma
Tudo em pt-BR: nomes de jogos, textos de UI, mensagens.

## Critérios de aceite (Fase 1)
- `npm install && npm run dev` sobe a app; build (`npm run build`) passa.
- Hub, Placar e Velha renderizam fiéis aos mockups em claro/escuro e nos 4 acentos.
- Alternância de tema/acento persiste em `localStorage` e sobrevive a reload.
- Velha: 2 jogadores e IA nos 3 níveis funcionam; Difícil é imbatível; vitórias/empates/placar corretos; recorde de sequência grava e aparece no hub e no Placar.
- Nenhum valor de cor/raio/sombra/tipografia hardcoded fora de `index.css`.
- Responsivo nos 4 breakpoints sem quebra de layout.

## Fora de escopo (Fase 2)
Pedra-Papel-Tesoura, Memória, 2048, Forca, Sudoku — cada um com spec→plano próprio, reusando chrome/componentes/hooks/records desta fase.
