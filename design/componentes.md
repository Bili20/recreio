# Recreio — Componentes Reutilizáveis

Catálogo dos blocos de interface do portal, com suas variantes e estados. Todos consomem os tokens de `design-tokens.md`, então mudam de tema e cor de destaque automaticamente. Componentes de “chrome” (cabeçalho e rodapé) são injetados por `portal.js`; o restante é HTML + classes de `styles.css`.

---

## 1. Cabeçalho (`.topbar`)
Barra fixa no topo, com fundo translúcido e desfoque (`backdrop-filter`), borda inferior de `--border`. Injetada por `portal.js` conforme o atributo `data-page` do `<body>`.

**Variantes (por `data-page`):**
- **Hub** (`data-page="hub"`) — logo *Recreio* à esquerda; à direita: seletor de acento, link **Placar global** e botão de tema. Usada no hub, no placar e no guia.
- **Jogo** (`data-page="game"`) — botão **voltar** (ícone) à esquerda, **título do jogo centralizado** (lido de `data-title`), e à direita seletor de acento + botão de tema. Sem link de placar.

**Estados:** sticky ao rolar; o link e os botões herdam os estados dos seus próprios componentes.

---

## 2. Marca / logo (`.brand` + `.mark`)
Nome “Recreio” em Space Grotesk 700 ao lado de um **selo geométrico** (`.mark`): quadrado arredondado em `--accent` com um círculo e um quadradinho em `--accent-fg` (pseudo-elementos). Acompanha a cor de destaque. Em telas pequenas no modo jogo, exibe só o selo.

---

## 3. Botão de tema (`.icon-btn[data-theme-toggle]`)
Botão-ícone circular que alterna claro/escuro. O ícone troca entre **lua** (quando claro) e **sol** (quando escuro), via `portal.js`, que também atualiza `aria-label` e persiste a escolha.

**Estados:** repouso (borda `--border`, fundo `--surface`); hover (`--surface-2` + `--border-strong`); ativo (`scale(0.92)`).
*Mesma base `.icon-btn` é usada pelo botão **voltar** e por botões “+”.*

---

## 4. Seletor de acento (`.accent-picker` + `.accent-dot`)
Grupo de 4 bolinhas (Índigo, Verde-água, Laranja, Rosa) dentro de uma cápsula. Clicar define `data-accent` e persiste. Oculto em telas muito pequenas (`.hide-mobile`).

**Estados:** repouso; hover (`scale(1.18)`); **selecionado** (`aria-pressed="true"` → anel com a cor `--text`).

---

## 5. Botão (`.btn`)
Botão pill em Space Grotesk 600. Padding controlado por `--pad-y`/`--pad-x`.

**Variantes:**
- `.btn-primary` — fundo `--accent`, texto `--accent-fg`, sombra `sm`. Ação principal.
- `.btn-ghost` — fundo `--surface`, borda `--border`. Ação secundária.
- `.btn-soft` — fundo `--accent-soft`, texto `--accent-strong`. Ação de apoio (ex.: “Dica”).
- `.btn-sm` — modificador de tamanho compacto.

**Estados:** hover (primário escurece p/ `--accent-strong` + sombra; ghost reforça borda; soft intensifica fundo); ativo (`translateY(1px) scale(0.985)`).

---

## 6. Card de jogo (`.game-card`)
Card clicável do hub. Estrutura: **topo** com thumb (`.game-thumb`, quadrado arredondado em `--accent-soft` com ícone geométrico) + seta (`.game-arrow`); **título** (`h3`) e **descrição** de uma linha; **rodapé** (`.record`) com rótulo e valor do recorde, separado por borda superior.

**Estados:**
- Repouso — superfície branca, borda sutil.
- **Hover** — sobe `translateY(-5px)`, ganha `--shadow-lg`, **anel interno** em `--accent`, e a seta desliza/colore.
- **Sem recorde** (`.record.empty`) — valor em `--faint`, peso normal.

---

## 7. Painel lateral (`.panel`)
Caixa de superfície usada nas laterais das páginas de jogo (placar, recorde, ações). Cabeçalho `h4` em maiúsculas/`--faint`. Componentes internos:
- **`.stat-row`** — par rótulo (`.k`) + valor (`.v` em Space Grotesk).
- **`.stat-big`** — número grande com `small` de rótulo acima (ex.: recorde, tempo).
- **`.panel-actions`** — coluna de botões em largura cheia.
- **`.divider`** — linha separadora `1px`.

