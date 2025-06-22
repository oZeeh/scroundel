import { Card } from "../cardType";
import { Game } from "../game";
import { GameRenderer } from "../gameRenderer";

export class gameController {
    private selectedPlayerCard: Card | null = null;
    private selectedEnemyCard: Card | null = null;
    private renderer: GameRenderer;
    private game: Game;

    constructor(gameRenderer: GameRenderer, game: Game) {
        this.renderer = gameRenderer;
        this.game = game;
        gameRenderer.hand.onCardSelected = (card: Card) => this.selectPlayerCard(card);
        gameRenderer.table.onCardSelected = (card: Card) => this.selectEnemyCard(card);
    }

    private selectPlayerCard(card: Card) {
        this.selectedPlayerCard = card;
        this.tryPerformAction();
    }

    private selectEnemyCard(card: Card) {
        this.selectedEnemyCard = card;
        this.tryPerformAction();
    }

    private tryPerformAction() {
        this.renderer.userInterface.updateRound();

        if (this.selectedPlayerCard!.type == "gold") {
            this.discardCard(this.selectedPlayerCard!)
            this.renderer.userInterface.updateGold();
        }

        if (this.selectedPlayerCard?.type == "weapon" && this.selectedEnemyCard) {
            if (this.selectedPlayerCard.value > this.selectedEnemyCard.value) {
                this.discardCard(this.selectedEnemyCard)
            }
            else {
                this.discardCard(this.selectedPlayerCard)
                this.renderer.userInterface.updateLife(this.selectedEnemyCard.value - this.selectedPlayerCard.value);
            }

            this.renderer.hand.refresh();
            this.renderer.table.refresh();

            this.selectedPlayerCard = null;
            this.selectedEnemyCard = null;
        }

        
    }

    private discardCard(card: Card) {
        this.game.playCardFromHand(card);
        this.renderer.hand.refresh();
    }
}