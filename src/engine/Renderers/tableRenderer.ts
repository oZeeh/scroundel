import * as PIXI from 'pixi.js';
import { Card } from "../cardType";
import { Game } from "../game";
import { getCardSymbol } from '../cardSymbols';
import { Text } from 'pixi.js';


export class tableRenderer {
    game: Game;
    app: PIXI.Application;
    tableContainer: PIXI.Container;

    onCardSelected: ((card: Card) => void) | null = null;

    constructor(
        game: Game,
        app:  PIXI.Application<PIXI.Renderer>,
        tableContainer: PIXI.Container<PIXI.ContainerChild>
    ) {
        this.game = game
        this.app = app
        this.tableContainer = tableContainer
    }

    public refresh() {
        this.renderFallbackTable()
    } 

    public renderFallbackTable() {
        this.tableContainer.removeChildren();

        this.game.table.forEach((card, index) => {
            const cardText = this.createTableSpriteFallback(card, index)
            this.tableContainer.addChild(cardText);
        });
    }

    private createTableSpriteFallback(card: Card, index: number): Text {
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

        const tableWidth = this.game.table.length * 70;
        const startX = (this.app.renderer.width - tableWidth) / 2;
        const initialY = this.app.renderer.height / 2 - 150; 

        cardText.x = startX + index * 70;
        cardText.y = initialY;

        this.handleTableEvents(card, cardText)

        return cardText;
    }

    private handleTableEvents(card: Card, cardText: Text) {
        cardText.eventMode = 'static';
        cardText.cursor = 'pointer';
        const initialY = this.app.renderer.height / 2;

        cardText.on('pointerdown', () => {
            cardText.y = initialY - 30;
            this.onCardSelected!(card)
        })
    }
}