import { Deck, TCardDefinitive } from './deck.ts';
import { randomUUID } from 'https://deno.land/std@0.165.0/node/crypto.ts';

interface IPlayerProps {
   name?: string;
   dealer?: boolean;
   deck: Deck;
}

interface IHandeDrawProps {
   i?: boolean;
   silent?: boolean;
   invisible?: boolean;
}

class Player {
   private readonly name: string;
   private dealer: boolean;
   private status?: boolean;
   private deck: Deck;
   private readonly _hand: TCardDefinitive[];

   constructor(props: IPlayerProps) {
      this.deck = props.deck;
      this.name = props.name ? props.name : randomUUID();
      this.dealer = props.dealer!!;
      this.status = undefined;
      this._hand = [];

      this.handleDraw({ i: true, silent: true });
      this.handleDraw({ i: true, silent: true, invisible: props.dealer!! });
   }

   get hand(): TCardDefinitive[] {
      return this._hand;
   }

   get didLose(): boolean {
      let cardSum = this.getCardSum();
      if (cardSum > 21) {
         console.log(`You lost. Your score is ${cardSum} and ${cardSum - 21} over 21`);
         this.status = false;
         return true;
      }
      return false;
   }

   getCardSum(): number {
      return this._hand.reduce((acc, x) => acc + x.value, 0);
   }

   logCardSum(i?: boolean): void {
      console.log(`${i ? 'You' : this.name} currently ${i ? 'have' : 'has'} a sum of ${this.getCardSum()} with ${this._hand.length} card${this._hand.length > 1 ? 's' : ''}`);
      if (i) {
         console.log('Cards on hand:');
         for (let tCardDefinitive of this._hand) {
            console.log(` - ${tCardDefinitive.name} of ${tCardDefinitive.suit}`);
         }
      }
   }

   handleTurn() {
      if (this.getCardSum() === 21) {
         console.log('You won immediately because you got a sum of 21');
         this.status = true;
      }
      if (this.status !== undefined) {
         console.log(`Player ${this.name} already ${this.status === false ? 'lost' : this.status === true ? 'won' : 'unknown'}, skipping...`);
         return;
      }
      this.logCardSum(true);
      if (!this.cardPrompt()) return;
   }

   handleDraw(props: IHandeDrawProps): void {
      const { i, invisible, silent } = props;
      const card = this.deck.card(this.getCardSum());
      if (invisible) card.invisible = true;
      !silent && console.log(`${i ? 'You' : this.name} drew a card${i ? ` and got ${card.name} of ${card.suit}` : '.'}`);
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
               this.handleDraw({ i: true });
               if (this.didLose) return false;
               this._hand.length > 1 && this.logCardSum(true);
               flag = false;
               break;
            }
            case 's': {
               console.log('Round skipped');
               flag = false;
               break;
            }
            default:
               console.clear();
         }
      }
      return true;
   }
}

const deck = new Deck();
const one = new Player({ deck });
console.log(one.handleTurn());
