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
        if (!this.selectedPlayerCard) {
            return
        }

        if (this.selectedPlayerCard.type == "gold") {
            this.discardCard(this.selectedPlayerCard!)
            this.renderer.userInterface.updateGold();
            this.renderer.userInterface.updateRound();
        }

        if (this.selectedPlayerCard.type == "health") 
        {
            this.renderer.userInterface.updateLife(this.selectedPlayerCard.value)
            this.discardCard(this.selectedPlayerCard)
        }

        if (this.selectedPlayerCard.type == "weapon" && this.selectedEnemyCard) {
            if (this.selectedPlayerCard.value > this.selectedEnemyCard.value) {
                this.discardCard(this.selectedEnemyCard)
                this.renderer.userInterface.updateEnemiesKilled()
                this.game.refillTable()
            }
            else if (this.selectedPlayerCard.value == this.selectedEnemyCard.value) {
                const cardsToBeDiscarded: Card[] = [this.selectedPlayerCard, this.selectedEnemyCard]
                this.discardManyCards(cardsToBeDiscarded)
                this.renderer.userInterface.updateEnemiesKilled()
                this.game.refillTable()
            }
            else {
                this.discardCard(this.selectedPlayerCard)
                this.renderer.userInterface.updateLife(this.selectedPlayerCard.value - this.selectedEnemyCard.value);
            }

            this.renderer.hand.refresh();
            this.renderer.table.refresh();

            this.selectedPlayerCard = null;
            this.selectedEnemyCard = null;

            this.renderer.userInterface.updateRound();
        }

        if (this.game.isGameLost()) {
            console.log("PERDEU")
            this.renderer.userInterface.showEndMessage("You Lose!", () => this.restartGame());
            return
        }

        if (this.game.isGameWon()) {
            console.log("GANHOU")
            this.renderer.userInterface.showEndMessage("Venceu!", ()=> this.restartGame())
            return
        }
    }

    private discardCard(card: Card) {
        if (card.type == "enemy") {
            this.game.playCardFromTable(card)
        }
        else {
            this.game.playCardFromHand(card);
        }

        this.renderer.hand.refresh();
    }

    private discardManyCards(card: Card[]) {
        for (let i = 0; i < card.length; i++)
        {
            this.discardCard(card[i])
        }
    }

    private restartGame() {
        this.game = new Game();
        this.renderer.game = this.game;

        this.renderer.table.refresh();
        this.renderer.hand.refresh();
        this.renderer.userInterface.clearEndMessage();

    }
}