import type { Card, CardType, DeckType, SuitCardType } from "./cardType";

/**
 * Fallback to cards without style
 */
const cardSymbols: Record<DeckType, string> = {
  'enemy': '🂡',  // Ás de Espadas
  'health': '🂱', // Ás de Copas
  'weapon': '🃑', // Ás de Paus
  'shield': '🃁', // Ás de Ouros
  'gold': '🃏',   // Curinga
  'back': '🂠' 
};

const baseCodePoints: Record<SuitCardType, number> = {
  'enemy': 0x1F0A0,  // Espadas
  'health': 0x1F0B0, // Copas
  'shield': 0x1F0C0, // Ouros
  'weapon': 0x1F0D0, // Paus
};

function getCardSymbol(card: Card): string {
  if (card.type === 'gold') {
    return '🃏';
  }

  const base = baseCodePoints[card.type];
  if (!base) {
    return '❓';
  }

  const value = card.value;

  // Cartas numeradas 1 (Ás) até 10
  if (value >= 1 && value <= 10) {
    return String.fromCodePoint(base + value);
  }
  
  // Tratamento especial para Valete(11), Dama(12), Rei(13)
  switch (value) {
    case 11:
      return String.fromCodePoint(base + 0xB); // J
    case 12:
      return String.fromCodePoint(base + 0xD); // Q
    case 13:
      return String.fromCodePoint(base + 0xE); // K
  }

  return '❓';
}


export { cardSymbols, getCardSymbol }