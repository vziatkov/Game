/**
 * Point-free (pipe-friendly) version of Math.min
 * Returns a curried function that can be used in function composition
 * 
 * @param threshold - The threshold value for comparison
 * @returns A function that takes a value and returns the minimum of the two
 * 
 * @example
 * const clampTo100 = minFreePipe(100);
 * clampTo100(150); // returns 100
 * clampTo100(50);  // returns 50
 * 
 * @example
 * // In a pipe/composition
 * const processValue = (value: number) => minFreePipe(100)(value * 2);
 */
export const minFreePipe = (threshold: number) => (value: number): number => {
  return Math.min(threshold, value);
};
