type GameElement = true | false | "x";
type RepeatConfig = { countRepeat: number, winMultiplier: number, mass: GameElement[] };
/**
 * In the browser console, you will find the following RTP data for the chosen strategy:
 *
 * 1. Expected RTP (Return to Player) value for 100 million games.
 * 2. The lowest RTP value among 100 sets of one million games each.
 * 3. The highest RTP value among 100 sets of one million games each.
 *
 * Example for the strategy { ...second }:
 * This strategy involves always playing until the third level.
 *
 * Example console output:
 *
 * Variance smallest RTP: 95.3766
 * Expectation RTP: 95.98599
 * Variance biggest RTP: 96.4986
 */
export function doIt() {
    const allRTPs: number[] = [];
    console.log("DOING^ wait....");
    for (var i = 0; i < 100; i++) {
        allRTPs.push(doItOne());
    }

    const sortedRTPs: number[] = allRTPs.sort((a, b) => a - b);
    const expectation = sortedRTPs.reduce((acc, val) => acc + val, 0) / sortedRTPs.length;

    console.log('%c variance smallest RTP - ' + sortedRTPs[0], 'color: pink; font-weight: normal;');
    console.log('%c expectation RTP: ' + expectation, 'color: red; font-weight: bold;');
    console.log('%c variance biggest RTP + ' + sortedRTPs[sortedRTPs.length - 1], 'color: pink; font-weight: normal;');
}
/**
 * This function simulates a game strategy and calculates the RTP (Return to Player) percentage.
 * 
 * Strategies:
 * - first: Repeat once, win multiplier 2
 * - second: Repeat twice, win multiplier 6
 * - third: Repeat three times, win multiplier 26
 * - fourth: Repeat four times, win multiplier 78
 * - fifth: Repeat five times, win multiplier 235
 * - six: Repeat six times, win multiplier 675
 * - seven: Repeat seven times, win multiplier 2000
 * - eight: Repeat eight times, win multiplier 6000
 * - nine: Repeat nine times, win multiplier 17500
 * - ten: Repeat ten times, win multiplier 50000
 * - eleven: Repeat eleven times, win multiplier 120000
 * - twelve: Repeat twelve times, win multiplier 350000
 * - thirteen: Repeat thirteen times, win multiplier 1000000
 * 
 * Example Strategy:
 * The chosen strategy is { ...second }:
 * This strategy involves repeating a "progressive attempt" always twice.
 * You can add any number of items to the array, for example, [first, second, second, second, second, third, twelve, thirteen].
 * For each game, it will attempt one of the strategies and move to the next strategy in the array for the subsequent game.
 * 
 * @returns {number} The RTP (Return to Player) percentage.
 */
const countGames = 1000000;
const initialBet = 1;
const initialBalance = countGames * initialBet;
function doItOne(): number {
    const first = { countRepeat: 1, winMultiplier: 2, mass: [true, false, true, false, true, false, true, false, true, false, true, "x", false, false, true] as GameElement[] };
    const second = { countRepeat: 2, winMultiplier: 6, mass: [true, false, true, false, true, false, true, false, true, false, "x", "x", false, false, true] as GameElement[] };
    const third = { countRepeat: 3, winMultiplier: 26, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const fourth = { countRepeat: 4, winMultiplier: 78, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const fifth = { countRepeat: 5, winMultiplier: 235, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const six = { countRepeat: 6, winMultiplier: 675, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const seven = { countRepeat: 7, winMultiplier: 2000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const eight = { countRepeat: 8, winMultiplier: 6000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const nine = { countRepeat: 9, winMultiplier: 17500, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const ten = { countRepeat: 10, winMultiplier: 50000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const eleven = { countRepeat: 11, winMultiplier: 120000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const twelve = { countRepeat: 12, winMultiplier: 350000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };
    const thirteen = { countRepeat: 13, winMultiplier: 1000000, mass: [true, false, true, false, true, false, true, false, "x", false, "x", "x", false, false, true] as GameElement[] };

    const repeats: RepeatConfig[] = [
        { ...second },
    ];

    const finalBalance = simulateOneGame(repeats, countGames, initialBet, initialBalance);
    const rtp = ((finalBalance / initialBalance) * 100);
    return rtp;
}


function simulateOneGame(
    repeats: RepeatConfig[] = [],
    countGames: number = 1,
    initialBet: number = 1,
    initialBalance: number = 100,
    batchSize: number = 1000000
): number {
    let resBalance = initialBalance;
    let maxB = 0;
    let roundMaxB = 1;

    function playGame({ countRepeat, mass }: RepeatConfig, randomNumbers: Uint32Array, offset: number): boolean {
        for (let i = 0; i < countRepeat; i++) {
            const randomIndex = randomNumbers[offset + i] % mass.length;
            const result = mass[randomIndex];
            if (result !== true) {
                return false;
            }
        }
        return true;
    }

    function generateRandomNumbers(total: number): Uint32Array {
        const randomNumbers = new Uint32Array(total);
        const chunkSize = 65536 / Uint32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < total; i += chunkSize) {
            const chunk = new Uint32Array(Math.min(chunkSize, total - i));
            window.crypto.getRandomValues(chunk);
            randomNumbers.set(chunk, i);
        }
        return randomNumbers;
    }

    let gameIndex = 0;
    let totalGames = 0;
    while (gameIndex < countGames) {
        const batchCount = Math.min(batchSize, countGames - gameIndex);
        const randomNumbers = generateRandomNumbers(batchCount * repeats[0].countRepeat);

        for (let i = 0; i < batchCount; i++) {
            const repeatConfig = repeats[(gameIndex + i) % repeats.length];
            const gameWon = playGame(repeatConfig, randomNumbers, i * repeatConfig.countRepeat);
            totalGames++;
            resBalance -= initialBet;
            if (gameWon) {
                resBalance += repeatConfig.winMultiplier * initialBet;
            }
            if (maxB < resBalance) {
                maxB = resBalance;
                roundMaxB = gameIndex + i;
            }
            if (resBalance <= 0) {
                resBalance = 0;
                break;
            }
        }

        gameIndex += batchCount;
    }
    
    return resBalance;
}