import { Player } from './player.ts';
import { Deck } from './deck.ts';

interface DealerProps {
   deck: Deck;
   dealer?: boolean;
}

export class Dealer extends Player {
   constructor(props: DealerProps) {
      super({ deck: props.deck, name: 'Dealer', dealer: true });
   }

   /**
    * @param {(s: string) => void} callback - A callback function that is executed after the draw.
    *
    * Draws cards from the deck until the sum of the cards in the hand is greater than or equal to 17.
    */
   silentDraw(callback: (s: string) => void) {
      let i = 0;
      while (this.getCardSum() < 17) {
         this.handleDraw({ silent: true });
         i++;
      }
      return callback(
         `The dealers sum was below 17, they drew ${i} card${
            i >= 2 ? 's' : ''
         }.`,
      );
   }
}
