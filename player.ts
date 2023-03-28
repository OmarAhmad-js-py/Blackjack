import { Deck, TCardDefinitive } from './deck.ts';
import { randomUUID } from 'https://deno.land/std@0.165.0/node/crypto.ts';

interface IPlayerProps {
   name?: string;
   dealer?: boolean;
   deck: Deck;
}

interface IHandeDrawProps {
   silent?: boolean;
   invisible?: boolean;
}

export class Player {
   private readonly name: string;
   private readonly dealer: boolean;
   private status?: boolean;
   private readonly deck: Deck;
   private readonly _hand: TCardDefinitive[];

   constructor(props: IPlayerProps) {
      this.deck = props.deck;
      this.name = props.name ? props.name : randomUUID();
      this.status = undefined;
      this._hand = [];

      this.handleDraw({ silent: true });
      this.handleDraw({ silent: true, invisible: props.dealer! });
   }

   /**
    * Returns the name of the player.
    * @return {string} The name of the player.
    */
   get getName(): string {
      return this.name;
   }

   /**
    * Returns the cards in the player's hand.
    * @return {TCardDefinitive[]} The cards in the player's hand.
    */
   get hand(): TCardDefinitive[] {
      return this._hand;
   }

   /**
    * Checks if the player has lost.
    * @return {boolean} Whether the player has lost.
    */
   get didLose(): boolean {
      const cardSum = this.getCardSum();
      if (cardSum > 21) {
         console.log(
            `You lost. Your score is ${cardSum} and ${cardSum - 21} over 21`,
         );
         this.status = false;
         return true;
      }
      return false;
   }

   /**
    * Checks if the player has won.
    * @return {boolean} Whether the player has won.
    */
   get didWin(): boolean {
      return this.getCardSum() === 21;
   }

   /**
    * @returns {boolean} Returns a boolean value signifying whether the player is a dealer or not.
    */
   get isDealer(): boolean {
      return this.dealer;
   }

   /**
    * @returns {number} Returns the sum of all cards in the hand.
    */
   getCardSum(): number {
      return this._hand.reduce((acc, x) => acc + x.value, 0);
   }

   /**
    * @param {(skipped?: string) => void} callback - A callback function that is executed depending on the result of the turn.
    *
    * Checks if the deck is empty, if the sum of the cards in the hand is 21, and if the status is undefined. If all of those conditions are met, calls the cardPrompt function.
    */
   handleTurn(callback: (skipped?: string) => void) {
      if (this.deck.left === 0) return;
      if (this.getCardSum() === 21) {
         console.log(
            `Player ${this.name} won immediately because they got a sum of 21`,
         );
         this.status = true;
      }
      if (this.status !== undefined) {
         console.log(
            `Player ${this.name} already ${
               this.status === false
                  ? 'lost'
                  : this.status === true
                  ? 'won'
                  : 'unknown'
            }, skipping...`,
         );
         return;
      }
      if (!this.cardPrompt(callback)) return;
   }

   /**
    * @param {IHandeDrawProps} props - A set of properties that are used to determine if the card should be invisible and if the draw should be silent.
    *
    * Draws a card from the deck and updates the hand with the new card.
    */
   handleDraw(props: IHandeDrawProps): void {
      const { invisible, silent } = props;
      const card = this.deck.card(this.getCardSum());
      if (invisible) card.invisible = true;
      !silent &&
         console.log(
            `${this.name} drew a card and got ${card.name} of ${card.suit}`,
         );
      this._hand.push(card);
   }

   /**
    * @param {(skipped?: string) => void} callback - A callback function that is executed depending on the result of the prompt.
    *
    * Prompts the user to either draw another card or skip their turn.
    */
   cardPrompt(callback: (skipped?: string) => void): boolean {
      let flag = true;
      while (flag) {
         console.log(`It's ${this.name}'s turn:`);
         const x = prompt('[D]raw another card or [S]kip ?');
         if (!x) continue;
         const input = x.toLowerCase();
         switch (input) {
            case 'd': {
               this.handleDraw({});
               if (this.didLose || this.didWin) {
                  callback();
                  if (this.didWin) console.log(this.name + ' won');
                  return false;
               }
               callback();
               break;
            }
            case 's': {
               console.log('Round skipped');
               callback(this.name);
               flag = false;
               return false;
            }
         }
      }
      return true;
   }
}
