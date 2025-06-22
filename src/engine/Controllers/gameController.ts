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
    }

    private tryPerformAction() {

        this.renderer.userInterface.updateRound();

        if (this.selectedPlayerCard!.type == "gold") {
            this.playCard(this.selectedPlayerCard!)
            this.renderer.userInterface.updateGold();
        }

        if (this.selectedPlayerCard?.type == "weapon" && this.selectedEnemyCard) {
            //this.renderer.userInterface.updateLife(9);
            // Aqui você executa o efeito do jogo real.
            // Exemplo: remove o inimigo se for arma, reduz valor, cura, etc.
            

            // Depois de agir:
            

            this.renderer.hand.refresh();
            this.renderer.table.refresh();
        }

        this.selectedPlayerCard = null;
        this.selectedEnemyCard = null;
    }

    private playCard(card: Card) {
        this.game.playCardFromHand(card);
        this.renderer.hand.refresh();
    }
}