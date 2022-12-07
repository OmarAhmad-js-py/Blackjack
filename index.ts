import { Deck } from './deck.ts';
import { Player } from './player.ts';
import { Logger } from './logger.ts';

function getPlayerAmount(): number {
   let playerAmount;
   while (typeof playerAmount !== 'number') {
      const player = prompt('How many players do you want to have 1-4');
      const amount = parseInt(player as string);
      console.log(amount);
      if (amount > 0 && amount < 5) {
         playerAmount = amount;
         break;
      }
      console.log('Please enter a number in the given range.');
   }
   return playerAmount;
}

const deck = new Deck();
const dealer = new Player({ deck, dealer: true });

const amount = getPlayerAmount();
const players = [];
for (let i = 0; i < amount; i++) {
   players.push(new Player({ deck, name: `Player ${i + 1}` }));
}
const logger = new Logger({ deck, dealer, player: players });
const hud = (skipped?: string, x?: string) =>
   logger.hud({ skipped, custom: x });

let dealerDrew;
hud();
for (let i = 0; i < players.length; i++) {
   players[i].handleTurn(hud);
}
if (dealer.getCardSum() < 17) {
   dealer.silentDraw(x => (dealerDrew = x));
}

logger.hud({ end: true, custom: dealerDrew });
