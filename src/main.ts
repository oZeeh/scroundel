import { gameController } from './engine/Controllers/gameController';
import { Game } from './engine/game';
import { GameRenderer } from './engine/gameRenderer';

function bootstrapStyle() {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
}

async function main() {
  const game = new Game();
  const renderer = new GameRenderer(game);
  await renderer.init();
  const controller = new gameController(renderer);
}

bootstrapStyle();
main();