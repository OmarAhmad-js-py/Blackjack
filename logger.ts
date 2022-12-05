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
   hud(props: { skipped?: string; end?: boolean }) {
      const { dealer, deck, player } = this;
      const { end, skipped } = props;
      console.clear();
      console.info(
         `Blackjack game running with ${player.length} player against the Dealer \n`,
      );
      const cardHiddenText = '<Card Hidden>';
      const loopData = [dealer, ...player];
      const highest = loopData
         .map(x => x.hand.length)
         .reduce((acc, i) => (acc > i ? acc : i));
      const tabularData: any[] = [];
      for (let i = 0; i <= highest - 1; i++) {
         const cardRow = [];
         for (let data of loopData) {
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
      let divider = (s: string) =>
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
         let sum = x.getCardSum();
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
      skipped && console.log(skipped + ' skipped this round');
      if (end) {
         console.log('Game ended, all cards revealed');
      }
   }
}