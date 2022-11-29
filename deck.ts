import { getRandomIndex, shuffleArray } from './utils.ts';

type TCardValues = { name: string; value: number | number[] }[];
type suitsType = string[];

const suits: suitsType = ['Diamonds', 'Spades', 'Hearts', 'Clubs'];
const cardValues: TCardValues = [
   {
      name: 'Ace',
      value: [1, 11],
   },
   {
      name: '2',
      value: 2,
   },
   {
      name: '3',
      value: 3,
   },
   {
      name: '4',
      value: 4,
   },
   {
      name: '5',
      value: 5,
   },
   {
      name: '6',
      value: 6,
   },
   {
      name: '7',
      value: 7,
   },
   {
      name: '8',
      value: 8,
   },
   {
      name: '9',
      value: 9,
   },
   {
      name: '10',
      value: 10,
   },
   {
      name: 'Jack',
      value: 10,
   },
   {
      name: 'Queen',
      value: 10,
   },
   {
      name: 'King',
      value: 10,
   },
];

export type TCard = { suit: string; value: number | number[], name: string, invisible: boolean };
export type TCardDefinitive = { suit: string; value: number, name: string, invisible: boolean };
export type TDeck = TCard[];


/**
 * Card deck class
 */
export class Deck {
   constructor() {
      this._deck = [];
      this._used = [];
      this.reset(true);
   }

   private _deck: TDeck;

   /**
    * Gives back the current remaining deck
    * @returns {TDeck}
    */
   get deck(): TDeck {
      return this._deck;
   }

   private _used: TDeck;

   /**
    * Gives back the already drawn cards from the original deck
    * @returns {TDeck}
    */
   get used(): TDeck {
      return this._used;
   }

   /**
    * Gives back a combination of all cards used
    * @returns {TDeck}
    */
   get all(): TDeck {
      return [...this.used, ...this.deck];
   }

   /**
    * Draws a card, removes it from the deck and adds it to the used array,
    * then returns the object with the card values.
    *
    * If the value is uncertain it will prompt the user with a choice.
    * @returns {TCard}
    */
   card(currentSum?: number): TCardDefinitive {
      const index = getRandomIndex(this._deck);
      const element = this._deck[index];
      this._used.push(element);
      this._deck.splice(index, 1);
      if (Array.isArray(element.value)) {
         let flag = false;
         if (currentSum !== undefined) {
            let numbers = element.value as number[];
            const min = Math.min(...numbers);
            const max = Math.max(...numbers);
            element.value = ((currentSum + max) > 21) ? min : max;
         } else {
            console.log(`You drew an ${element.name + ' of ' + element.suit}, which value should this card have? [${element.value}]`);
            flag = true;
         }
         while (flag) {
            try {
               const input = prompt('Value:');
               if (!input) {
                  console.clear();
                  console.log(`Input missing [${element.value}]`);
                  continue;
               }

               const number = parseInt(input);
               if ((element.value as number[]).includes(number as number)) {
                  element.value = number;
                  flag = false;
               } else {
                  console.clear();
                  console.log(`Input mismatch [${element.value}]`);
               }
            } catch (e) {
               console.clear();
               console.log(`Input mismatch [${element.value}]`);
            }

         }
      }
      return element as TCardDefinitive;
   }

   /**
    * Reset deck to new random cards
    */
   reset(init?: boolean) {
      if (!init) {
         this._deck = [];
         this._used = [];
      }
      for (let suit of suits) {
         for (let cardValue of cardValues) {
            this._deck.push({ suit, name: cardValue.name, value: cardValue.value, invisible: false });
         }
      }
      shuffleArray(this._deck);
   }
}
