/**
 * Return an random index of a given array
 * @param {any[]} values
 * @returns {number}
 */
export function getRandomIndex(values: any[]): number {
   return Math.floor(Math.random() * values.length);
}

/**
 * Returns a random item of an given array
 * @param {any[]} values
 * @returns {any}
 */
export function getRandomValue(values: any[]): any {
   return values[getRandomIndex(values)];
}

/**
 * Takes an array of values and rearranges them randomly
 * @param {any[]} array
 * @returns {any[]}
 */
export function shuffleArray(array: any[]) {
   let currentIndex = array.length, randomIndex;
   while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }
   return array;
}
