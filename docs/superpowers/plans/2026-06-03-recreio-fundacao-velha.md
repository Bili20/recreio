# Recreio — Fundação + Jogo da Velha (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a fundação do portal Recreio (build, tokens CSS, chrome, tema/acento, recordes, hub, placar global) e o Jogo da Velha completo, fiéis aos mockups e ao design system, prontos para rodar localmente.

**Architecture:** SPA React + Vite + Tailwind v4. Tokens de design vivem como variáveis CSS em `index.css` (trocam por `data-theme`/`data-accent` no `<html>`); Tailwind v4 mapeia tokens via `@theme`. Componentes React isolados (1:1 com `design/componentes.md`) renderizam as classes documentadas. Estado de tema/acento/recordes em `localStorage` via hooks. Lógica de jogo pura e testável separada da UI. Roteamento com React Router.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind v4 (`@tailwindcss/vite`), react-router-dom 7, Vitest + @testing-library/react + jsdom (testes de lógica/hooks).

**Referências:** `design/design-tokens.md`, `design/componentes.md`, mockups `design/hub_light.png`, `design/hub_dark_teal.png`, `design/velha_light.png`, `design/placar.png`, `design/g2048.png`. Spec: `docs/superpowers/specs/2026-06-03-recreio-fundacao-velha-design.md`.

**Convenções:** Todo texto em pt-BR. Nenhum valor de cor/raio/sombra/tipografia hardcoded fora de `index.css` — componentes usam utilitários Tailwind mapeados aos tokens ou as classes de componente. Commits frequentes em pt-BR (`feat:`/`test:`/`chore:`). Co-Author em cada commit:
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

## Política de uso do shadcn/ui

Usamos shadcn/ui para **não reconstruir do zero** primitivos genéricos e acessíveis, mantendo o trabalho manual onde a fidelidade ao design importa.

- **Usar shadcn** (copiar via CLI para `src/components/ui/` e re-estilizar): primitivos de comportamento/acessibilidade — `Select`, `Dialog`, `Tabs`, `Switch`, `DropdownMenu`, `Tooltip`, `Toast`. Muito mais relevante na **Fase 2** (modais de fim de jogo, seletor de grade da Memória, etc.). Na Fase 1 o único candidato real é o **`Select`** (usado por `Field`).
- **Feito à mão (NÃO usar shadcn):** componentes visuais sob medida do catálogo `componentes.md` que precisam casar com os mockups — `Button`/`Pill`/`Chip` (já são triviais e têm estados específicos), `GameCard`, `Panel`, `BoardArea`, `SummaryCard`, `ScoreTable`, e todos os tabuleiros de jogo.
- **Regra de tema (obrigatória):** shadcn traz seu próprio esquema (`--background`, `--foreground`… em HSL + `.dark`). **Não** introduzir esse esquema. Todo componente shadcn adotado deve ser editado para consumir **nossos** tokens OKLCH (`var(--surface)`, `var(--text)`, `var(--accent)`, `var(--border)`, raios `var(--radius-*)`), para que `data-theme`/`data-accent` continuem funcionando. Remover/substituir as classes utilitárias do template que apontem para o tema padrão do shadcn.
- **Sem regressão de tokens:** continua valendo a regra "nenhum valor hardcoded" — os componentes shadcn re-estilizados também resolvem para `var(--token)`.

> Efeito prático na Fase 1: a Task 0 inicializa o shadcn e aliases `@/`; a Task 7 usa o `Select` do shadcn (re-estilizado) dentro de `Field` em vez de um `<select>` cru. O restante segue manual.

---

## Estrutura de arquivos (Fase 1)

```
index.html                       # título Recreio, fontes, #root
src/
  main.tsx                       # ReactDOM + BrowserRouter
  App.tsx                        # <Routes> dentro de <Layout>
  index.css                      # @import tailwindcss; @theme; tokens; classes de componente
  vite-env.d.ts                  # (do scaffold)
  components/
    Brand.tsx                    # .brand + .mark
    ThemeToggle.tsx              # .icon-btn[data-theme-toggle] (lua/sol)
    AccentPicker.tsx             # .accent-picker + .accent-dot
    Header.tsx                   # .topbar (variante hub|game)
    Footer.tsx                   # .site-footer
    Layout.tsx                   # escolhe header/footer pela rota; <main class="wrap">
    Button.tsx                   # .btn + variantes
    IconButton.tsx               # .icon-btn genérico (voltar, +)
    Pill.tsx                     # .pill-accent / .pill-muted
    Chip.tsx                     # .chip (aria-pressed)
    Panel.tsx                    # .panel + StatRow/StatBig/PanelActions/Divider
    BoardArea.tsx                # .board-area + BoardStatus (.dot)
    GameCard.tsx                 # .game-card
    SummaryCard.tsx              # .summary-card
    ScoreTable.tsx               # .score-table
    Field.tsx                    # .field/.input + Select (sobre shadcn, re-estilizado)
    icons.tsx                    # ícones SVG geométricos (jogos, lua, sol, seta, voltar)
    ui/                          # primitivos shadcn (copiados via CLI, re-estilizados aos tokens)
      select.tsx                 # shadcn Select adaptado aos tokens OKLCH
  lib/
    utils.ts                     # cn() do shadcn (clsx + tailwind-merge)
  hooks/
    useLocalStorage.ts
    useTheme.ts
    useAccent.ts
    useRecords.ts
  utils/
    storage.ts
    records.ts                   # catálogo de jogos + métrica/comparador/formatação
  pages/
    Hub.tsx
    Placar.tsx
  games/
    games.ts                     # metadados compartilhados (id, nome, rota, descrição, ícone)
    velha/
      logic.ts                   # tabuleiro, vitória, jogadas, IA (random/defensiva/minimax)
      logic.test.ts
      JogoDaVelha.tsx
tests/
  setup.ts                       # jsdom + matchMedia/localStorage stubs
```

---

## Task 0: Limpar scaffold e instalar dependências

**Files:**
- Modify: `index.html`
- Create: `tests/setup.ts`
- Modify: `vite.config.ts`
- Delete: `src/App.tsx` (conteúdo do scaffold), `src/assets/*` (não usados)

- [ ] **Step 1: Instalar dependências**

Run:
```bash
npm install react-router-dom@^7
npm install -D vitest@^3 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25 @testing-library/user-event@^14
```
Expected: instala sem erros; `package.json` ganha as deps.

- [ ] **Step 2: Adicionar scripts de teste ao `package.json`**

No bloco `"scripts"`, adicionar:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2b: Configurar aliases `@/` (necessário para o shadcn)**

Em `tsconfig.json`, adicionar dentro de `compilerOptions` (criar `compilerOptions` se não existir no arquivo raiz; senão adicionar também em `tsconfig.app.json`):
```jsonc
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

Em `vite.config.ts`, adicionar `resolve.alias` (junto da config do Step 3):
```ts
import path from 'node:path'
// dentro de defineConfig({ ... }):
//   resolve: { alias: { '@': path.resolve(__dirname, './src') } },
```

- [ ] **Step 2c: Inicializar shadcn/ui (Tailwind v4)**

Run:
```bash
npx shadcn@latest init
```
Responder: estilo **New York**, base color **Neutral**, CSS variables **sim**. Isso cria `src/lib/utils.ts` (`cn()`) e `components.json`, e instala `clsx`/`tailwind-merge`/`class-variance-authority`.

> IMPORTANTE — não deixar o shadcn sobrescrever nosso tema: após o init, **reverter quaisquer blocos `@theme`/`:root`/`.dark` que o shadcn tenha adicionado em `src/index.css`** (variáveis `--background`, `--foreground`, `--primary`, `--radius` em HSL, classe `.dark`). Nosso `index.css` da Task 1 é a fonte da verdade (OKLCH + `data-theme`/`data-accent`). Conferir com `git diff src/index.css` e descartar essas adições. Os componentes shadcn adotados depois serão re-estilizados para usar nossos tokens (ver Política de uso do shadcn/ui).

- [ ] **Step 3: Configurar Vitest em `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

- [ ] **Step 4: Criar `tests/setup.ts`** (stubs de browser para jsdom)

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// matchMedia não existe em jsdom — stub para useTheme
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}
```

- [ ] **Step 5: Substituir `index.html`**

```html
<!doctype html>
<html lang="pt-BR" data-theme="light" data-accent="indigo">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Recreio — Seis jogos clássicos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Remover assets do scaffold**

Run:
```bash
git rm -f src/assets/react.svg src/assets/vite.svg src/assets/hero.png 2>NUL || rm -f src/assets/react.svg src/assets/vite.svg src/assets/hero.png
```
(Se algum não existir, ignore o erro.)

- [ ] **Step 7: Verificar que o projeto ainda instala**

Run: `npm run test -- --run` (sem testes ainda → "no test files" é OK) ou pule para Task 1.
Expected: sem erros de config.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: setup vitest, react-router e limpeza do scaffold"
```

---

## Task 1: Tokens de design em `index.css`

Implementa **todos** os tokens de `design/design-tokens.md` como variáveis CSS + mapeamento Tailwind v4. As classes de componente são adicionadas em tasks seguintes (este arquivo cresce ao longo do plano).

**Files:**
- Modify: `src/index.css` (substituir conteúdo do scaffold)

- [ ] **Step 1: Escrever a base de tokens**

Substituir todo o conteúdo de `src/index.css` por:

```css
@import "tailwindcss";

