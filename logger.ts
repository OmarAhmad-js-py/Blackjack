import { Deck } from './deck.ts';
import { Player } from './player.ts';

interface ILoggerProps {
   deck: Deck;
   player: Player[];
   dealer: Player;
}

/**
 * @function interface
 * @param {ILoggerProps} props - The props to configure the interface.
 * @description Outputs the blackjack game information to the console.
 */
export function hud(props: ILoggerProps) {
   const { dealer, deck, player } = props;
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
               return x.invisible ? cardHiddenText : `${x.name} of ${x.suit}`;
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
                        : y.invisible
                        ? cardHiddenText
                        : `${y.name} of ${y.suit}`
                     ).length,
               )
               .reduce((acc, i) => (acc > i ? acc : i)),
         ),
      );
   console.table([
      loopData.map(x => x.getName),
      divider('-'),
      ...tabularData,
      divider('-'),
   ]);
}
