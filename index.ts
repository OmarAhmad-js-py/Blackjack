import { Deck } from './deck.ts';
import { Player } from './player.ts';
import { Dealer } from './dealer.ts';
import opine, {
   HTTPSOptions,
   json,
   serveStatic,
   urlencoded,
} from 'https://deno.land/x/opine@2.3.3/mod.ts';
import { renderFile } from 'https://deno.land/x/deno_ejs@v0.2.5/mod.ts';
import { dirname, join } from 'https://deno.land/x/opine@2.3.3/deps.ts';
import { Logger } from './logger.ts';

const app = opine();

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

/*
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

logger.hud({ end: true, custom: dealerDrew });*/
app.engine('ejs', renderFile);
app.set('view engine', 'ejs');
const __dirname = dirname(import.meta.url);
app.use(serveStatic(join(__dirname, 'public')));
app.use(json());
app.use(urlencoded());

const deck = new Deck();
const dealer = new Dealer({ deck });
const players: Player[] = [];
let current = 0;
let dealerDrew = '';

app.post('/set-players', async (_req, res) => {
   const { amount } = _req.body;
   const parsedAmount = parseInt(amount as string);
   if (!!parsedAmount && parsedAmount > 0 && parsedAmount < 5) {
      for (let i = 0; i < parsedAmount; i++) {
         players.push(new Player({ deck, name: `Player ${i + 1}` }));
      }
      res.redirect('/');
   } else {
      res.redirect('/');
   }
});

app.get('/stay', (_req, res) => {
   if (current + 1 < players.length) {
      current += 1;
      res.redirect('/');
   } else {
      res.redirect('/');
   }
});

app.get('/hit', (_req, res) => {
   const player = players[current];
   player.handleDraw({});
   res.redirect('/');
});

app.get('/player/:id', (_req, res) => {
   const id = parseInt(_req.params.id);
   if (id >= 0 && id < players.length) {
      current = id;
      res.redirect('/');
   }
});

app.get('/end', (_req, res) => {
   if (!players.length) res.redirect('/');
   if (dealer.getCardSum() < 17) {
      dealer.silentDraw(x => (dealerDrew = x));
   }
   const logger = new Logger({ deck, dealer, player: players });
   const logs = logger.hud({ end: true, custom: dealerDrew, api: true });
   res.render('end', { players, dealer, dealerDrew, logs });
});

app.get('/', (_req, res) => {
   if (!players.length) {
      for (let i = 0; i < 4; i++) {
         players.push(new Player({ deck, name: `Player ${i + 1}` }));
      }
      res.redirect('/');
      res.render('setplayers');
   } else res.render('index', { players, current, dealer });
});

app.listen({ port: 3000 } as HTTPSOptions, () => {
   console.log('Listening on port 3000');
});