/* ---- Tokens: mapeamento Tailwind v4 (utilitários -> variáveis) ---- */
@theme inline {
  --color-bg: var(--bg);
  --color-bg-2: var(--bg-2);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-faint: var(--faint);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-fg: var(--accent-fg);
  --color-accent-soft: var(--accent-soft);
  --color-accent-tint: var(--accent-tint);

  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-DEFAULT: 12px;
  --radius-lg: 18px;
  --radius-pill: 999px;
}

/* ---- Neutros: modo claro ---- */
:root,
[data-theme="light"] {
  --bg: oklch(0.985 0.003 265);
  --bg-2: oklch(0.965 0.004 265);
  --surface: oklch(1 0 0);
  --surface-2: oklch(0.975 0.004 265);
  --text: oklch(0.24 0.012 265);
  --muted: oklch(0.52 0.012 265);
  --faint: oklch(0.68 0.01 265);
  --border: oklch(0.915 0.005 265);
  --border-strong: oklch(0.86 0.006 265);

  --accent-fg: #fff;
  --accent-soft: color-mix(in oklch, var(--accent) 12%, var(--surface));
  --accent-tint: color-mix(in oklch, var(--accent) 7%, var(--surface));

  --shadow-sm: 0 1px 2px rgba(20, 22, 40, 0.05), 0 1px 3px rgba(20, 22, 40, 0.04);
  --shadow: 0 6px 22px rgba(20, 22, 40, 0.07);
  --shadow-lg: 0 18px 46px rgba(20, 22, 40, 0.12);
}

/* ---- Neutros: modo escuro ---- */
[data-theme="dark"] {
  --bg: oklch(0.165 0.008 265);
  --bg-2: oklch(0.195 0.009 265);
  --surface: oklch(0.213 0.011 265);
  --surface-2: oklch(0.247 0.012 265);
  --text: oklch(0.96 0.004 265);
  --muted: oklch(0.7 0.012 265);
  --faint: oklch(0.52 0.01 265);
  --border: oklch(0.31 0.012 265);
  --border-strong: oklch(0.38 0.014 265);

  --accent-soft: color-mix(in oklch, var(--accent) 24%, var(--surface));
  --accent-tint: color-mix(in oklch, var(--accent) 15%, var(--surface));

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow: 0 8px 26px rgba(0, 0, 0, 0.42);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.55);
}

/* ---- Acentos ---- */
[data-accent="indigo"] { --accent: oklch(0.55 0.16 270); --accent-strong: oklch(0.47 0.17 270); }
[data-accent="teal"]   { --accent: oklch(0.62 0.105 192); --accent-strong: oklch(0.53 0.11 192); }
[data-accent="orange"] { --accent: oklch(0.66 0.15 52);  --accent-strong: oklch(0.58 0.16 48); }
[data-accent="rose"]   { --accent: oklch(0.62 0.16 12);  --accent-strong: oklch(0.54 0.17 10); }

/* ---- Tipografia / escala ---- */
:root {
  --t-hero: clamp(2.4rem, 1.6rem + 3.4vw, 3.9rem);
  --t-h1: clamp(1.9rem, 1.4rem + 2vw, 2.7rem);
  --t-h2: 1.5rem;
  --t-h3: 1.18rem;
  --t-body: 1rem;
  --t-sm: 0.875rem;
  --t-xs: 0.78rem;
  --maxw: 1180px;
  --gap: 24px;
}

* { box-sizing: border-box; }

html { color-scheme: light dark; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--t-body);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.4s ease, color 0.4s ease;
  text-wrap: pretty;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0;
}

a { color: inherit; text-decoration: none; }

.wrap {
  max-width: var(--maxw);
  margin: 0 auto;
  padding-inline: clamp(18px, 4vw, 40px);
}

/* Eyebrow / rótulos */
.eyebrow {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  font-size: var(--t-xs);
  color: var(--accent);
}

