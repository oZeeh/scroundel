import * as PIXI from 'pixi.js';
import { Game } from '../engine/game';
import { Card } from './cardType';
import { cardSymbols, getCardSymbol } from './cardSymbols';
import { Text } from 'pixi.js';
import { tableRenderer } from './Renderers/tableRenderer';
import { handRenderer } from './Renderers/handRenderer';
import { deckRenderer } from './Renderers/deckRenderer';

export class GameRenderer {
  game: Game;
  app: PIXI.Application;
  handContainer: PIXI.Container;
  tableContainer: PIXI.Container;
  shouldUseFallBackSpriteRender: boolean = false;
  table: tableRenderer;
  hand: handRenderer;
  deck: deckRenderer;

  constructor(game: Game) {
    this.game = game;
    this.app = new PIXI.Application();
    this.handContainer = new PIXI.Container();
    this.tableContainer = new PIXI.Container();
    this.table = new tableRenderer(this.game, this.app, this.tableContainer)
    this.hand = new handRenderer(this.game, this.app, this.handContainer)
    this.deck = new deckRenderer(this.hand)
  }

  public async init() {
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
      this.hand.renderFallbackHand();
      this.deck.renderFallbackDeck();
      this.table.renderFallbackTable();
    } else {
      this.hand.renderHand(); //Exemplo de renderização sem fallback
      this.deck.renderDeck();
    }
    
    this.app.stage.addChild(this.handContainer);
    this.app.stage.addChild(this.tableContainer);
  }

  refresh() {
    this.table.refresh();
    this.hand.refresh();
  }

 
}