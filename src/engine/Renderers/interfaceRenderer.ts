import * as PIXI from 'pixi.js';
import { Game } from '../game';

type uiStyleType = {
    lifeStyle: PIXI.TextStyle;
    roundStyle: PIXI.TextStyle;
    goldStyle: PIXI.TextStyle;
}

export class uiRenderer {
    game: Game;
    app: PIXI.Application;
    interfaceContainer: PIXI.Container;

    life: number = 10
    round: number = 0
    gold: number = 0

    lifeText!: PIXI.Text;
    roundText!: PIXI.Text;
    goldText!: PIXI.Text;

    textStyle: uiStyleType = this.uiTextStyle();

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

        this.interfaceContainer.addChild(this.lifeText, this.roundText, this.goldText);
    }

    public updateLife(newLife: number) {
        this.life = newLife;
        if (this.lifeText) {
            this.lifeText.text = this.life.toString();
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

    private uiText() {
        const life = this.createLifeText()
        const round = this.createRoundText()
        const gold = this.createGoldText()
      
        return { life, round, gold } 
    }

    private createLifeText() {
        const life = new PIXI.Text({
            text: this.life,
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

    private createRoundText() {
        const round = new PIXI.Text({
            text: this.round,
            style: this.textStyle.roundStyle,
        });

        round.x = this.app.renderer.width - round.width - 10;
        round.y = 100;

        return round
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

        return { lifeStyle, roundStyle, goldStyle }
    }
}