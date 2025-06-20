import * as PIXI from 'pixi.js';
import { Game } from '../engine/game';
import { Card } from './cardType';
import { cardSymbols, getCardSymbol } from './cardSymbols';
import { Text } from 'pixi.js';

export class GameRenderer {
  game: Game;
  app: PIXI.Application;
  handContainer: PIXI.Container;
  tableContainer: PIXI.Container;
  shouldUseFallBackSpriteRender: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application();
    this.handContainer = new PIXI.Container();
    this.tableContainer = new PIXI.Container();
  }

  async init() {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb, //trocar ASAP
      antialias: true,
      resolution: 1,
    });

    try {
      await PIXI.Assets.load([
        { alias: 'cardBack', src: cardBack },
        { alias: 'enemyCard', src: enemyCard }
      ]);
    }
    catch {
      this.shouldUseFallBackSpriteRender = true
    }

    document.body.appendChild(this.app.canvas);

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    if (this.shouldUseFallBackSpriteRender){
      this.renderFallbackHand();
      this.renderFallbackDeck();
      this.renderFallbackTable();
    } else {
      this.renderHand(); //Exemplo de renderização sem fallback
      this.renderDeck();
    }

    
    this.app.stage.addChild(this.handContainer);
    this.app.stage.addChild(this.tableContainer);
  }

  renderFallbackDeck() {
    const deckText = this.createDeckSpriteFallback();
    this.app.stage.addChild(deckText);
  }

  renderFallbackHand() {
    this.handContainer.removeChildren();
    this.game.hand.forEach((card, index) => {
      const cardText = this.createCardSpriteFallback(card, index);
      this.handContainer.addChild(cardText);
    });
  }

  renderHand() {
    this.handContainer.removeChildren();
    this.game.hand.forEach((card, index) => {
      const cardSprite = this.createCardSprite(card, index);
      this.handContainer.addChild(cardSprite);
    });
  }

  renderDeck() {
    this.handContainer.removeChildren();
      const deckSprite = this.createDeckSprite();
      this.handContainer.addChild(deckSprite);
    }

  renderFallbackTable() {
    this.tableContainer.removeChildren();

    this.game.table.forEach((card, index) => {
      const cardText = this.createTableSpriteFallback(card, index)
      this.tableContainer.addChild(cardText);
    });
  }

  refreshHand() {
    this.renderFallbackHand();
  }

  private createTableSpriteFallback(card: Card, index: number): Text {
    const tableWidth = this.game.table.length * 70;
    const startX = (this.app.renderer.width - tableWidth) / 2;
    const initialY = this.app.renderer.height / 2 - 150; 

    const symbol = getCardSymbol(card);

      const cardTextStyle = new PIXI.TextStyle({
        fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
        fontSize: 64,
        fill: card.color,
      });

      const cardText = new Text({
        text: symbol,
        style: cardTextStyle
      });

      cardText.x = startX + index * 70;
      cardText.y = initialY;

      return cardText;
  }

  private createCardSpriteFallback(card: Card, index: number): Text {
    const symbol = getCardSymbol(card);
    const handWidth = this.game.hand.length * 70;
    const initialX = (this.app.renderer.width - handWidth) / 2;
    const initialY = this.app.renderer.height / 2 + 150;

    const cardTextStyle = new PIXI.TextStyle({
      fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
      fontSize: 64,
      fill: card.color,
    });

    const cardText = new Text({
      text: symbol,
      style: cardTextStyle,
    });

    cardText.x = initialX + index * 70;
    cardText.y = initialY;

    cardText.eventMode = 'static';
    cardText.cursor = 'pointer';

    cardText.on('pointerover', () => {
      cardText.y = initialY - 20;
    });

    cardText.on('pointerout', () => {
      cardText.y = initialY;
    });

    return cardText;
  }

  private createDeckSpriteFallback(): Text {
      const deckSymbol = cardSymbols['back']; // '🂠'
      const deckText = new Text({
        text: deckSymbol,
        style: {
          fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
          fontSize: 64,
          fill: 0xffffff,
        },
      });

      deckText.x = this.app.renderer.width / 3 ;
      deckText.y = this.app.renderer.height / 2 - 150;

      deckText.eventMode = 'static';
      deckText.cursor = 'pointer';

      deckText.on('pointerdown', () => {
        this.game.drawCards(1);
        this.refreshHand();
      });

      return deckText
  }

  private createDeckSprite(): PIXI.Sprite {
      const deckSprite = PIXI.Sprite.from('cardBack');
      deckSprite.x = 50;
      deckSprite.y = 200;
      deckSprite.scale.set(0.5);
      deckSprite.eventMode = 'static';
      deckSprite.cursor = 'pointer';

      deckSprite.on('pointerdown', () => {
        this.game.drawCards(1);
        this.refreshHand();
      });

      return deckSprite;
  }

  private createCardSprite(card: Card, index: number): PIXI.Sprite {
      const texture = card.type === 'enemy' ? 'enemyCard' : 'cardBack';
      const cardSprite = PIXI.Sprite.from(texture);

      cardSprite.x = 200 + index * 110;
      cardSprite.y = 400;
      
      cardSprite.scale.set(0.5);
      cardSprite.eventMode = 'static';
      cardSprite.cursor = 'pointer';

      cardSprite.on('pointerover', () => {
        cardSprite.scale.set(0.6);
        cardSprite.y -= 20;
      });

      cardSprite.on('pointerout', () => {
        cardSprite.scale.set(0.5);
        cardSprite.y = 400;
      });

      return cardSprite;
  }
}