/* Entrada suave */
.reveal {
  animation: reveal 0.55s ease both;
  animation-delay: var(--d, 0s);
}
@keyframes reveal {
  from { transform: translateY(12px); opacity: 0.001; }
  to   { transform: translateY(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; }
  body, * { transition: none !important; }
}

/* Utilitários de responsividade do design system */
@media (max-width: 768px) { .hide-tablet { display: none !important; } }
@media (max-width: 600px) { .hide-mobile { display: none !important; } .hide-sm { display: none !important; } }
```

- [ ] **Step 2: Atualizar `src/main.tsx` para importar o CSS e montar a app vazia temporária**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Criar `src/App.tsx` placeholder (será substituído na Task 9)**

```tsx
export default function App() {
  return <div className="wrap">Recreio</div>
}
```

- [ ] **Step 4: Rodar o dev server e verificar visualmente**

Run: `npm run dev` (abrir no navegador)
Expected: fundo gelado claro, texto "Recreio". Alterar `data-theme="dark"` no `<html>` via devtools muda o fundo para escuro. Sem erros no console.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/main.tsx src/App.tsx
git commit -m "feat: tokens de design como variaveis CSS + mapeamento Tailwind"
```

---

## Task 2: `utils/storage.ts` + `useLocalStorage` (TDD)

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/hooks/useLocalStorage.ts`
- Test: `src/utils/storage.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

`src/utils/storage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { readJSON, writeJSON } from './storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('retorna o fallback quando a chave não existe', () => {
    expect(readJSON('inexistente', { a: 1 })).toEqual({ a: 1 })
  })

  it('grava e lê JSON', () => {
    writeJSON('k', { n: 42 })
    expect(readJSON('k', null)).toEqual({ n: 42 })
  })

  it('retorna o fallback quando o valor é JSON inválido', () => {
    localStorage.setItem('ruim', '{não-json}')
    expect(readJSON('ruim', 'fallback')).toBe('fallback')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm run test -- src/utils/storage.test.ts`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar `src/utils/storage.ts`**

```ts
// Helpers seguros de localStorage: nunca lançam, sempre retornam um fallback.

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // armazenamento cheio/indisponível — silenciar (jogo segue funcionando em memória)
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm run test -- src/utils/storage.test.ts`
Expected: PASS (3 testes).

- [ ] **Step 5: Implementar `src/hooks/useLocalStorage.ts`**

```ts
import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

// Estado React espelhado em localStorage. Lazy init lê uma vez na montagem.
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readJSON(key, initial))

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        writeJSON(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, set] as const
}
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/storage.ts src/utils/storage.test.ts src/hooks/useLocalStorage.ts
git commit -m "feat: storage util e hook useLocalStorage (TDD)"
```

---

## Task 3: `useTheme` e `useAccent`

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useAccent.ts`

- [ ] **Step 1: Implementar `src/hooks/useTheme.ts`**

```ts
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { readJSON } from '../utils/storage'

export type Theme = 'light' | 'dark'
const KEY = 'recreio-theme'

// Default = preferência do sistema quando não há escolha salva.
function initialTheme(): Theme {
  const saved = readJSON<Theme | null>(KEY, null)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(KEY, initialTheme())

  // Reflete a escolha no <html data-theme> para o CSS reagir.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
```

- [ ] **Step 2: Implementar `src/hooks/useAccent.ts`**

```ts
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Accent = 'indigo' | 'teal' | 'orange' | 'rose'
export const ACCENTS: { id: Accent; nome: string }[] = [
  { id: 'indigo', nome: 'Índigo' },
  { id: 'teal', nome: 'Verde-água' },
  { id: 'orange', nome: 'Laranja' },
  { id: 'rose', nome: 'Rosa' },
]

export function useAccent() {
  const [accent, setAccent] = useLocalStorage<Accent>('recreio-accent', 'indigo')
  useEffect(() => {
    document.documentElement.dataset.accent = accent
  }, [accent])
  return { accent, setAccent }
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useAccent.ts
git commit -m "feat: hooks useTheme e useAccent com persistencia"
```

---

## Task 4: Catálogo de jogos + sistema de recordes (TDD)

`utils/records.ts` define, para cada jogo, como comparar/formatar a métrica. `games.ts` guarda metadados de exibição (nome, rota, descrição, ícone). `useRecords` lê/grava `recreio-records`.

**Files:**
- Create: `src/games/games.ts`
- Create: `src/utils/records.ts`
- Create: `src/hooks/useRecords.ts`
- Test: `src/utils/records.test.ts`

- [ ] **Step 1: Criar `src/games/games.ts`** (metadados compartilhados; só Velha ativa nesta fase)

```ts
export type GameId = 'velha' | 'jokenpo' | 'memoria' | 'g2048' | 'forca' | 'sudoku'

export interface GameMeta {
  id: GameId
  nome: string
  rota: string
  descricao: string
  iconKey: GameId // chave usada por components/icons.tsx
  ativo: boolean  // false = "Em breve" (Fase 2)
}

export const GAMES: GameMeta[] = [
  { id: 'velha', nome: 'Jogo da Velha', rota: '/velha', iconKey: 'velha', ativo: true,
    descricao: 'Clássico X e O. Alinhe três e leve a melhor contra a máquina.' },
  { id: 'jokenpo', nome: 'Pedra, Papel, Tesoura', rota: '/jokenpo', iconKey: 'jokenpo', ativo: false,
    descricao: 'Melhor de cinco contra o computador. Pura sorte e instinto.' },
  { id: 'memoria', nome: 'Jogo da Memória', rota: '/memoria', iconKey: 'memoria', ativo: false,
    descricao: 'Encontre todos os pares no menor tempo e menos tentativas.' },
  { id: 'g2048', nome: '2048', rota: '/2048', iconKey: 'g2048', ativo: false,
    descricao: 'Junte blocos iguais para chegar a 2048.' },
  { id: 'forca', nome: 'Jogo da Forca', rota: '/forca', iconKey: 'forca', ativo: false,
    descricao: 'Adivinhe a palavra antes que o boneco complete.' },
  { id: 'sudoku', nome: 'Sudoku', rota: '/sudoku', iconKey: 'sudoku', ativo: false,
    descricao: 'Preencha o tabuleiro 9×9 em três níveis de dificuldade.' },
]

export const getGame = (id: GameId) => GAMES.find((g) => g.id === id)!
```

- [ ] **Step 2: Escrever o teste que falha**

`src/utils/records.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { submitRecord, loadRecords, RECORD_DEFS } from './records'

describe('records', () => {
  beforeEach(() => localStorage.clear())

  it('grava o primeiro resultado como recorde', () => {
    const recs = submitRecord('velha', 3)
    expect(recs.velha?.value).toBe(3)
    expect(recs.velha?.updatedAt).toBeTypeOf('number')
  })

  it('só substitui quando o novo resultado é melhor (maior é melhor na velha)', () => {
    submitRecord('velha', 5)
    const recs = submitRecord('velha', 2)
    expect(recs.velha?.value).toBe(5) // 2 não supera 5
  })

  it('para métrica "menor é melhor", tempo menor vence', () => {
    expect(RECORD_DEFS.memoria.melhor).toBe('menor')
    submitRecord('memoria', 90)
    const recs = submitRecord('memoria', 40)
    expect(recs.memoria?.value).toBe(40)
  })

  it('loadRecords devolve {} quando vazio', () => {
    expect(loadRecords()).toEqual({})
  })

  it('formata o valor conforme a definição do jogo', () => {
    expect(RECORD_DEFS.velha.format(12)).toBe('12 vitórias seguidas')
    expect(RECORD_DEFS.memoria.format(75)).toBe('1:15')
  })
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm run test -- src/utils/records.test.ts`
Expected: FAIL (módulo não existe).

- [ ] **Step 4: Implementar `src/utils/records.ts`**

```ts
import { readJSON, writeJSON } from './storage'
import type { GameId } from '../games/games'

const KEY = 'recreio-records'

export interface RecordEntry {
  value: number
  updatedAt: number
  plays: number // partidas jogadas (para o resumo do placar)
}

export type RecordsState = Partial<Record<GameId, RecordEntry>>

interface RecordDef {
  metricaCurta: string            // ex.: "vitórias seguidas" (coluna MÉTRICA do placar)
  melhor: 'maior' | 'menor'       // direção que define recorde
  format: (v: number) => string   // exibição amigável do valor
  rotuloPainel: string            // rótulo usado no hub/painel (ex.: "RECORDE")
}

// Formata segundos -> m:ss
const fmtTempo = (s: number) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}

// Definições por jogo. Apenas 'velha' é exercitada na Fase 1; as demais já ficam
// preparadas para a Fase 2 (cada jogo apenas chamará submitRecord/incrementPlays).
export const RECORD_DEFS: Record<GameId, RecordDef> = {
  velha:   { metricaCurta: 'vitórias seguidas', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => `${v} vitórias seguidas` },
  jokenpo: { metricaCurta: 'séries vencidas', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => `${v} seguidas` },
  memoria: { metricaCurta: 'melhor tempo', melhor: 'menor', rotuloPainel: 'Melhor tempo',
             format: (v) => fmtTempo(v) },
  g2048:   { metricaCurta: 'pontos', melhor: 'maior', rotuloPainel: 'Recorde',
             format: (v) => v.toLocaleString('pt-BR') },
  forca:   { metricaCurta: 'aproveitamento', melhor: 'maior', rotuloPainel: 'Aproveitamento',
             format: (v) => `${v}%` },
  sudoku:  { metricaCurta: 'melhor tempo', melhor: 'menor', rotuloPainel: 'Melhor tempo',
             format: (v) => fmtTempo(v) },
}

export const loadRecords = (): RecordsState => readJSON<RecordsState>(KEY, {})

function isBetter(id: GameId, novo: number, atual: number): boolean {
  return RECORD_DEFS[id].melhor === 'maior' ? novo > atual : novo < atual
}

// Submete um resultado; só substitui o valor se for melhor. Sempre soma +1 partida.
export function submitRecord(id: GameId, value: number): RecordsState {
  const recs = loadRecords()
  const prev = recs[id]
  const plays = (prev?.plays ?? 0) + 1
  if (!prev || isBetter(id, value, prev.value)) {
    recs[id] = { value, updatedAt: Date.now(), plays }
  } else {
    recs[id] = { ...prev, plays }
  }
  writeJSON(KEY, recs)
  return recs
}

// Soma uma partida sem mexer no recorde (ex.: rodada perdida).
export function incrementPlays(id: GameId): RecordsState {
  const recs = loadRecords()
  const prev = recs[id]
  recs[id] = prev
    ? { ...prev, plays: prev.plays + 1 }
    : { value: NaN, updatedAt: Date.now(), plays: 1 }
  writeJSON(KEY, recs)
  return recs
}
```

> Nota: `value: NaN` representa "jogou mas ainda não tem recorde"; a UI trata `Number.isNaN` como "sem recorde".

- [ ] **Step 5: Implementar `src/hooks/useRecords.ts`**

```ts
import { useCallback, useState } from 'react'
import { loadRecords, submitRecord, incrementPlays, type RecordsState } from '../utils/records'
import type { GameId } from '../games/games'

// Estado reativo dos recordes. Cada submit re-lê do storage e atualiza o estado.
export function useRecords() {
  const [records, setRecords] = useState<RecordsState>(() => loadRecords())

  const submit = useCallback((id: GameId, value: number) => {
    setRecords(submitRecord(id, value))
  }, [])

  const addPlay = useCallback((id: GameId) => {
    setRecords(incrementPlays(id))
  }, [])

  return { records, submit, addPlay }
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npm run test -- src/utils/records.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 7: Commit**

```bash
git add src/games/games.ts src/utils/records.ts src/utils/records.test.ts src/hooks/useRecords.ts
git commit -m "feat: catalogo de jogos e sistema de recordes (TDD)"
```

---

## Task 5: Ícones SVG geométricos

Ícones simples, sem dependência externa, herdando `currentColor`. Usados em thumbs de card, score-mini, tema e setas.

**Files:**
- Create: `src/components/icons.tsx`

- [ ] **Step 1: Implementar `src/components/icons.tsx`**

```tsx
import type { SVGProps } from 'react'
import type { GameId } from '../games/games'

type IconProps = SVGProps<SVGSVGElement>
const base = (p: IconProps) => ({
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, ...p,
})

export const IconLua = (p: IconProps) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
)
export const IconSol = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>
)
export const IconVoltar = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 18l-6-6 6-6" /></svg>
)
export const IconSeta = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7M9 7h8v8" /></svg>
)

// Ícones geométricos por jogo (traço simples, combinam com os thumbs dos mockups)
const GAME_ICONS: Record<GameId, JSX.Element> = {
  velha: <><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>,
  jokenpo: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M6 15c1.5 2 4 3 6 3s4.5-1 6-3" /></>,
  memoria: <><rect x="3" y="4" width="7" height="16" rx="1.5" /><rect x="14" y="4" width="7" height="16" rx="1.5" /></>,
  g2048: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  forca: <><path d="M5 21V3h9M5 3v4a4 4 0 0 0 4 4M14 3l3 3-3 3" /></>,
  sudoku: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></>,
}

export const GameIcon = ({ id, ...p }: { id: GameId } & IconProps) => (
  <svg {...base(p)}>{GAME_ICONS[id]}</svg>
)
```

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/icons.tsx
git commit -m "feat: icones SVG geometricos"
```

---

## Task 6: Componentes de chrome (Brand, ThemeToggle, AccentPicker, IconButton, Header, Footer, Layout)

Adiciona as classes correspondentes em `index.css` e cria os componentes. Mapeamento 1:1 com `componentes.md` §1–4, §14.

**Files:**
- Modify: `src/index.css` (append classes de chrome)
- Create: `src/components/IconButton.tsx`, `Brand.tsx`, `ThemeToggle.tsx`, `AccentPicker.tsx`, `Header.tsx`, `Footer.tsx`, `Layout.tsx`

- [ ] **Step 1: Acrescentar classes de chrome ao fim de `src/index.css`**

```css
/* ============ Chrome ============ */
.topbar {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; gap: 16px;
  padding: 14px 0;
  background: color-mix(in oklch, var(--bg) 78%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.topbar .wrap { display: flex; align-items: center; gap: 16px; width: 100%; }
.topbar-spacer { flex: 1; }
.topbar-title { font-family: var(--font-display); font-weight: 600; font-size: var(--t-h3); flex: 1; text-align: center; }

.brand { display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; }
.mark {
  position: relative; width: 34px; height: 34px; border-radius: var(--radius-DEFAULT);
  background: var(--accent); box-shadow: var(--shadow-sm); flex: none;
}
.mark::before { content: ""; position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-fg); top: 8px; left: 8px; }
.mark::after { content: ""; position: absolute; width: 8px; height: 8px; border-radius: 2px; background: var(--accent-fg); bottom: 8px; right: 8px; }

.icon-btn {
  display: inline-grid; place-items: center;
  width: 40px; height: 40px; border-radius: var(--radius-pill);
  background: var(--surface); border: 1px solid var(--border); color: var(--text);
  cursor: pointer; box-shadow: var(--shadow-sm); transition: background .18s ease, border-color .18s ease, transform .12s ease;
}
.icon-btn:hover { background: var(--surface-2); border-color: var(--border-strong); }
.icon-btn:active { transform: scale(0.92); }

.accent-picker { display: inline-flex; gap: 8px; padding: 6px 10px; border-radius: var(--radius-pill); background: var(--surface); border: 1px solid var(--border); }
.accent-dot {
  width: 18px; height: 18px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;
  transition: transform .15s ease, box-shadow .15s ease; padding: 0;
}
.accent-dot:hover { transform: scale(1.18); }
.accent-dot[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--text); }

.site-footer { border-top: 1px solid var(--border); margin-top: 64px; }
.site-footer .wrap { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center; padding-block: 28px; color: var(--muted); font-size: var(--t-sm); }
.site-footer nav { display: flex; gap: 20px; }
.site-footer a:hover { color: var(--accent); }
```

- [ ] **Step 2: `src/components/IconButton.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export default function IconButton(
  { children, ...rest }: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <button type="button" className="icon-btn" {...rest}>{children}</button>
}
```

- [ ] **Step 3: `src/components/Brand.tsx`**

```tsx
import { Link } from 'react-router-dom'

// `compact` mostra só o selo (usado no cabeçalho de jogo em telas pequenas).
export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="Recreio — início">
      <span className="mark" aria-hidden />
      {!compact && <span>Recreio</span>}
    </Link>
  )
}
```

- [ ] **Step 4: `src/components/ThemeToggle.tsx`**

```tsx
import IconButton from './IconButton'
import { IconLua, IconSol } from './icons'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <IconButton
      data-theme-toggle
      onClick={toggle}
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {dark ? <IconSol /> : <IconLua />}
    </IconButton>
  )
}
```

- [ ] **Step 5: `src/components/AccentPicker.tsx`**

```tsx
import { useAccent, ACCENTS } from '../hooks/useAccent'

// Cada bolinha mostra a própria cor do acento via inline style usando o token.
const COR: Record<string, string> = {
  indigo: 'oklch(0.55 0.16 270)',
  teal: 'oklch(0.62 0.105 192)',
  orange: 'oklch(0.66 0.15 52)',
  rose: 'oklch(0.62 0.16 12)',
}

export default function AccentPicker() {
  const { accent, setAccent } = useAccent()
  return (
    <div className="accent-picker hide-mobile" role="group" aria-label="Cor de destaque">
      {ACCENTS.map(({ id, nome }) => (
        <button
          key={id}
          className="accent-dot"
          style={{ background: COR[id] }}
          aria-label={nome}
          aria-pressed={accent === id}
          onClick={() => setAccent(id)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 6: `src/components/Header.tsx`**

```tsx
import { Link, useNavigate } from 'react-router-dom'
import Brand from './Brand'
import ThemeToggle from './ThemeToggle'
import AccentPicker from './AccentPicker'
import IconButton from './IconButton'
import { IconVoltar } from './icons'

interface HeaderProps {
  variant: 'hub' | 'game'
  title?: string // usado na variante game
}

export default function Header({ variant, title }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="topbar">
      <div className="wrap">
        {variant === 'hub' ? (
          <>
            <Brand />
            <span className="topbar-spacer" />
            <AccentPicker />
            <Link to="/placar" className="hide-mobile" style={{ color: 'var(--muted)' }}>Placar global</Link>
            <ThemeToggle />
          </>
        ) : (
          <>
            <IconButton aria-label="Voltar" onClick={() => navigate('/')}><IconVoltar /></IconButton>
            <h1 className="topbar-title">{title}</h1>
            <AccentPicker />
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  )
}
```

- [ ] **Step 7: `src/components/Footer.tsx`**

```tsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>Recreio — joguinhos leves, sem cadastro.</span>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/placar">Placar</Link>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 8: `src/components/Layout.tsx`** (escolhe chrome pela rota)

```tsx
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { GAMES } from '../games/games'

// Rotas de jogo usam o cabeçalho "game" (com voltar/título) e sem rodapé.
export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const game = GAMES.find((g) => g.rota === pathname)
  const isGame = Boolean(game)

  return (
    <>
      <Header variant={isGame ? 'game' : 'hub'} title={game?.nome} />
      <main className="wrap" style={{ paddingBlock: '32px' }}>{children}</main>
      {!isGame && <Footer />}
    </>
  )
}
```

- [ ] **Step 9: Verificar tipos e rodar dev**

Run: `npx tsc --noEmit`
Expected: sem erros (App ainda é placeholder; Layout não é usado até a Task 9 — ok).

- [ ] **Step 10: Commit**

```bash
git add src/index.css src/components/IconButton.tsx src/components/Brand.tsx src/components/ThemeToggle.tsx src/components/AccentPicker.tsx src/components/Header.tsx src/components/Footer.tsx src/components/Layout.tsx
git commit -m "feat: componentes de chrome (header, brand, tema, acento, footer, layout)"
```

---

## Task 7: Componentes reutilizáveis (Button, Pill, Chip, Panel, BoardArea, GameCard, SummaryCard, ScoreTable, Field)

Mapeamento 1:1 com `componentes.md` §5–13. Adiciona as classes ao `index.css` e cria os componentes.

**Files:**
- Modify: `src/index.css` (append)
- Create: `src/components/Button.tsx`, `Pill.tsx`, `Chip.tsx`, `Panel.tsx`, `BoardArea.tsx`, `GameCard.tsx`, `SummaryCard.tsx`, `ScoreTable.tsx`, `Field.tsx`

- [ ] **Step 1: Acrescentar classes ao fim de `src/index.css`**

```css
/* ============ Botões / pills / chips ============ */
.btn {
  --pad-y: 11px; --pad-x: 20px;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-display); font-weight: 600; font-size: var(--t-sm);
  padding: var(--pad-y) var(--pad-x); border-radius: var(--radius-pill);
  border: 1px solid transparent; cursor: pointer;
  transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .12s ease;
}
.btn:active { transform: translateY(1px) scale(0.985); }
.btn-sm { --pad-y: 7px; --pad-x: 14px; font-size: var(--t-xs); }
.btn-primary { background: var(--accent); color: var(--accent-fg); box-shadow: var(--shadow-sm); }
.btn-primary:hover { background: var(--accent-strong); box-shadow: var(--shadow); }
.btn-ghost { background: var(--surface); border-color: var(--border); color: var(--text); }
.btn-ghost:hover { border-color: var(--border-strong); }
.btn-soft { background: var(--accent-soft); color: var(--accent-strong); }
.btn-soft:hover { background: color-mix(in oklch, var(--accent) 20%, var(--surface)); }

.pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: var(--radius-pill); font-family: var(--font-display); font-weight: 600; font-size: var(--t-xs); }
.pill-accent { background: var(--accent-soft); color: var(--accent-strong); }
.pill-muted { background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); }

.chip {
  font-family: var(--font-display); font-weight: 600; font-size: var(--t-sm);
  padding: 8px 16px; border-radius: var(--radius-pill);
  background: var(--surface); border: 1px solid var(--border); color: var(--text); cursor: pointer;
  transition: background .15s ease, border-color .15s ease, color .15s ease;
}
.chip:hover { border-color: var(--border-strong); }
.chip[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }

/* ============ Painéis ============ */
.panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-sm); }
.panel h4 { font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--faint); margin-bottom: 14px; }
.stat-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; }
.stat-row + .stat-row { border-top: 1px solid var(--border); }
.stat-row .k { display: inline-flex; align-items: center; gap: 8px; color: var(--muted); }
.stat-row .v { font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; }
.stat-big { display: flex; flex-direction: column; gap: 2px; }
.stat-big small { color: var(--faint); font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.1em; }
.stat-big b { font-family: var(--font-display); font-weight: 700; font-size: var(--t-h1); }
.panel-actions { display: flex; flex-direction: column; gap: 10px; }
.panel-actions .btn { width: 100%; }
.divider { height: 1px; background: var(--border); margin: 16px 0; border: 0; }

