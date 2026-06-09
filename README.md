# Recreio

Portal web de jogos casuais clássicos — **React + Vite + Tailwind CSS v4**. Sem cadastro, sem backend: tudo roda no navegador e os recordes ficam salvos no `localStorage`.

> **Status:** Fase 2 em andamento — fundação completa + **Jogo da Velha**, **Pedra-Papel-Tesoura**, **Jogo da Memória**, **2048** e **Jogo da Forca** implementados. Sudoku aparece no hub como *Em breve* e será implementado em seguida, reaproveitando toda esta base.

## Como rodar

Requer **Node 18+**.

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

- **Jogo da Velha** — 2 jogadores no mesmo dispositivo ou contra a IA em três níveis:
  - *Fácil* — jogadas aleatórias.
  - *Médio* — defensivo (vence se pode, senão bloqueia, senão joga por prioridade posicional).
  - *Difícil* — **minimax** completo; é imbatível (o melhor que dá é empatar).
- **Pedra, Papel, Tesoura** — melhor de cinco (primeiro a 3) contra o computador, com placar e recorde de séries seguidas.
- **Jogo da Memória** — grade 4×4 ou 6×6, contagem de movimentos, cronômetro e recorde de melhor tempo.
- **2048** — junte blocos iguais até 2048; setas no desktop, swipe no celular; recorde de maior pontuação.
- **Jogo da Forca** — 60 palavras em 5 categorias, boneco progressivo, dica, teclado na tela e físico; recorde de aproveitamento.
- _Em breve (Fase 2):_ Sudoku.

## Recursos

- **Tema claro/escuro** + **4 cores de destaque** (índigo, verde-água, laranja, rosa), alternáveis no cabeçalho e persistidos no navegador.
- **Recordes pessoais** por jogo (no Jogo da Velha: maior sequência de vitórias contra a CPU).
- Página de **Placar global** que agrega os recordes de todos os jogos.
- Totalmente **responsivo** (desktop, tablet e celular).
- Tudo em **português do Brasil**.

## Organização do código

```
src/
  components/   componentes reutilizáveis do design system (1:1 com design/componentes.md)
    ui/         primitivos baseados em shadcn/ui, re-estilizados aos tokens do projeto
  games/        um diretório por jogo — lógica pura e testável (logic.ts) + UI
    velha/
  hooks/        useTheme, useAccent, useRecords, useLocalStorage
  utils/        storage (localStorage) e records (catálogo de métricas por jogo)
  pages/        Hub e Placar
  index.css     tokens de design como variáveis CSS (design/design-tokens.md) + classes
design/         tokens, catálogo de componentes e mockups de referência
docs/           spec de design e plano de implementação
```

### Decisões de arquitetura

- **Tokens como variáveis CSS.** Toda cor, tipografia, raio e sombra vive em `src/index.css` como variável CSS (em OKLCH), trocando por `data-theme` (claro/escuro) e `data-accent` (4 cores) no `<html>`. O Tailwind v4 mapeia esses tokens via `@theme`, então não há valores fixos espalhados pelo código.
- **Lógica separada da UI.** Cada jogo isola sua lógica em `logic.ts` (funções puras), testada com Vitest — incluindo a verificação de que o minimax é imbatível ao longo de 50 partidas.
- **Recordes e tema em hooks/utilitários.** Persistência centralizada em `utils/storage.ts` + `utils/records.ts`, consumida via hooks.
- **shadcn/ui pontual.** Usado apenas para primitivos genéricos (ex.: `Select`), sempre re-estilizado para consumir os tokens do projeto — os componentes visuais sob medida são feitos à mão para casar com os mockups.

## Testes

```bash
npm run test
```

Cobrem `utils/storage`, `utils/records` (regras de "melhor recorde" para métricas de maior e de menor) e `games/velha/logic` (detecção de vitória, jogadas e IA, com o teste de minimax imbatível).
