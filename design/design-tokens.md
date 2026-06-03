# Recreio — Design Tokens

Todos os tokens são definidos como **variáveis CSS** em `styles.css`. As cores neutras e de profundidade trocam conforme o atributo `data-theme` (`light` / `dark`) no `<html>`; as cores de destaque trocam conforme `data-accent` (`indigo` / `teal` / `orange` / `rose`). Ambos persistem em `localStorage` (`recreio-theme`, `recreio-accent`).

---

## 1. Cores

As cores são escritas em **OKLCH** (`oklch(L C H)`): L = luminosidade (0–1), C = croma, H = matiz. Tons derivados (`--accent-soft`, `--accent-tint`) usam `color-mix`, então acompanham automaticamente o destaque e o tema ativos.

### 1.1 Neutros — Modo claro
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `oklch(0.985 0.003 265)` | Fundo da página |
| `--bg-2` | `oklch(0.965 0.004 265)` | Fundo alternativo / faixas |
| `--surface` | `oklch(1 0 0)` | Superfície de cards e painéis |
| `--surface-2` | `oklch(0.975 0.004 265)` | Superfície recuada (células, inputs internos) |
| `--text` | `oklch(0.24 0.012 265)` | Texto principal |
| `--muted` | `oklch(0.52 0.012 265)` | Texto secundário |
| `--faint` | `oklch(0.68 0.01 265)` | Texto terciário / rótulos |
| `--border` | `oklch(0.915 0.005 265)` | Bordas padrão |
| `--border-strong` | `oklch(0.86 0.006 265)` | Bordas em destaque / hover |

### 1.2 Neutros — Modo escuro
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `oklch(0.165 0.008 265)` | Fundo da página |
| `--bg-2` | `oklch(0.195 0.009 265)` | Fundo alternativo / faixas |
| `--surface` | `oklch(0.213 0.011 265)` | Superfície de cards e painéis |
| `--surface-2` | `oklch(0.247 0.012 265)` | Superfície recuada |
| `--text` | `oklch(0.96 0.004 265)` | Texto principal |
| `--muted` | `oklch(0.7 0.012 265)` | Texto secundário |
| `--faint` | `oklch(0.52 0.01 265)` | Texto terciário / rótulos |
| `--border` | `oklch(0.31 0.012 265)` | Bordas padrão |
| `--border-strong` | `oklch(0.38 0.014 265)` | Bordas em destaque / hover |

> Todos os neutros compartilham o matiz **265** (azul frio) com croma baixíssimo (≤ 0.012) — brancos e pretos levemente “gelados”, sem cinza puro.

### 1.3 Cores de destaque
Cada destaque tem uma cor base (`--accent`) e uma versão escurecida para hover/ênfase (`--accent-strong`). Todas mantêm croma e luminosidade próximos, variando principalmente o matiz.

| Destaque | `--accent` | `--accent-strong` |
|---|---|---|
| **Índigo** *(padrão)* | `oklch(0.55 0.16 270)` | `oklch(0.47 0.17 270)` |
| **Verde-água** | `oklch(0.62 0.105 192)` | `oklch(0.53 0.11 192)` |
| **Laranja** | `oklch(0.66 0.15 52)` | `oklch(0.58 0.16 48)` |
| **Rosa** | `oklch(0.62 0.16 12)` | `oklch(0.54 0.17 10)` |

| Token | Valor | Uso |
|---|---|---|
| `--accent-fg` | `#fff` | Texto/ícone sobre o destaque |
| `--accent-soft` | claro: `mix(accent 12%, surface)` · escuro: `24%` | Fundos tonalizados (thumbs, pills, célula selecionada) |
| `--accent-tint` | claro: `mix(accent 7%, surface)` · escuro: `15%` | Tonalização muito sutil (hover de linha de tabela) |

---

## 2. Tipografia

| Token | Família | Pesos |
|---|---|---|
| `--font-display` | **Space Grotesk**, system-ui, sans-serif | 500 / 600 / 700 |
| `--font-body` | **Inter**, system-ui, sans-serif | 400 / 500 / 600 |

- **Space Grotesk** → títulos, números, rótulos, botões e qualquer dado “de placar”.
- **Inter** → corpo de texto, descrições, parágrafos.

