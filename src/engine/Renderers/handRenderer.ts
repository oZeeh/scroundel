import { getCardSymbol } from "../cardSymbols";
import { Card } from "../cardType";
import { Game } from "../game";
import { Text } from 'pixi.js';
import * as PIXI from 'pixi.js';

export class handRenderer {
    private game: Game;
    private app: PIXI.Application;
    private handContainer: PIXI.Container;

    onCardSelected: ((card: Card) => void) | null = null;

    constructor(
        game: Game,
        app:  PIXI.Application<PIXI.Renderer>,
        handContainer: PIXI.Container<PIXI.ContainerChild>
    ) {
        this.game = game
        this.app = app
        this.handContainer = handContainer
    }

    public refresh() {
        this.renderFallbackHand()
    }

    public render() {
        this.handContainer.children.forEach(child => {
            if (child instanceof PIXI.Text) {
                child.removeAllListeners();
            }
        });
        this.handContainer.removeChildren();

        this.game.hand.forEach((card, index) => {
            const cardSprite = this.createCardSprite(card, index);
            this.handContainer.addChild(cardSprite);
        });
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

    
    public renderFallbackHand() {
        this.handContainer.children.forEach(child => {
            if (child instanceof PIXI.Text) {
                child.removeAllListeners();
            }
        });
        this.handContainer.removeChildren();

        this.game.hand.forEach((card, index) => {
            const cardText = this.createCardSpriteFallback(card);
            this.handleCardEvents(card, cardText, index); 
            this.handContainer.addChild(cardText);        
        });
    }

    private createCardSpriteFallback(card: Card): Text {
        const symbol = getCardSymbol(card);
        
        const cardTextStyle = new PIXI.TextStyle({
            fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
            fontSize: 64,
            fill: card.color,
        });

        const cardText = new Text({
            text: symbol,
            style: cardTextStyle,
        });

        return cardText;
    }

    private handleCardEvents(
        card: Card, 
        cardText: Text,
        index: number) {

        const handWidth = this.game.hand.length * 70;
        const initialX = (this.app.renderer.width - handWidth) / 2;
        const initialY = this.app.renderer.height / 2 + 150;
        let isSelected = false;

        cardText.x = initialX + index * 70;
        cardText.y = initialY;

        cardText.eventMode = 'static';
        cardText.cursor = 'pointer';

        cardText.on('pointerover', () => {
            cardText.y = initialY - 20;
        });

        cardText.on('pointerout', () => {
            if (!isSelected) {
                cardText.y = initialY;
            }
        });

        cardText.on('pointerdown', () => {
            isSelected = !isSelected
            cardText.y = initialY - 20;
            if (this.onCardSelected) {
                this.onCardSelected(card);
            }
        })
    }
}