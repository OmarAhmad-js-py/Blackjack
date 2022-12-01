import { Deck, TCardDefinitive } from './deck.ts';
import { randomUUID } from 'https://deno.land/std@0.165.0/node/crypto.ts';
import { hud } from './logger.ts';

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
   private dealer: boolean;
   private status?: boolean;
   private deck: Deck;
   private readonly _hand: TCardDefinitive[];

   constructor(props: IPlayerProps) {
      this.deck = props.deck;
      this.name = props.dealer!!
         ? 'Dealer'
         : props.name
         ? props.name
         : randomUUID();
      this.dealer = props.dealer!!;
      this.status = undefined;
      this._hand = [];

      this.handleDraw({ silent: true });
      this.handleDraw({ silent: true, invisible: props.dealer!! });
   }

   get getName(): string {
      return this.name;
   }

   get hand(): TCardDefinitive[] {
      return this._hand;
   }

   get didLose(): boolean {
      let cardSum = this.getCardSum();
      if (cardSum > 21) {
         console.log(
            `You lost. Your score is ${cardSum} and ${cardSum - 21} over 21`,
         );
         this.status = false;
         return true;
      }
      return false;
   }

   getCardSum(): number {
      return this._hand.reduce((acc, x) => acc + x.value, 0);
   }

   handleTurn() {
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
      if (!this.cardPrompt()) return;
   }

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

   cardPrompt(): boolean {
      let flag = true;
      while (flag) {
         const x = prompt('[D]raw another card or [S]kip ?');
         if (!x) continue;
         const input = x.toLowerCase();
         switch (input) {
            case 'd': {
               this.handleDraw({});
               if (this.didLose) return false;
               flag = false;
               break;
            }
            case 's': {
               console.log('Round skipped');
               flag = false;
               break;
            }
         }
      }
      return true;
   }
}

const deck = new Deck();
const dealer = new Player({ deck, dealer: true });
const one = new Player({ deck, name: 'Player 1' });
const two = new Player({ deck, name: 'Player 2' });
hud({ deck: deck, player: [one, two], dealer: dealer });
one.handleTurn();
hud({ deck: deck, player: [one, two], dealer: dealer });
one.handleTurn();
hud({ deck: deck, player: [one, two], dealer: dealer });
