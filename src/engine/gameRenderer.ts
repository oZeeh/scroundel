import * as PIXI from 'pixi.js';
import { Game } from '../engine/game';
import { tableRenderer } from './Renderers/tableRenderer';
import { handRenderer } from './Renderers/handRenderer';
import { deckRenderer } from './Renderers/deckRenderer';
import { uiRenderer } from './Renderers/interfaceRenderer';

export class GameRenderer {
  public table: tableRenderer;
  public hand: handRenderer;
  public deck: deckRenderer;
  public userInterface: uiRenderer;

  public game: Game;

  private app: PIXI.Application;
  private handContainer: PIXI.Container;
  private tableContainer: PIXI.Container;
  private userIntefaceContainer: PIXI.Container;

  private shouldUseFallBackSpriteRender: boolean = false;

  constructor(game: Game) {
    this.game = game;

    this.app = new PIXI.Application();
    this.handContainer = new PIXI.Container();
    this.tableContainer = new PIXI.Container();
    this.userIntefaceContainer = new PIXI.Container();

    this.table = new tableRenderer(this.game, this.app, this.tableContainer)
    this.hand = new handRenderer(this.game, this.app, this.handContainer)
    this.deck = new deckRenderer(this.hand)
    this.userInterface = new uiRenderer(this.game, this.app, this.userIntefaceContainer)
  }

  public async init() {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#426A5A',
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

  this.userInterface.renderUi();
     
  if (this.shouldUseFallBackSpriteRender){
      this.hand.renderFallbackHand();
      this.deck.renderFallbackDeck();
      this.table.renderFallbackTable();
    } else {
      this.hand.render(); //Exemplo de renderização sem fallback
      this.deck.renderDeck();
    }
    
    this.app.stage.addChild(this.handContainer);
    this.app.stage.addChild(this.tableContainer);
    this.app.stage.addChild(this.userIntefaceContainer);
  }
}