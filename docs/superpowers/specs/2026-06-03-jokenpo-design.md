# Recreio — Spec de Design (Fase 2: Pedra, Papel, Tesoura)

**Data:** 2026-06-03
**Status:** Aprovado
**Escopo:** Implementar o jogo **Pedra, Papel, Tesoura (Jokenpô)** contra a máquina, reaproveitando toda a fundação da Fase 1 (chrome, tokens, hooks, recordes, componentes). Sub-projeto independente.

## Referências
- Mockup: `design/jokenpo.png`.
- Catálogo: `design/componentes.md` §15 — `.rps-*` (dois tokens grandes em confronto; `.win` colore o vencedor), botões `.rps-choice` (com `.active`), marcador "melhor de 5" `.bo5` (com `.win`/`.loss`).
- Tokens: `design/design-tokens.md` (já implementados em `src/index.css`).
- Recordes: `src/utils/records.ts` já define `jokenpo` → métrica "séries vencidas", maior é melhor, formato `"${v} seguidas"`.

## Comportamento
- **Rota** `/jokenpo` (já reservada). O jogo passa a `ativo: true` em `src/games/games.ts` (sai de "Em breve" no hub).
- **Melhor de 5 = primeiro a 3 vitórias de rodada.** Empate **repete a rodada** (não consome um dot nem altera o placar).
- **CPU** escolhe aleatoriamente.
- **Recorde:** ao vencer uma série (chegar a 3 primeiro), incrementa a sequência de séries vencidas e grava via `submit('jokenpo', sequencia)`. Perder uma série zera a sequência (e conta a partida via `addPlay`). Hub e Placar global passam a exibir o recorde automaticamente (ex.: "8 seguidas").

## Layout (fiel ao mockup)
Página de jogo em 2 colunas (painel à esquerda · board ao centro):
- **Painel esquerdo "Melhor de 5":** `StatRow` Você / CPU (pontos da série) + fileira de **5 dots** `.bo5` (vitória = `--accent`, derrota = `--muted`, não jogada = vazia/`--border`). Abaixo, `Divider` + `StatRow` "Sequência atual" e "Recorde".
- **Centro (`board-area`):** `board-status` (ponto + frase, ex.: "Você venceu a rodada — papel cobre pedra"); dois tokens grandes `.rps-token` lado a lado (rótulos "Você" / "CPU") com "VS" no meio; o vencedor recebe `.win` (`--accent-soft` + borda `--accent`). Abaixo, três botões `.rps-choice` (Papel / Pedra / Tesoura), o escolhido com `.active`. Quando a série encerra, os botões ficam desabilitados e aparece um botão **"Nova série"**.

### Ícones (linguagem geométrica do design, como no mockup)
- **Pedra = círculo** · **Papel = quadrado arredondado** · **Tesoura = X**. Adicionados a `src/components/icons.tsx`.

## Lógica pura e testável (`src/games/jokenpo/logic.ts`)
- `type Jogada = 'pedra' | 'papel' | 'tesoura'`, `type ResultadoRodada = 'vitoria' | 'derrota' | 'empate'`.
- `resultado(jogador, cpu): ResultadoRodada` — pedra vence tesoura, tesoura vence papel, papel vence pedra; iguais = empate.
- `frase(jogador, cpu): string` — do ponto de vista do vencedor: "Pedra quebra tesoura", "Tesoura corta papel", "Papel cobre pedra"; empate → "Empate — joguem de novo".
- `jogadaCpu(rng = Math.random): Jogada` — escolha aleatória (rng injetável para teste determinístico).
- `ALVO = 3`; `serieEncerrada(voce, cpu): boolean` — alguém chegou a 3.
- Sem React; testado com Vitest.

## Animação ("animações nas mãos")
Ao revelar a jogada, os tokens fazem um *reveal* curto (leve "shake" + scale no token da CPU) via keyframes CSS, re-disparado a cada rodada (key que muda). O vencedor transiciona para `.win`. Respeita `prefers-reduced-motion` (sem animação).

## Arquivos
- Criar: `src/games/jokenpo/logic.ts`, `src/games/jokenpo/logic.test.ts`, `src/games/jokenpo/Jokenpo.tsx`.
- Modificar: `src/components/icons.tsx` (ícones pedra/papel/tesoura), `src/index.css` (classes `.rps-*`, `.bo5`, layout 2 colunas, keyframes), `src/games/games.ts` (`jokenpo.ativo = true`), `src/App.tsx` (rota `/jokenpo`), `README.md` (mover Jokenpô para "implementado").

## Critérios de aceite
- `npm run test` e `npm run build` passam; tsc limpo.
- Regras corretas (matriz pedra/papel/tesoura), empate repete, melhor de 5 = primeiro a 3.
- Dots refletem o histórico de rodadas decididas; vencedor destacado; frase correta.
- Vencer série incrementa e grava o recorde; aparece no Hub e no Placar; perder zera a sequência.
- Card do jogo deixa de ser "Em breve".
- Fiel ao `jokenpo.png` em claro/escuro e nos 4 acentos; responsivo; tudo em pt-BR.

## Fora de escopo
Memória, 2048, Forca, Sudoku (sub-projetos seguintes da Fase 2).
