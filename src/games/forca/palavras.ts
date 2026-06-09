export interface Categoria {
  nome: string
  palavras: string[]
}

export const CATEGORIAS: Categoria[] = [
  { nome: 'Animais', palavras: ['GATO', 'CAVALO', 'ELEFANTE', 'GIRAFA', 'CACHORRO', 'COELHO', 'TUBARAO', 'BORBOLETA', 'TARTARUGA', 'MACACO', 'PINGUIM', 'GOLFINHO'] },
  { nome: 'Frutas', palavras: ['BANANA', 'MORANGO', 'ABACAXI', 'MELANCIA', 'LARANJA', 'GOIABA', 'CEREJA', 'ABACATE', 'LIMAO', 'MAMAO', 'MANGA', 'PERA'] },
  { nome: 'Paises', palavras: ['BRASIL', 'ARGENTINA', 'CHILE', 'PORTUGAL', 'ESPANHA', 'FRANCA', 'ALEMANHA', 'CANADA', 'JAPAO', 'EGITO', 'MEXICO', 'ITALIA'] },
  { nome: 'Objetos', palavras: ['CADEIRA', 'GARRAFA', 'TELEFONE', 'JANELA', 'RELOGIO', 'MOCHILA', 'TESOURA', 'PANELA', 'MARTELO', 'LAMPADA', 'CHAVE', 'ESPELHO'] },
  { nome: 'Profissoes', palavras: ['MEDICO', 'PROFESSOR', 'ENGENHEIRO', 'PEDREIRO', 'ADVOGADO', 'DENTISTA', 'PILOTO', 'COZINHEIRO', 'JARDINEIRO', 'BOMBEIRO', 'MOTORISTA', 'PADEIRO'] },
]
