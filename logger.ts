import { Deck } from './deck.ts';
import { Player } from './player.ts';

interface ILoggerProps {
   deck: Deck;
   player: Player[];
   dealer: Player;
}

export class Logger {
   private dealer: Player;
   private deck: Deck;
   private player: Player[];

   constructor(props: ILoggerProps) {
      const { dealer, deck, player } = props;
      this.dealer = dealer;
      this.deck = deck;
      this.player = player;
   }

   /**
    * @function interface
    * @param {ILoggerProps} props - The props to configure the interface.
    * @description Outputs the blackjack game information to the console.
    */
   hud(props: { skipped?: string; end?: boolean; custom?: string }) {
      const { dealer, deck, player } = this;
      const { end, skipped, custom } = props;
      console.clear();
      console.info(
         `Blackjack game running with ${player.length} player against the Dealer \n`,
      );
      const cardHiddenText = '<Card Hidden>';
      const loopData = [dealer, ...player];
      const highest = loopData
         .map(x => x.hand.length)
         .reduce((acc, i) => (acc > i ? acc : i));
      const tabularData = [];
      for (let i = 0; i <= highest - 1; i++) {
         const cardRow = [];
         for (const data of loopData) {
            const currentCard = data.hand[i];
            if (!currentCard) {
               cardRow.push([]);
               continue;
            }
            cardRow.push(data.hand[i]);
         }
         tabularData.push(
            cardRow.map(x => {
               if (Array.isArray(x)) return '';
               else {
                  return !end && x.invisible
                     ? cardHiddenText
                     : `${x.name} of ${x.suit}`;
               }
            }),
         );
      }
      const divider = (s: string) =>
         loopData.map(x =>
            s.repeat(
               [...x.hand, x.getName]
                  .map(
                     y =>
                        (typeof y === 'string'
                           ? y
                           : !end && y.invisible
                           ? cardHiddenText
                           : `${y.name} of ${y.suit}`
                        ).length,
                  )
                  .reduce((acc, i) => (acc > i ? acc : i)),
            ),
         );

      function displaySum(x: Player) {
         const sum = x.getCardSum();
         if (sum > 21) return sum + ' ' + 'Lost';
         if (sum === 21) return sum + ' ' + 'Won';
         if (sum < 21) return sum;
      }

      console.table([
         loopData.map(x => x.getName),
         divider('-'),
         ...tabularData,
         divider('-'),
         loopData.map(x =>
            !end
               ? x.hand.map(y => y.invisible).every(z => z === false)
                  ? displaySum(x)
                  : 'Hidden'
               : displaySum(x),
         ),
      ]);
      skipped &&
         (deck.left !== 0
            ? console.log(skipped + ' skipped this round')
            : console.log('Deck empty, game ended'));
      if (end) {
         console.log('Game ended, all cards revealed.');
         custom && console.log(custom);
         const highestSum = [...loopData]
            .map(x => x.getCardSum())
            .reduce((acc, i) =>
               acc > 21 ? i : i <= 21 ? (acc > i ? acc : i) : acc,
            );
         const highest = loopData.filter(x => x.getCardSum() === highestSum);
         if (highest.length > 0 && highestSum > 0) {
            console.log(
               `The highest allowed score of this round was ${highestSum} which ${
                  highest.length === 1 && highest[0].isDealer ? 'the ' : ''
               }${
                  highest.length > 1
                     ? `${highest.length} players got`
                     : `${highest[0].getName} got`
               }.`,
            );
            if (highest.length > 1) {
               console.log(`Players won with score of ${highestSum}:`);
               highest.map(x => console.log(` - ${x.getName}`));
            }
         } else console.log('Nobody won');
      }
   }
}
