import { Deck } from './deck.ts';
import { Player } from './player.ts';
import { Logger } from './logger.ts';
import axiod from 'https://deno.land/x/axiod/mod.ts';
import process from 'https://deno.land/std@0.165.0/node/process.ts';
import { Dealer } from './dealer.ts';

//noinspection SpellCheckingInspection
interface IJoke {
   error: boolean;
   category: string;
   type: 'single' | 'twopart';
   joke?: string;
   setup?: string;
   delivery?: string;
   flags: {
      nsfw: boolean;
      religious: boolean;
      political: boolean;
      racist: boolean;
      sexist: boolean;
      explicit: boolean;
   };
   id: number;
   safe: boolean;
   lang: string;
}

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

process.stdout.write('Getting joke...');

async function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

await axiod
   .get(
      'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,racist,sexist,explicit',
   )
   .then(async x => {
      console.log('Done');
      const data = x.data as IJoke;
      if (data.type === 'single') {
         console.log("Today's joke:\n" + x.data.joke);
      } else if (data.type === 'twopart') {
         console.log(data.setup);
         await sleep(2000);
         console.log(data.delivery);
      }
      console.log('');
   })
   .catch((e: any) => {
      console.log('Error getting joke: ' + e);
   });

const deck = new Deck();
const dealer = new Dealer({ deck });

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