Containers `.panel-side-left` / `.panel-side-right` controlam o reflow responsivo (viram grades de 2 colunas no tablet/mobile).

---

## 8. Área de tabuleiro (`.board-area`) + status (`.board-status`)
Superfície central, centralizada, altura mínima ~420px, que abriga o tabuleiro de cada jogo. O **`.board-status`** é a linha de estado acima do tabuleiro: um **ponto** (`.dot`, em `--accent` com halo `--accent-soft`) + texto em Space Grotesk (ex.: “Sua vez”, “Você venceu!”).

---

## 9. Pílula / badge (`.pill`)
Etiqueta pequena, não interativa, em pill.
- `.pill-accent` — fundo `--accent-soft`, texto `--accent-strong` (marcadores X/O, dificuldade ativa, sequência).
- `.pill-muted` — fundo `--surface-2`, borda `--border`, texto `--muted` (opções inativas, letras erradas).

---

## 10. Chip de filtro (`.chip`)
Botão pill usado nos filtros do placar e em seletores de dificuldade/grade.

**Estados:** repouso (borda `--border`); hover (`--border-strong`); **ativo** (`aria-pressed="true"` → fundo `--accent`, texto `--accent-fg`).

---

## 11. Campos de formulário (`.input`, `.select`, `.field`)
- **`.input` / `.select`** — raio `--r-sm`, borda `--border-strong`, fundo `--surface`.
- **`.field`** — wrapper coluna com `label` (Space Grotesk, `--muted`) acima do controle.

**Estados:** placeholder em `--faint`; **foco** → borda `--accent` + halo `box-shadow 0 0 0 3px var(--accent-soft)`.

---

## 12. Tabela de placar (`.score-table`)
Tabela de recordes com cantos arredondados e cabeçalho em `--surface-2`.
- **`.score-game`** — célula com **`.score-mini`** (ícone do jogo em quadrado `--accent-soft`) + nome.
- **`.score-value`** — valor do recorde em destaque (Space Grotesk 700).
- **`.score-rank`** — posição numerada em `--faint`.
- Colunas `.hide-sm` somem no mobile (a tabela vira lista, sem cabeçalho).

**Estado:** hover de linha → fundo `--accent-tint`.

---

## 13. Cartões de resumo (`.summary-card`)
Usados no topo do placar: número grande (Space Grotesk 700) + rótulo em `--muted`. Grade de 3 → 1 coluna no mobile.

---

## 14. Rodapé (`.site-footer`)
Injetado por `portal.js` em todas as páginas **exceto** as de jogo. Texto-assinatura à esquerda + links (Início, Placar, Guia). Links em `--muted` → `--accent` no hover.

---

## 15. Tabuleiros específicos de jogo
Componentes próprios de cada jogo, todos montados sobre `.board-area` e os tokens de cor:
- **Velha** (`.ttt-board`/`.ttt-cell`) — grade 3×3; X em `--accent`, O em `--muted`; célula vencedora `.win` em `--accent-soft`.
- **Sudoku** (`.sudoku-board`/`.su-cell`) — 9 caixas 3×3; dados fixos em `--text`, jogadas do usuário `.user` em `--accent`; `.sel` (selecionada) e `.peer` (relacionadas) destacadas; teclado `.su-pad`.
- **Pedra-Papel-Tesoura** (`.rps-*`) — dois tokens grandes em confronto (`.win` colore o vencedor), botões de escolha (`.rps-choice`, com `.active`) e marcador “melhor de 5” (`.bo5` com `.win`/`.loss`).
- **Memória** (`.mem-card`) — estados `.down` (verso em `--accent`), `.up` (virada) e `.matched` (par encontrado em `--accent-soft`).
- **2048** (`.g2048`/`.tile`) — blocos cuja intensidade do `--accent` cresce com o valor (via `color-mix`); `.tile.empty` para casas vazias.
- **Forca** (`.hm-*`, `.keyboard`/`.key`) — palavra em `.hm-slot` (com `.blank`), boneco em SVG (partes em `--accent`), teclado com teclas `.hit` (acerto) e `.miss` (erro, riscada).
