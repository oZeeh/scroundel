import { Card, type CardType } from "./cardType";

export class Game {
  public deck: Card[] = [];
  public hand: Card[] = [];
  public table: Card[] = [];
  public enemyQueue: Card[] = [];
  private life: number  = 10

  constructor() {
    this.deck = this.createDeck();
    this.prepareEnemies();  
    this.drawCards(3);
    this.refillTable(); 
  }

  public getLife() {
    return this.life
  }

  public setLife(newLife: number) {
    this.life += newLife
  }

  public isGameWon() {
    return this.table.length + this.enemyQueue.length <= 0
  }

  public isGameLost() {
    return this.life <= 0;
  }

  private createDeck(): Card[] {
  const cards: Card[] = [];
  const types: CardType[] = ['enemy', 'health', 'weapon', 'shield'];
  
  // Para cada tipo, cria 13 cartas com valores de 1 a 13
  types.forEach(type => {
    for (let value = 1; value <= 13; value++) {
        cards.push(new Card(type, value));
      }
    });

    for (let i = 0; i < 4; i++) {
      cards.push(new Card('gold', 0));
    }

    return this.shuffle(cards);
  }

  private shuffle(deck: Card[]): Card[] {
    return deck.sort(() => Math.random() - 0.5);
  }

  public spawnEnemy() {
    const enemy = this.deck.find(card => card.type === "enemy");
    if (enemy) {
      this.deck.splice(this.deck.indexOf(enemy), 1);
      this.table.push(enemy);
    }
  }

  public refillTable() {
    while (this.table.length < 3 && this.enemyQueue.length > 0) {
      const nextEnemy = this.enemyQueue.shift();
      if (nextEnemy) {
        this.table.push(nextEnemy);
      }
    }
  }

  private prepareEnemies() {
    this.enemyQueue = this.deck.filter(card => card.type === 'enemy');
    this.deck = this.deck.filter(card => card.type !== 'enemy');
  }

  public drawCards(amount: number) {
    for (let i = 0; i < amount; i++) {
      const card = this.deck.pop();

      if (!card) return

      if (card?.type != "enemy") {
        this.hand.push(card);
      }
    }
  }

  public playCardFromHand(card: Card) {
    const index = this.hand.indexOf(card);
    if (index !== -1) {
        this.hand.splice(index, 1);
    }
  }

  public playCardFromTable(card: Card) {
    const index = this.table.indexOf(card);
    if (index !== -1) {
        this.table.splice(index, 1);
    }
  }

}
