import { Deck } from './deck.ts';
import { Player } from './player.ts';
import { Logger } from './logger.ts';

const deck = new Deck();
const dealer = new Player({ deck, dealer: true });

const player = prompt('How many players do you want to have 1-4');
const amount = parseInt(player as string);
const players = [];
for (let i = 0; i < amount; i++) {
   players.push(new Player({ deck, name: `Player ${i}` }));
}
const logger = new Logger({ deck, dealer, player: players });
const hud = (skipped?: boolean) => logger.hud(skipped);

hud();
for (let i = 0; i < players.length; i++) {
   players[i].handleTurn(hud);
}
//TODO check for dealer cards
console.log('Game ended');
