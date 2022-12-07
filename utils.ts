/**
 * This function takes an array of values as an argument and returns a random index of that array.
 *
 * @param {any[]} values - The array of values to select random index from.
 * @returns {number} - The random index of the passed array.
 */
export function getRandomIndex(values: any[]): number {
   return Math.floor(Math.random() * values.length);
}

/**
 * This function shuffles an array of any type by randomly swapping elements.
 * @param {any[]} array - Takes an array of any type as an input
 * @returns {any[]} - Returns an array of any type, with the values randomly shuffled
 *
 */
export function shuffleArray(array: any[]) {
   let currentIndex = array.length,
      randomIndex;
   while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex],
         array[currentIndex],
      ];
   }
   return array;
}