### 2.1 Escala de tamanhos
| Token | Valor | Aplicação |
|---|---|---|
| `--t-hero` | `clamp(2.4rem, 1.6rem + 3.4vw, 3.9rem)` | Título do hero |
| `--t-h1` | `clamp(1.9rem, 1.4rem + 2vw, 2.7rem)` | Títulos de página (placar, guia) |
| `--t-h2` | `1.5rem` | Títulos de seção |
| `--t-h3` | `1.18rem` | Nome do jogo / subtítulo |
| `--t-body` | `1rem` | Corpo de texto |
| `--t-sm` | `0.875rem` | Texto de apoio, botões |
| `--t-xs` | `0.78rem` | Rótulos, eyebrow, pills |

### 2.2 Regras de estilo
| Propriedade | Valor |
|---|---|
| Altura de linha (corpo) | `1.55` |
| Altura de linha (títulos) | `1.1` |
| Espaçamento entre letras (títulos) | `-0.015em` |
| Eyebrow / rótulos | `uppercase`, `letter-spacing: 0.14em`, peso 600, cor `--accent` |
| `text-wrap` | `balance` (hero) · `pretty` (corpo) |

---

## 3. Espaçamento e layout

| Token | Valor | Uso |
|---|---|---|
| `--maxw` | `1180px` | Largura máxima do conteúdo (`.wrap`) |
| `--gap` | `24px` | Espaçamento base entre cards, painéis e colunas |
| Padding lateral do `.wrap` | `clamp(18px, 4vw, 40px)` | Margem interna responsiva |

**Ritmo vertical (valores recorrentes):** padding de cards `20–24px`; padding do tabuleiro `clamp(20px, 3vw, 38px)`; padding do hero `clamp(48px, 8vw, 92px)`; gaps internos de painel `16px`.

### 3.1 Breakpoints
| Largura | Comportamento |
|---|---|
| **> 1024px** | Grade de jogos em **3 colunas**; página de jogo com **3 colunas** (painel · tabuleiro · painel) |
| **≤ 1024px** | Grade em **2 colunas**; painel direito desce para baixo do tabuleiro em 2 colunas |
| **≤ 768px** | Página de jogo em **coluna única** (tabuleiro no topo, painéis empilhados em 2 colunas); `.hide-tablet` some |
| **≤ 600px** | Grade em **1 coluna**; painéis em 1 coluna; seletor de acento compacta; tabela vira lista (esconde colunas `.hide-sm`); `.hide-mobile` some |

---

## 4. Raios de borda

| Token | Valor | Uso |
|---|---|---|
| `--r-sm` | `8px` | Inputs, teclas pequenas |
| `--r` | `12px` | Raio base (mini-ícones, demos) |
| `--r-lg` | `18px` | Cards, painéis, tabuleiros, tabela |
| `--r-pill` | `999px` | Botões, pills, chips, botões-ícone, seletor de acento |

> Cantos macios de **8–18px** conforme o briefing; elementos de ação são totalmente arredondados (pill).

---

## 5. Sombras / elevação

Sutis e usadas apenas para hierarquia. No modo escuro são mais densas (a profundidade vem mais das bordas).

| Token | Modo claro | Modo escuro |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(20,22,40,.05), 0 1px 3px rgba(20,22,40,.04)` | `0 1px 2px rgba(0,0,0,.4)` |
| `--shadow` | `0 6px 22px rgba(20,22,40,.07)` | `0 8px 26px rgba(0,0,0,.42)` |
| `--shadow-lg` | `0 18px 46px rgba(20,22,40,.12)` | `0 20px 50px rgba(0,0,0,.55)` |

**Uso típico:** `--shadow-sm` em repouso de botões/logo; `--shadow` em hover de botão primário; `--shadow-lg` no hover dos cards de jogo.

---

## 6. Movimento

| Propriedade | Valor |
|---|---|
| Transição de tema | `background-color 0.4s ease, color 0.4s ease` |
| Micro-interações (hover/borda) | `0.15s – 0.22s ease` |
| Pressão de botão | `transform: translateY(1px) scale(0.985)` |
| Hover de card | `translateY(-5px)` + `--shadow-lg` + anel de `--accent` |
| Entrada (`.reveal`) | `translateY(12px) → 0` em `0.55s`, com `--d` de atraso escalonado; **nunca esconde o conteúdo** (anima só o deslocamento). Respeita `prefers-reduced-motion`. |
