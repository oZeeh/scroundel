/**
 * Game Card type
 */
export type CardType = 'enemy' | 'weapon' | 'health' | 'gold' | 'shield'  

/**
 * All Cards, including the back of them
 */
export type DeckType = CardType | 'back'

/**
 * Only the cards that have suits
 */
export type SuitCardType = 'enemy' | 'weapon' | 'health' | 'shield'  

export class Card {
  type: CardType;
  value: number;
  color: string;

  constructor(type: CardType, value: number) {
    this.type = type;
    this.value = value;
    this.color = this.setColor(this.type)
  }

  private setColor(cardtype: CardType): string {
    switch (cardtype) {
      case 'enemy':
        return '#FF521B';
      case 'weapon':
        return '#6E2594';
      case 'health':
        return '#81171B';
      case 'gold':
        return '#F5BB00';
      case 'shield':
        return '#B9F18C';
      default:
        return '#E5EAFA'
    }
  }
}