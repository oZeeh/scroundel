import * as PIXI from 'pixi.js';
import { Game } from '../game';

type uiStyleType = {
    lifeStyle: PIXI.TextStyle;
    roundStyle: PIXI.TextStyle;
    goldStyle: PIXI.TextStyle;
    killedEnemiesStyle: PIXI.TextStyle;
}

export class uiRenderer {
    private game: Game;
    private app: PIXI.Application;
    private interfaceContainer: PIXI.Container;

    private round: number = 0
    private gold: number = 0
    private killedEnemies: number = 0

    private lifeText!: PIXI.Text;
    private roundText!: PIXI.Text;
    private goldText!: PIXI.Text;
    private killedEnemiesText!: PIXI.Text;
    messageText: PIXI.Text | null = null;
    restartButton: PIXI.Text | null = null;

    private textStyle: uiStyleType = this.uiTextStyle();

    constructor(
        game: Game,
        app:  PIXI.Application<PIXI.Renderer>,
        interfaceContainer: PIXI.Container<PIXI.ContainerChild>
    ) {
        this.game = game
        this.app = app
        this.interfaceContainer = interfaceContainer
    }

    public renderUi() {
        const uiText = this.uiText();
        this.lifeText = uiText.life;
        this.roundText = uiText.round;
        this.goldText = uiText.gold;
        this.killedEnemiesText = uiText.enemiesKilled

        this.interfaceContainer.addChild(this.lifeText, this.roundText, this.goldText, this.killedEnemiesText);
    }

    public updateLife(newLife: number) {
        this.game.setLife(newLife);
        if (this.lifeText) {
            this.lifeText.text = this.game.getLife();
        }

    }

    public updateRound() {
        this.round++;
        if (this.roundText) {
            this.roundText.text = this.round.toString();
        }
    }

    public updateGold() {
        this.gold++;
        if (this.goldText) {
            this.goldText.text = this.gold.toString();
        }
    }

    public updateEnemiesKilled() {
        this.killedEnemies++
        if (this.killedEnemiesText) {
            this.killedEnemiesText.text = this.killedEnemies.toString();
        }
    }

    private uiText() {
        const life = this.createLifeText()
        const round = this.createRoundText()
        const gold = this.createGoldText()
        const enemiesKilled = this.createEnemiesKilledText();
      
        return { life, round, gold, enemiesKilled } 
    }

    private createLifeText() {
        const life = new PIXI.Text({
            text: this.game.getLife(),
            style: this.textStyle.lifeStyle,
        });

        life.x = this.app.renderer.width - life.width - 10;
        life.y = 10;

        return life;
    }

    private createGoldText() {
        const gold = new PIXI.Text({
            text: this.gold,
            style: this.textStyle.goldStyle,
        });

        gold.x = this.app.renderer.width - gold.width - 10;
        gold.y = 200;

        return gold;
    }

    showEndMessage(message: string, onRestart: () => void) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 'yellow',
            stroke: 'black',
        });

        this.messageText = new PIXI.Text({
            text: message,
            style: style
        });

        this.messageText.anchor.set(0.5);
        this.messageText.x = this.app.renderer.width / 2;
        this.messageText.y = this.app.renderer.height / 2 - 100;
        this.app.stage.addChild(this.messageText);

        const buttonStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 'white',
            stroke: 'black',
        });

        this.restartButton = new PIXI.Text({
            text: 'Restart',
            style: buttonStyle
        });

        this.restartButton.anchor.set(0.5);
        this.restartButton.x = this.app.renderer.width / 2;
        this.restartButton.y = this.app.renderer.height / 2 + 50;
        this.restartButton.eventMode = 'static';
        this.restartButton.cursor = 'pointer';

        this.restartButton.on('pointerdown', () => {
            onRestart();
        });

        this.app.stage.addChild(this.restartButton);
    }

    clearEndMessage() {
        if (this.messageText) this.app.stage.removeChild(this.messageText);
        if (this.restartButton) this.app.stage.removeChild(this.restartButton);
    }

    private createRoundText() {
        const round = new PIXI.Text({
            text: this.round,
            style: this.textStyle.roundStyle,
        });

        round.x = this.app.renderer.width - round.width - 10;
        round.y = 100;

        return round
    }

    private createEnemiesKilledText() {
        const killedEnemies = new PIXI.Text({
            text: this.killedEnemies,
            style: this.textStyle.killedEnemiesStyle
        })

        killedEnemies.x = this.app.renderer.width - killedEnemies.width - 10;
        killedEnemies.y = 300;

        return killedEnemies
    }

    private uiTextStyle() {
        const lifeStyle = new PIXI.TextStyle({
            fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
            fontSize: 64,
            fill: '#E3170A',
        })

        const roundStyle = new PIXI.TextStyle({
            fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
            fontSize: 64,
            fill: '#4A2040',
        })

        const goldStyle = new PIXI.TextStyle({
            fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
            fontSize: 64,
            fill: '#F5BB00',
        })

        const killedEnemiesStyle = new PIXI.TextStyle({
            fontFamily: 'Noto Emoji, DejaVu Sans, sans-serif',
            fontSize: 64,
            fill: '#FAFDF6'
        })

        return { lifeStyle, roundStyle, goldStyle, killedEnemiesStyle }
    }
}