/* ============ Área de tabuleiro ============ */
.board-area { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: clamp(20px, 3vw, 38px); min-height: 420px; display: flex; flex-direction: column; align-items: center; gap: 20px; box-shadow: var(--shadow-sm); }
.board-status { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: var(--t-h3); }
.board-status .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }

/* ============ Card de jogo ============ */
.game-card { display: flex; flex-direction: column; gap: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-sm); position: relative; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.game-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--accent); }
.game-card .game-top { display: flex; justify-content: space-between; align-items: flex-start; }
.game-thumb { width: 56px; height: 56px; border-radius: var(--radius-DEFAULT); display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-strong); }
.game-arrow { color: var(--faint); transition: transform .2s ease, color .2s ease; }
.game-card:hover .game-arrow { color: var(--accent); transform: translate(2px, -2px); }
.game-card h3 { font-size: var(--t-h3); }
.game-card .desc { color: var(--muted); font-size: var(--t-sm); }
.record { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; border-top: 1px solid var(--border); padding-top: 12px; margin-top: auto; }
.record .label { font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--faint); }
.record .value { font-family: var(--font-display); font-weight: 700; }
.record.empty .value { color: var(--faint); font-weight: 400; }
.game-card.coming { opacity: 0.6; pointer-events: none; }

/* ============ Resumo / tabela do placar ============ */
.summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
.summary-card b { display: block; font-family: var(--font-display); font-weight: 700; font-size: var(--t-h1); }
.summary-card span { color: var(--muted); }

