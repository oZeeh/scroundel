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

    public updateLife(newLife: number) {
        this.interfaceContainer.removeChildren();
        this.life = newLife;
        this.interfaceContainer.addChild(this.createLifeText());

    }

    public updateRound() {
        this.interfaceContainer.removeChildren(this.round);
        this.round++;
        this.interfaceContainer.addChild(this.createRoundText());
    }

    public updateGold(gold: number) {
        this.interfaceContainer.removeChildren();
        this.gold = this.gold + gold
        this.interfaceContainer.addChild(this.createGoldText());
    }

    public renderUi() {
        const uiText = this.uiText();
        this.interfaceContainer.addChild(uiText.life)
        this.interfaceContainer.addChild(uiText.round)
        this.interfaceContainer.addChild(uiText.gold)
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