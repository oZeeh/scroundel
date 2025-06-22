import { Card } from "../cardType";
import { GameRenderer } from "../gameRenderer";

export class gameController {
    private selectedPlayerCard: Card | null = null;
    private selectedEnemyCard: Card | null = null;
    private game: GameRenderer;
    private shouldPerformAction: boolean = true;

    constructor(game: GameRenderer) {
        this.game = game
        game.hand.onCardSelected = (card: Card) => this.selectPlayerCard(card);
        game.table.onCardSelected = (card: Card) => this.selectEnemyCard(card);
    }

    private selectPlayerCard(card: Card) {
        this.selectedPlayerCard = card;
        console.log('Selected player card:', card);

        if (this.selectedPlayerCard.type == "weapon") 
        {
            this.shouldPerformAction = true;
        }

    }

    private selectEnemyCard(card: Card) {
        this.selectedEnemyCard = card;
        console.log('Selected enemy card:', card);
        this.tryPerformAction(this.shouldPerformAction);
    }

    private tryPerformAction(perform: boolean) {
        if (!perform) {
            return
        }

        if (this.selectedPlayerCard && this.selectedEnemyCard) {
            console.log(`Player used ${this.selectedPlayerCard.type} on ${this.selectedEnemyCard.type}`);
            this.game.userInterface.updateLife(9);
            this.game.userInterface.updateRound();
            // Aqui você executa o efeito do jogo real.
            // Exemplo: remove o inimigo se for arma, reduz valor, cura, etc.

            // Depois de agir:
            this.selectedPlayerCard = null;
            this.selectedEnemyCard = null;

            this.game.hand.refresh();
            this.game.table.refresh();
        }
  }
}