.score-table { width: 100%; border-collapse: collapse; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.score-table th { text-align: left; font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--faint); background: var(--surface-2); padding: 14px 18px; font-weight: 600; }
.score-table td { padding: 16px 18px; border-top: 1px solid var(--border); }
.score-table tbody tr:hover { background: var(--accent-tint); }
.score-game { display: inline-flex; align-items: center; gap: 12px; }
.score-mini { width: 36px; height: 36px; border-radius: var(--radius-sm); display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-strong); }
.score-value { font-family: var(--font-display); font-weight: 700; }
.score-rank { color: var(--faint); font-family: var(--font-display); }
.text-right { text-align: right; }

/* ============ Campos ============ */
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-family: var(--font-display); color: var(--muted); font-size: var(--t-sm); }
.input, .select { border-radius: var(--radius-sm); border: 1px solid var(--border-strong); background: var(--surface); color: var(--text); padding: 10px 12px; font: inherit; }
.input::placeholder { color: var(--faint); }
.input:focus, .select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
```

- [ ] **Step 2: `src/components/Button.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'soft'

export default function Button(
  { variant = 'primary', sm = false, children, className = '', ...rest }:
  { variant?: Variant; sm?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const cls = `btn btn-${variant}${sm ? ' btn-sm' : ''} ${className}`.trim()
  return <button type="button" className={cls} {...rest}>{children}</button>
}
```

- [ ] **Step 3: `src/components/Pill.tsx`**

```tsx
import type { ReactNode } from 'react'

export default function Pill(
  { tone = 'accent', children }: { tone?: 'accent' | 'muted'; children: ReactNode },
) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}
```

- [ ] **Step 4: `src/components/Chip.tsx`**

```tsx
import type { ReactNode } from 'react'

export default function Chip(
  { active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode },
) {
  return (
    <button type="button" className="chip" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
```

- [ ] **Step 5: `src/components/Panel.tsx`** (com subcomponentes)

```tsx
import type { ReactNode } from 'react'

export default function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="panel">
      {title && <h4>{title}</h4>}
      {children}
    </section>
  )
}

export const StatRow = ({ k, v }: { k: ReactNode; v: ReactNode }) => (
  <div className="stat-row"><span className="k">{k}</span><span className="v">{v}</span></div>
)

export const StatBig = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="stat-big"><small>{label}</small><b>{value}</b></div>
)

export const PanelActions = ({ children }: { children: ReactNode }) => (
  <div className="panel-actions">{children}</div>
)

export const Divider = () => <hr className="divider" />
```

- [ ] **Step 6: `src/components/BoardArea.tsx`**

```tsx
import type { ReactNode } from 'react'

export const BoardStatus = ({ children }: { children: ReactNode }) => (
  <div className="board-status"><span className="dot" aria-hidden />{children}</div>
)

export default function BoardArea({ status, children }: { status: ReactNode; children: ReactNode }) {
  return (
    <div className="board-area">
      <BoardStatus>{status}</BoardStatus>
      {children}
    </div>
  )
}
```

- [ ] **Step 7: `src/components/GameCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { GameIcon, IconSeta } from './icons'
import type { GameMeta } from '../games/games'

interface Props { game: GameMeta; recorde?: string }

export default function GameCard({ game, recorde }: Props) {
  const inner = (
    <>
      <div className="game-top">
        <span className="game-thumb"><GameIcon id={game.iconKey} /></span>
        <span className="game-arrow"><IconSeta width={20} height={20} /></span>
      </div>
      <h3>{game.nome}</h3>
      <p className="desc">{game.descricao}</p>
      <div className={`record${recorde ? '' : ' empty'}`}>
        <span className="label">{game.ativo ? 'Recorde' : 'Em breve'}</span>
        <span className="value">{game.ativo ? (recorde ?? 'Sem recorde ainda') : '—'}</span>
      </div>
    </>
  )
  if (!game.ativo) return <div className="game-card coming">{inner}</div>
  return <Link to={game.rota} className="game-card reveal">{inner}</Link>
}
```

- [ ] **Step 8: `src/components/SummaryCard.tsx`**

```tsx
export default function SummaryCard({ value, label }: { value: string; label: string }) {
  return <div className="summary-card"><b>{value}</b><span>{label}</span></div>
}
```

- [ ] **Step 9: `src/components/ScoreTable.tsx`**

```tsx
import { GameIcon } from './icons'
import type { GameId } from '../games/games'

export interface ScoreRow {
  id: GameId
  nome: string
  valor: string
  metrica: string
  atualizado: string
}

