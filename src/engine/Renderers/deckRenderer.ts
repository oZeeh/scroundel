import { cardSymbols, getCardSymbol } from "../cardSymbols";
import { Card } from "../cardType";
import { Game } from "../game";
import { Text } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { handRenderer } from "./handRenderer";

export class deckRenderer {
    game: Game;
    app: PIXI.Application;
    handContainer: PIXI.Container;
    hand: handRenderer;
    
    constructor(
        hand: handRenderer
    ) {
        this.hand = hand
        this.game = hand.game
        this.app = hand.app
        this.handContainer = hand.handContainer
    }

    public renderFallbackDeck() {
        const deckText = this.createDeckSpriteFallback();
        this.app.stage.addChild(deckText);
    }

    public renderDeck() {
        this.handContainer.removeChildren();
        const deckSprite = this.createDeckSprite();
        this.handContainer.addChild(deckSprite);
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
        this.hand.refresh();
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
        this.hand.refresh();
      });

      return deckSprite;
  }

}