# Recreio — Spec de Design (Melhorias de feedback de UX)

**Data:** 2026-06-10 · **Status:** Aprovado
**Escopo:** Tornar vitórias, derrotas/fim de jogo e erros do usuário mais explícitos e gratificantes, de forma consistente entre os jogos, reaproveitando tokens e componentes.

## Itens aprovados
1. **Overlay `ResultadoOverlay` compartilhado** sobre a `board-area`: título de vitória/derrota, detalhe da partida (tempo/pontos/movimentos/palavra), selo **"🏆 Novo recorde!"** quando aplicável, e ações "Jogar de novo" + "Voltar ao início". Generaliza o overlay atual do 2048.
2. **Detecção de novo recorde:** `submitRecord` passa a retornar `{ state, novoRecorde }`; `useRecords().submit` retorna `boolean`. Alimenta o selo do overlay.
3. **Feedback de erro imediato:** animação curta de *shake* (respeita `prefers-reduced-motion`) — célula errada do Sudoku, erro na Forca, e "nudge" no 2048 quando a jogada não move nada.
4. **Status mais expressivo:** ponto do `board-status` colore conforme o desfecho (`tom` = vitória → accent, derrota → vermelho); contador de erros pulsa quando falta 1 (Sudoku 2/3, Forca 5/6).

## Aplicação por jogo
- **Velha:** sem overlay (rodadas contínuas) — só `tom` no status por rodada (vitória/empate/derrota) e realce já existente da linha vencedora.
- **Jokenpô:** overlay no fim da série (vitória/derrota) com placar e selo de recorde; substitui o botão "Nova série" solto.
- **Memória:** overlay na conclusão (vitória) com tempo e movimentos + selo de recorde.
- **2048:** overlay de game over (refatorado para o componente compartilhado) com pontuação + selo; vitória (2048) continua sendo status (não-terminal).
- **Forca:** overlay de vitória/derrota com a palavra; shake no erro; pulso no contador de erros (5/6); selo de recorde (aproveitamento).
- **Sudoku:** overlay de vitória (tempo + selo) e de derrota (3 erros); shake na célula errada; pulso no contador (2/3).

## Componentes/CSS
- `src/components/ResultadoOverlay.tsx` (novo) + classes `.resultado-overlay`/`.resultado-card`/`.resultado-badge` em `index.css`.
- `BoardArea` ganha prop opcional `tom?: 'vitoria' | 'derrota'` (cor do `.dot`).
- Keyframes `shake` e `pulse-alerta` + classe `.stat-alerta`; `.board-area { position: relative }` para hospedar o overlay.
- `--danger` token adicionado aos blocos de tema (claro/escuro) para reuso (Sudoku erro, derrota).

## Critérios de aceite
- `npm run test`, `tsc -b`, `npm run build` passam.
- Overlay aparece nos fins de jogo dos 5 jogos aplicáveis, com selo só quando o resultado bate o recorde; "Jogar de novo" reinicia e "Voltar ao início" navega para `/`.
- Shake dispara no erro (Sudoku/Forca) e no no-op do 2048; nada anima sob `prefers-reduced-motion`.
- Status colore por desfecho; contador de erros pulsa a 1 do limite.
- Sem regressão de recordes (selo correto: vitória que supera recorde = selo; demais = sem selo).