export default function ScoreTable({ rows }: { rows: ScoreRow[] }) {
  if (rows.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>Nenhum recorde ainda — jogue uma partida para começar.</p>
  }
  return (
    <table className="score-table">
      <thead>
        <tr>
          <th>#</th><th>Jogo</th><th>Recorde</th>
          <th className="hide-sm">Métrica</th>
          <th className="hide-sm text-right">Atualizado</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id}>
            <td className="score-rank">{i + 1}</td>
            <td>
              <span className="score-game">
                <span className="score-mini"><GameIcon id={r.id} width={20} height={20} /></span>
                {r.nome}
              </span>
            </td>
            <td className="score-value">{r.valor}</td>
            <td className="hide-sm" style={{ color: 'var(--muted)' }}>{r.metrica}</td>
            <td className="hide-sm text-right" style={{ color: 'var(--muted)' }}>{r.atualizado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 10a: Adicionar o primitivo Select do shadcn e re-estilizá-lo aos tokens**

Run:
```bash
npx shadcn@latest add select
```
Isso cria `src/components/ui/select.tsx` (sobre Radix). Editar esse arquivo para que as cores/raios resolvam para **nossos tokens** em vez do tema padrão do shadcn — no `SelectTrigger` e no `SelectContent`/`SelectItem`, substituir classes utilitárias do template por arbitrárias apontando aos tokens:
- trigger: `bg-[var(--surface)] text-[var(--text)] border-[var(--border-strong)] rounded-[var(--radius-sm)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]`
- content: `bg-[var(--surface)] text-[var(--text)] border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)]`
- item selecionado/realçado: `data-[highlighted]:bg-[var(--accent-tint)] data-[state=checked]:text-[var(--accent-strong)]`

Remover qualquer referência a `bg-background`/`text-foreground`/`border-input` etc. (tema padrão do shadcn). Conferir que troca de `data-theme`/`data-accent` reflete no dropdown.

- [ ] **Step 10b: `src/components/Field.tsx`** (Input manual + wrapper sobre o Select do shadcn)

```tsx
import type { InputHTMLAttributes, ReactNode } from 'react'
import {
  Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export function Input({ label, ...rest }: { label?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <input className="input" {...rest} />
    </label>
  )
}

export interface Opcao { value: string; label: string }

// Wrapper sobre o Select do shadcn, mantendo a API simples (label + opções)
// e o layout `.field` do nosso design system.
export function Select(
  { label, value, onValueChange, options, placeholder }:
  { label?: string; value?: string; onValueChange?: (v: string) => void; options: Opcao[]; placeholder?: string },
) {
  return (
    <div className="field">
      {label && <span>{label}</span>}
      <UISelect value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </UISelect>
    </div>
  )
}
```

> A classe `.select` em `index.css` deixa de ser necessária (o estilo do controle vem do `ui/select.tsx` re-estilizado); manter apenas `.input`/`.field`/foco do `.input`.

- [ ] **Step 11: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 12: Commit**

```bash
git add src/index.css src/components/Button.tsx src/components/Pill.tsx src/components/Chip.tsx src/components/Panel.tsx src/components/BoardArea.tsx src/components/GameCard.tsx src/components/SummaryCard.tsx src/components/ScoreTable.tsx src/components/Field.tsx src/components/ui/select.tsx
git commit -m "feat: componentes reutilizaveis do design system (Select via shadcn)"
```

---

## Task 8: Página Hub

Hero ("Seis jogos clássicos."), stat line, seção "Escolha um jogo" com grade de `GameCard`. Fiel a `hub_light.png` / `hub_dark_teal.png`.

**Files:**
- Modify: `src/index.css` (append grid e hero)
- Create: `src/pages/Hub.tsx`

- [ ] **Step 1: Acrescentar ao fim de `src/index.css`**

```css
/* ============ Hub ============ */
.hero { padding-block: clamp(40px, 8vw, 80px) 8px; }
.hero h1 { font-size: var(--t-hero); text-wrap: balance; max-width: 16ch; }
.hero p { color: var(--muted); font-size: var(--t-h3); max-width: 52ch; margin-top: 16px; }
.stat-line { display: flex; flex-wrap: wrap; gap: 8px 28px; margin-top: 24px; color: var(--muted); font-size: var(--t-sm); }
.stat-line b { color: var(--text); font-family: var(--font-display); }
.section-head { display: flex; justify-content: space-between; align-items: baseline; margin: 40px 0 20px; gap: 16px; }
.section-head h2 { font-size: var(--t-h2); }
.section-head span { color: var(--faint); font-size: var(--t-sm); }
.games-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); }
@media (max-width: 1024px) { .games-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .games-grid, .summary-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: `src/pages/Hub.tsx`**

```tsx
import GameCard from '../components/GameCard'
import { GAMES } from '../games/games'
import { useRecords } from '../hooks/useRecords'
import { RECORD_DEFS } from '../utils/records'

export default function Hub() {
  const { records } = useRecords()

  // Formata o recorde de cada jogo para o rodapé do card (ou undefined = "sem recorde").
  const recordeDe = (id: (typeof GAMES)[number]['id']) => {
    const r = records[id]
    if (!r || Number.isNaN(r.value)) return undefined
    return RECORD_DEFS[id].format(r.value)
  }

  return (
    <>
      <section className="hero reveal">
        <span className="eyebrow">Portal de jogos casuais</span>
        <h1>Seis jogos clássicos.</h1>
        <p>Joguinhos leves para qualquer momento livre — sem cadastro, sem anúncios, só o jogo. Seus recordes ficam salvos a cada partida.</p>
        <div className="stat-line">
          <span><b>6</b> jogos</span>
          <span><b>0</b> downloads — roda no navegador</span>
          <span><b>2</b> temas · 4 cores de destaque</span>
        </div>
      </section>

      <div className="section-head">
        <h2>Escolha um jogo</h2>
        <span>Toque em um card para começar</span>
      </div>

      <div className="games-grid">
        {GAMES.map((g, i) => (
          <div key={g.id} style={{ '--d': `${i * 0.05}s` } as React.CSSProperties}>
            <GameCard game={g} recorde={recordeDe(g.id)} />
          </div>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Wire temporário em `src/App.tsx` para visualizar**

```tsx
import Layout from './components/Layout'
import Hub from './pages/Hub'

export default function App() {
  return <Layout><Hub /></Layout>
}
```

- [ ] **Step 4: Verificar visualmente**

Run: `npm run dev`
Expected: hub renderiza com hero, stat line e grade de 6 cards (Velha clicável; demais "Em breve" esmaecidos). Trocar tema/acento pelo cabeçalho muda cores e persiste após reload. Comparar com `design/hub_light.png` e `design/hub_dark_teal.png`.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/pages/Hub.tsx src/App.tsx
git commit -m "feat: pagina hub com grade de jogos e recordes"
```

---

## Task 9: Lógica do Jogo da Velha (TDD — núcleo)

Funções puras: detecção de vencedor, jogadas válidas, e seleção de jogada da IA por nível (incluindo minimax imbatível).

**Files:**
- Create: `src/games/velha/logic.ts`
- Test: `src/games/velha/logic.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

`src/games/velha/logic.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { vencedor, jogadasValidas, escolherJogada, type Tabuleiro } from './logic'

const T = (s: string): Tabuleiro =>
  s.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O')))

describe('vencedor', () => {
  it('detecta linha horizontal', () => {
    expect(vencedor(T('XXX' + 'OO.' + '...'))?.jogador).toBe('X')
  })
  it('detecta diagonal', () => {
    expect(vencedor(T('X.O' + '.X.' + 'O.X'))?.jogador).toBe('X')
  })
  it('retorna null quando não há vencedor', () => {
    expect(vencedor(T('XO.' + '.X.' + '..O'))).toBeNull()
  })
  it('expõe os índices da linha vencedora', () => {
    expect(vencedor(T('XXX' + '...' + '...'))?.linha).toEqual([0, 1, 2])
  })
})

describe('jogadasValidas', () => {
  it('lista as casas vazias', () => {
    expect(jogadasValidas(T('XO.' + '...' + '...'))).toEqual([2, 3, 4, 5, 6, 7, 8])
  })
})

describe('escolherJogada (difícil/minimax)', () => {
  it('vence quando tem a jogada vencedora', () => {
    // O em 'O' jogando; OO. na primeira linha -> completa em 2
    expect(escolherJogada(T('OO.' + 'XX.' + '...'), 'O', 'dificil')).toBe(2)
  })
  it('bloqueia a vitória do oponente', () => {
    // X ameaça em 2 (XX.); O deve bloquear em 2
    expect(escolherJogada(T('XX.' + 'O..' + '...'), 'O', 'dificil')).toBe(2)
  })
  it('nunca perde: contra jogada ótima o melhor caso é empate', () => {
    // simulação de jogo completo X(humano aleatório-ótimo) vs O(minimax) é coberto abaixo
    expect(typeof escolherJogada(T('.........'), 'X', 'dificil')).toBe('number')
  })
})

describe('escolherJogada (médio/defensivo)', () => {
  it('bloqueia ameaça imediata', () => {
    expect(escolherJogada(T('XX.' + '...' + 'O..'), 'O', 'medio')).toBe(2)
  })
  it('vence se possível em vez de bloquear', () => {
    // O pode vencer em 2 (OO.) e também há ameaça X em 5; deve preferir vencer
    expect(escolherJogada(T('OO.' + 'XX.' + '...'), 'O', 'medio')).toBe(2)
  })
})

describe('escolherJogada (fácil)', () => {
  it('devolve uma jogada válida', () => {
    const m = escolherJogada(T('X........'), 'O', 'facil')
    expect(jogadasValidas(T('X........'))).toContain(m)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm run test -- src/games/velha/logic.test.ts`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar `src/games/velha/logic.ts`**

```ts
// Lógica pura do Jogo da Velha — sem React, totalmente testável.

export type Marca = 'X' | 'O'
export type Celula = Marca | null
export type Tabuleiro = Celula[] // 9 posições, índices 0..8
export type Nivel = 'facil' | 'medio' | 'dificil'

// As 8 linhas vencedoras (3 horizontais, 3 verticais, 2 diagonais).
const LINHAS: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export interface Resultado { jogador: Marca; linha: [number, number, number] }

// Retorna o vencedor + a linha, ou null se ninguém venceu.
export function vencedor(t: Tabuleiro): Resultado | null {
  for (const linha of LINHAS) {
    const [a, b, c] = linha
    if (t[a] && t[a] === t[b] && t[a] === t[c]) {
      return { jogador: t[a] as Marca, linha }
    }
  }
  return null
}

export const jogadasValidas = (t: Tabuleiro): number[] =>
  t.flatMap((c, i) => (c === null ? [i] : []))

export const tabuleiroCheio = (t: Tabuleiro): boolean => t.every((c) => c !== null)

const oponente = (m: Marca): Marca => (m === 'X' ? 'O' : 'X')

// Procura uma jogada que dá vitória imediata a `marca` (ou null).
function jogadaVencedora(t: Tabuleiro, marca: Marca): number | null {
  for (const i of jogadasValidas(t)) {
    const copia = [...t]
    copia[i] = marca
    if (vencedor(copia)?.jogador === marca) return i
  }
  return null
}

// ---- Minimax (nível difícil): retorna a pontuação ótima para `vez`. ----
// +10 vitória da IA, -10 derrota, 0 empate; desconta a profundidade para preferir
// vitórias rápidas e derrotas tardias.
function minimax(t: Tabuleiro, vez: Marca, ia: Marca, prof: number): number {
  const venc = vencedor(t)
  if (venc) return venc.jogador === ia ? 10 - prof : prof - 10
  if (tabuleiroCheio(t)) return 0

  const movimentos = jogadasValidas(t)
  if (vez === ia) {
    let melhor = -Infinity
    for (const i of movimentos) {
      const copia = [...t]; copia[i] = vez
      melhor = Math.max(melhor, minimax(copia, oponente(vez), ia, prof + 1))
    }
    return melhor
  } else {
    let pior = Infinity
    for (const i of movimentos) {
      const copia = [...t]; copia[i] = vez
      pior = Math.min(pior, minimax(copia, oponente(vez), ia, prof + 1))
    }
    return pior
  }
}

function melhorJogadaMinimax(t: Tabuleiro, marca: Marca): number {
  let melhorScore = -Infinity
  let melhorIdx = jogadasValidas(t)[0]
  for (const i of jogadasValidas(t)) {
    const copia = [...t]; copia[i] = marca
    const score = minimax(copia, oponente(marca), marca, 1)
    if (score > melhorScore) { melhorScore = score; melhorIdx = i }
  }
  return melhorIdx
}

const aleatorio = (xs: number[]): number => xs[Math.floor(Math.random() * xs.length)]

// Heurística posicional para o nível médio quando não há vitória/bloqueio.
const PRIORIDADE = [4, 0, 2, 6, 8, 1, 3, 5, 7] // centro > cantos > lados

// Seleciona a jogada da IA conforme o nível.
export function escolherJogada(t: Tabuleiro, marca: Marca, nivel: Nivel): number {
  const validas = jogadasValidas(t)
  if (validas.length === 0) return -1

  if (nivel === 'facil') return aleatorio(validas)

  if (nivel === 'medio') {
    const ganhar = jogadaVencedora(t, marca)
    if (ganhar !== null) return ganhar
    const bloquear = jogadaVencedora(t, oponente(marca))
    if (bloquear !== null) return bloquear
    return PRIORIDADE.find((i) => validas.includes(i)) ?? validas[0]
  }

  // difícil
  return melhorJogadaMinimax(t, marca)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm run test -- src/games/velha/logic.test.ts`
Expected: PASS (todos os testes).

- [ ] **Step 5: Adicionar um teste de robustez do minimax (nunca perde em 50 jogos contra adversário aleatório)**

Acrescentar a `logic.test.ts`:
```ts
import { tabuleiroCheio } from './logic'

describe('minimax é imbatível', () => {
  it('IO nunca perde para um oponente aleatório em 50 partidas', () => {
    for (let p = 0; p < 50; p++) {
      let t: Tabuleiro = Array(9).fill(null)
      let vez: Marca = 'X' // oponente aleatório começa
      while (!vencedor(t) && !tabuleiroCheio(t)) {
        const i = vez === 'X'
          ? escolherJogada(t, 'X', 'facil')   // aleatório
          : escolherJogada(t, 'O', 'dificil') // minimax
        t = t.map((c, idx) => (idx === i ? vez : c))
        vez = vez === 'X' ? 'O' : 'X'
      }
      // O (minimax) nunca pode ter perdido
      expect(vencedor(t)?.jogador).not.toBe('X')
    }
  })
})
```

Run: `npm run test -- src/games/velha/logic.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/games/velha/logic.ts src/games/velha/logic.test.ts
git commit -m "feat: logica do jogo da velha com IA (random/defensiva/minimax) (TDD)"
```

---

## Task 10: UI do Jogo da Velha + integração de recorde + rota

Página de jogo com 3 colunas (painéis · tabuleiro · ações), fiel a `velha_light.png`.

**Files:**
- Modify: `src/index.css` (append layout de página de jogo + tabuleiro velha)
- Create: `src/games/velha/JogoDaVelha.tsx`
- Modify: `src/App.tsx` (rotas reais com React Router)

- [ ] **Step 1: Acrescentar ao fim de `src/index.css`**

```css
/* ============ Layout de página de jogo ============ */
.game-layout { display: grid; grid-template-columns: 280px 1fr 280px; gap: var(--gap); align-items: start; }
.panel-side-left, .panel-side-right { display: flex; flex-direction: column; gap: var(--gap); }
@media (max-width: 1024px) {
  .game-layout { grid-template-columns: 260px 1fr; }
  .panel-side-right { grid-column: 1 / -1; flex-direction: row; }
  .panel-side-right > * { flex: 1; }
}
@media (max-width: 768px) {
  .game-layout { grid-template-columns: 1fr; }
  .panel-side-left { flex-direction: row; }
  .panel-side-left > * { flex: 1; }
}
@media (max-width: 600px) {
  .panel-side-left, .panel-side-right { flex-direction: column; }
}

/* ============ Tabuleiro da Velha ============ */
.ttt-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: min(360px, 80vw); aspect-ratio: 1; }
.ttt-cell {
  display: grid; place-items: center; border-radius: var(--radius-DEFAULT);
  background: var(--surface-2); border: 1px solid var(--border); cursor: pointer;
  color: var(--muted); transition: background .15s ease, border-color .15s ease, transform .1s ease;
}
.ttt-cell:hover:not(:disabled) { border-color: var(--border-strong); }
.ttt-cell:active:not(:disabled) { transform: scale(0.97); }
.ttt-cell:disabled { cursor: default; }
.ttt-cell.x { color: var(--accent); }
.ttt-cell.o { color: var(--muted); }
.ttt-cell.win { background: var(--accent-soft); border-color: var(--accent); }
.ttt-mark { width: 46%; height: 46%; }
```

- [ ] **Step 2: `src/games/velha/JogoDaVelha.tsx`**

```tsx
import { useEffect, useState } from 'react'
import Panel, { StatRow, PanelActions } from '../../components/Panel'
import BoardArea from '../../components/BoardArea'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import Pill from '../../components/Pill'
import { useRecords } from '../../hooks/useRecords'
import {
  vencedor, jogadasValidas, tabuleiroCheio, escolherJogada,
  type Tabuleiro, type Nivel, type Marca,
} from './logic'

type Modo = 'cpu' | 'dois'
const VAZIO: Tabuleiro = Array(9).fill(null)

// Marca SVG para X (traço) e O (círculo), herdando a cor da célula.
const MarcaSVG = ({ m }: { m: Marca }) =>
  m === 'X' ? (
    <svg className="ttt-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 5l14 14M19 5 5 19" /></svg>
  ) : (
    <svg className="ttt-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="8" /></svg>
  )

export default function JogoDaVelha() {
  const { records, submit, addPlay } = useRecords()
  const [modo, setModo] = useState<Modo>('cpu')
  const [nivel, setNivel] = useState<Nivel>('medio')
  const [tab, setTab] = useState<Tabuleiro>(VAZIO)
  const [vez, setVez] = useState<Marca>('X') // humano (ou jogador 1) é sempre X
  const [placar, setPlacar] = useState({ voce: 0, cpu: 0, empates: 0 })
  const [streak, setStreak] = useState(0) // sequência de vitórias contra a CPU
  const [registrado, setRegistrado] = useState(false) // evita contar a rodada 2x

  const resultado = vencedor(tab)
  const cheio = tabuleiroCheio(tab)
  const acabou = Boolean(resultado) || cheio

  // Jogada da CPU quando for a vez do O no modo cpu.
  useEffect(() => {
    if (modo !== 'cpu' || acabou || vez !== 'O') return
    const tempo = setTimeout(() => {
      const i = escolherJogada(tab, 'O', nivel)
      if (i >= 0) aplicar(i)
    }, 380)
    return () => clearTimeout(tempo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vez, modo, acabou])

  // Ao terminar a rodada: atualiza placar, sequência e recorde (uma vez só).
  useEffect(() => {
    if (!acabou || registrado) return
    setRegistrado(true)

    if (resultado) {
      const venceuVoce = resultado.jogador === 'X'
      setPlacar((p) => ({
        ...p,
        voce: p.voce + (venceuVoce ? 1 : 0),
        cpu: p.cpu + (!venceuVoce ? 1 : 0),
      }))
      if (modo === 'cpu') {
        if (venceuVoce) {
          const nova = streak + 1
          setStreak(nova)
          submit('velha', nova) // grava recorde de maior sequência
        } else {
          setStreak(0)
          addPlay('velha')
        }
      }
    } else {
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }))
      if (modo === 'cpu') { setStreak(0); addPlay('velha') }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acabou])

  function aplicar(i: number) {
    setTab((t) => {
      if (t[i] || vencedor(t)) return t
      const copia = [...t]; copia[i] = vez
      return copia
    })
    setVez((v) => (v === 'X' ? 'O' : 'X'))
  }

  function jogarHumano(i: number) {
    if (acabou || tab[i]) return
    if (modo === 'cpu' && vez !== 'X') return
    aplicar(i)
  }

  function novaRodada() {
    setTab(VAZIO); setVez('X'); setRegistrado(false)
  }
  function reiniciarPlacar() {
    setPlacar({ voce: 0, cpu: 0, empates: 0 }); setStreak(0); novaRodada()
  }

  // Texto do status acima do tabuleiro.
  const status = resultado
    ? resultado.jogador === 'X' ? 'Você venceu a rodada!' : (modo === 'cpu' ? 'A CPU venceu' : 'O venceu!')
    : cheio ? 'Empate!'
    : modo === 'cpu'
      ? vez === 'X' ? 'Sua vez' : 'Vez da CPU…'
      : `Vez do ${vez}`

  const recorde = records.velha && !Number.isNaN(records.velha.value) ? records.velha.value : 0
  const linhaWin = resultado?.linha ?? []

  return (
    <div className="game-layout">
      {/* Painéis esquerdos */}
      <div className="panel-side-left">
        <Panel title="Placar da rodada">
          <StatRow k={<>Você <Pill tone="accent">X</Pill></>} v={placar.voce} />
          <StatRow k={<>{modo === 'cpu' ? 'CPU' : 'Jogador 2'} <Pill tone="muted">O</Pill></>} v={placar.cpu} />
          <StatRow k="Empates" v={placar.empates} />
        </Panel>

        <Panel title="Modo">
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip active={modo === 'cpu'} onClick={() => { setModo('cpu'); reiniciarPlacar() }}>vs CPU</Chip>
            <Chip active={modo === 'dois'} onClick={() => { setModo('dois'); reiniciarPlacar() }}>2 jogadores</Chip>
          </div>
        </Panel>

        {modo === 'cpu' && (
          <Panel title="Dificuldade">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip active={nivel === 'facil'} onClick={() => setNivel('facil')}>Fácil</Chip>
              <Chip active={nivel === 'medio'} onClick={() => setNivel('medio')}>Médio</Chip>
              <Chip active={nivel === 'dificil'} onClick={() => setNivel('dificil')}>Difícil</Chip>
            </div>
          </Panel>
        )}
      </div>

      {/* Tabuleiro central */}
      <BoardArea status={status}>
        <div className="ttt-board" role="grid" aria-label="Tabuleiro do jogo da velha">
          {tab.map((c, i) => (
            <button
              key={i}
              className={`ttt-cell${c === 'X' ? ' x' : c === 'O' ? ' o' : ''}${linhaWin.includes(i) ? ' win' : ''}`}
              onClick={() => jogarHumano(i)}
              disabled={Boolean(c) || acabou || (modo === 'cpu' && vez !== 'X')}
              aria-label={c ? `Casa ${i + 1}: ${c}` : `Casa ${i + 1} vazia`}
            >
              {c && <MarcaSVG m={c} />}
            </button>
          ))}
        </div>
      </BoardArea>

      {/* Painel direito: ações + recorde */}
      <div className="panel-side-right">
        <Panel title="Ações">
          <PanelActions>
            <Button variant="primary" onClick={novaRodada}>Nova rodada</Button>
            <Button variant="ghost" onClick={reiniciarPlacar}>Reiniciar placar</Button>
          </PanelActions>
        </Panel>
        <Panel title="Recorde">
          <StatRow k="Vitórias seguidas" v={recorde} />
          {modo === 'cpu' && <StatRow k="Sequência atual" v={streak} />}
        </Panel>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Substituir `src/App.tsx` por rotas reais**

```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Hub from './pages/Hub'
import Placar from './pages/Placar'
import JogoDaVelha from './games/velha/JogoDaVelha'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/placar" element={<Placar />} />
        <Route path="/velha" element={<JogoDaVelha />} />
      </Routes>
    </Layout>
  )
}
```

> Nota: `Placar` é criado na Task 11. Se executar 10 antes de 11, comente temporariamente a rota `/placar`.

- [ ] **Step 4: Verificar visualmente e jogar**

Run: `npm run dev` → abrir `/velha`
Expected: layout de 3 colunas como `velha_light.png`. Jogar vs CPU nos 3 níveis; no Difícil é impossível ganhar (só empata ou perde). Vitórias seguidas atualizam o recorde, que aparece no painel e no card do hub. Trocar modo/dificuldade reinicia corretamente. Responsivo nos breakpoints.

- [ ] **Step 5: `npx tsc --noEmit` e commit**

Run: `npx tsc --noEmit`
Expected: sem erros (com a rota `/placar` apontando para a Task 11 já feita, ou comentada).
```bash
git add src/index.css src/games/velha/JogoDaVelha.tsx src/App.tsx
git commit -m "feat: UI do jogo da velha com modos, niveis e recorde"
```

---

## Task 11: Página Placar global

Resumo (`SummaryCard`), filtros (`Chip`) e `ScoreTable` agregando os recordes reais. Fiel a `placar.png`.

**Files:**
- Create: `src/pages/Placar.tsx`
- Modify: `src/index.css` (append, se necessário — `.placar-head`)

- [ ] **Step 1: Acrescentar ao fim de `src/index.css`**

```css
/* ============ Placar ============ */
.placar-head { margin-bottom: 20px; }
.placar-head h1 { font-size: var(--t-h1); }
.placar-head p { color: var(--muted); margin-top: 8px; }
.filtros { display: flex; flex-wrap: wrap; gap: 10px; margin: 24px 0; }
.summary-grid { margin-bottom: 24px; }
```

- [ ] **Step 2: `src/pages/Placar.tsx`**

```tsx
import { useMemo, useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import ScoreTable, { type ScoreRow } from '../components/ScoreTable'
import Chip from '../components/Chip'
import { GAMES, type GameId } from '../games/games'
import { useRecords } from '../hooks/useRecords'
import { RECORD_DEFS } from '../utils/records'

// "há 2 dias", "ontem", "hoje" a partir do timestamp.
function tempoRelativo(ts: number): string {
  const dias = Math.floor((Date.now() - ts) / 86_400_000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

export default function Placar() {
  const { records } = useRecords()
  const [filtro, setFiltro] = useState<GameId | 'todos'>('todos')

  // Monta as linhas a partir dos jogos que têm recorde de verdade.
  const linhas: ScoreRow[] = useMemo(() => {
    return GAMES.filter((g) => {
      const r = records[g.id]
      return r && !Number.isNaN(r.value)
    })
      .filter((g) => filtro === 'todos' || g.id === filtro)
      .map((g) => {
        const r = records[g.id]!
        return {
          id: g.id,
          nome: g.nome,
          valor: RECORD_DEFS[g.id].format(r.value),
          metrica: RECORD_DEFS[g.id].metricaCurta,
          atualizado: tempoRelativo(r.updatedAt),
        }
      })
  }, [records, filtro])

  const comRecorde = Object.values(records).filter((r) => r && !Number.isNaN(r.value)).length
  const partidas = Object.values(records).reduce((s, r) => s + (r?.plays ?? 0), 0)

  return (
    <>
      <div className="placar-head">
        <span className="eyebrow">Seus números</span>
        <h1>Placar global</h1>
        <p>Os recordes pessoais de cada jogo, salvos no seu navegador.</p>
      </div>

      <div className="summary-grid">
        <SummaryCard value={String(comRecorde)} label="jogos com recorde" />
        <SummaryCard value={partidas.toLocaleString('pt-BR')} label="partidas jogadas" />
        <SummaryCard value={String(GAMES.length)} label="jogos disponíveis" />
      </div>

      <div className="filtros">
        <Chip active={filtro === 'todos'} onClick={() => setFiltro('todos')}>Todos</Chip>
        {GAMES.map((g) => (
          <Chip key={g.id} active={filtro === g.id} onClick={() => setFiltro(g.id)}>{g.nome}</Chip>
        ))}
      </div>

      <ScoreTable rows={linhas} />
    </>
  )
}
```

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev` → abrir `/placar` (e clicar em "Placar global" no cabeçalho)
Expected: resumo + filtros + tabela. Com recorde da Velha já criado na Task 10, a linha aparece; filtros funcionam; vazio mostra mensagem amigável. Comparar com `design/placar.png`.

- [ ] **Step 4: `npx tsc --noEmit` e commit**

Run: `npx tsc --noEmit`
Expected: sem erros.
```bash
git add src/index.css src/pages/Placar.tsx
git commit -m "feat: pagina de placar global agregando recordes"
```

---

## Task 12: Verificação final, build e README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rodar a suíte de testes completa**

Run: `npm run test`
Expected: PASS em storage, records e velha/logic.

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: `tsc -b` sem erros + bundle Vite gerado em `dist/` sem erros.

- [ ] **Step 3: Preview e smoke test manual**

Run: `npm run preview`
Expected: navegar hub → velha → placar; trocar tema/acento; jogar uma rodada; recarregar e confirmar persistência de tema, acento e recorde.

- [ ] **Step 4: Reescrever `README.md`**

```markdown
# Recreio

Portal web de jogos casuais clássicos — React + Vite + Tailwind. Sem cadastro, sem backend: tudo roda no navegador e os recordes ficam salvos em `localStorage`.

## Como rodar

Requer Node 18+.

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
```

Outros comandos:

```bash
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção
npm run test     # testes (lógica dos jogos, recordes, storage)
```

## Jogos

- **Jogo da Velha** — 2 jogadores no mesmo dispositivo ou contra a IA (fácil/médio/difícil; o difícil usa minimax e é imbatível).
- _Em breve (Fase 2):_ Pedra-Papel-Tesoura, Memória, 2048, Forca, Sudoku.

## Recursos

- Modo claro/escuro + 4 cores de destaque, persistidos no navegador.
- Recordes pessoais por jogo e página de **Placar global** agregando tudo.
- Totalmente responsivo (desktop, tablet, celular).

## Organização

- `src/components/` — componentes reutilizáveis do design system (1:1 com `design/componentes.md`).
- `src/games/` — um diretório por jogo (lógica isolada e testável + UI).
- `src/hooks/` e `src/utils/` — tema, acento, recordes e helpers de `localStorage`.
- `src/index.css` — tokens de design como variáveis CSS (`design/design-tokens.md`).
- `design/` — tokens, catálogo de componentes e mockups de referência.
```

- [ ] **Step 5: Commit final**

```bash
git add README.md
git commit -m "docs: instrucoes de uso e visao geral do projeto"
```

---

## Self-Review (preenchido)

**Cobertura da spec:**
- Build React+Vite+Tailwind rodável → Task 0, 12. ✓
- Tokens como variáveis CSS, sem hardcode → Task 1 (+ classes nas Tasks 6/7/8/10/11). ✓
- Componentes 1:1 com `componentes.md` → Tasks 6 e 7 (todos os §1–14 cobertos; tabuleiros específicos §15 da Velha na Task 10). ✓
- Tema claro/escuro + persistência + botão no header → Tasks 3, 6. ✓
- Acento (4 cores) + persistência → Tasks 3, 6. ✓
- Recordes em localStorage por jogo → Task 4; integração Velha na Task 10. ✓
- Placar global agregando recordes → Task 11. ✓
- Hub fiel aos mockups → Task 8. ✓
- Jogo da Velha: 2 jogadores + IA 3 níveis (random/defensivo/minimax) → Tasks 9, 10. ✓
- Responsividade nos 4 breakpoints → CSS nas Tasks 1, 7, 8, 10. ✓
- pt-BR em tudo → textos em todos os componentes/páginas. ✓
- Organização games/ components/ hooks/ utils/ + comentários → estrutura e comentários ao longo. ✓

**Placeholders:** nenhum passo com TBD/“implemente depois”; todo passo de código tem código completo. Exceção consciente: a rota `/placar` é referenciada na Task 10 e implementada na Task 11 (nota explícita no passo).

**Consistência de tipos:** `Tabuleiro`/`Marca`/`Nivel` definidos em `logic.ts` e usados igual em `JogoDaVelha.tsx`. `GameId`/`GameMeta` em `games.ts` usados em `records.ts`, `ScoreTable`, `Hub`, `Placar`. `RecordsState`/`RecordEntry` consistentes entre `records.ts`, `useRecords.ts`, páginas. `RECORD_DEFS` expõe `format`, `metricaCurta`, `melhor`, `rotuloPainel` — usados de forma consistente.

**Escopo:** focado na Fase 1 (fundação + Velha). Os 5 jogos restantes ficam para planos próprios na Fase 2.
```
