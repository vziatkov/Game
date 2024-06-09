type GameElement = true | false | "x";
type RepeatConfig = { countRepeat: number, winMultiplier: number, mass: GameElement[] };

const mass = ["x",true, false];
function tick(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let reshuffle = 0;
const countSimulations = 100000;
const countGames = 1000; // for 1 simulation
export async function doIt() {
    const allBalance: number[] = [];
    console.log("DOING^ wait....");
    console.time('Execution Time');
    for (let i = 0; i < countSimulations; i++) {
        allBalance.push(doItOne());
        i % 20001 === 0 && await tick(1);
    }
    console.timeEnd('Execution Time');
    console.time('Calculation Time');
    let biggest = 0;
    let smallest = 0;
    let totalToPay = 0;
    allBalance.forEach((finalBalance) => {
        totalToPay+= finalBalance;
        if (totalToPay > biggest) {
            biggest = totalToPay;
        }
        if (totalToPay < smallest) {
            smallest = totalToPay;
        }
    });
    console.log("totalToPay "+totalToPay+' total bets '+initialBet * countGames * countSimulations);
    const expectationRTP = Math.floor((totalToPay / (initialBet * countGames * countSimulations)) * 100);
    console.log("reshuffle " + reshuffle);
    console.log('%c variance smallest Payout - ' + smallest, 'color: pink; font-weight: normal;');
    console.log('%c expectation RTP: ' + `${expectationRTP}%`, 'color: red; font-weight: bold;');
    console.log('%c variance biggest Payout + ' + biggest, 'color: pink; font-weight: normal;');
    console.timeEnd('Calculation Time');
}

const initialBet = 1;
const first = { countRepeat: 1, winMultiplier: 2, mass: [...mass] as GameElement[] }; // 87
const second = { countRepeat: 2, winMultiplier: 5, mass: [...mass] as GameElement[] };
const third = { countRepeat: 3, winMultiplier: 10, mass: [...mass] as GameElement[] };
const fourth = { countRepeat: 4, winMultiplier: 24, mass: [...mass] as GameElement[] };
const fifth = { countRepeat: 5, winMultiplier: 55, mass: [...mass] as GameElement[] };
const six = { countRepeat: 6, winMultiplier: 120, mass: [...mass] as GameElement[] };
const seven = { countRepeat: 7, winMultiplier: 280, mass: [...mass] as GameElement[] };
const eight = { countRepeat: 8, winMultiplier: 600, mass: [...mass] as GameElement[] };
const nine = { countRepeat: 9, winMultiplier: 1400, mass: [...mass] as GameElement[] };
const ten = { countRepeat: 10, winMultiplier: 3000, mass: [...mass] as GameElement[] };
const eleven = { countRepeat: 11, winMultiplier: 7000, mass: [...mass] as GameElement[] };
const twelve = { countRepeat: 12, winMultiplier: 16000, mass: [...mass] as GameElement[] };
const thirteen = { countRepeat: 13, winMultiplier: 35000, mass: [...mass] as GameElement[] };
const fourteen = { countRepeat: 14, winMultiplier: 70000, mass: [...mass] as GameElement[] };
const fifteen = { countRepeat: 15, winMultiplier: 150000, mass: [...mass] as GameElement[] };
const sixteen = { countRepeat: 16, winMultiplier: 400000, mass: [...mass] as GameElement[] };
const seventyn = { countRepeat: 17, winMultiplier: 900000, mass: [...mass] as GameElement[] };

const repeats: RepeatConfig[] = [
    {...third},
];

function doItOne(): number {
    return makeOneSimulation(repeats, countGames);
}

function generateRandomNumbers(length: number = 1000) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return array;
}

function shuffleArray(array: GameElement[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    reshuffle++;
}

let indexG = 0;
const massIndexArray: number[][] = [];
for (let i = 0; i < 50000; i++) {
    const arr1 = generateRandomNumbers(countGames);
    const arr2 = generateRandomNumbers(countGames);
    const massIndexes = new Array(countGames);

    for (let j = 0; j < countGames; j++) {
        const combinedIndex = Math.abs(arr1[j] ^ arr2[j]);
        massIndexes[j] = combinedIndex % mass.length;
    }

    massIndexArray.push(massIndexes);
}
function makeOneSimulation(
    repeats: RepeatConfig[] = [],
    countGames: number = 1,
): number {
    let resBalance = 0;
    if (indexG >= massIndexArray.length) {
        indexG = 0;
        repeats.forEach(repeatConfig => {
            shuffleArray(repeatConfig.mass);
        });
    }

    const micro: Record<GameElement, (useRepeat: number) => [boolean, number]> = {
        true: (useRepeat) => [true, useRepeat],
        "x": (useRepeat) => [false, useRepeat + 1]
    };
    
    function playGame({ countRepeat, mass, winMultiplier }: RepeatConfig) {
        let retry = true;
        let useRepeat = countRepeat;
        for (let i = 0; i < useRepeat; i++) {
            const currentIndex = mass[massIndexArray[indexG][i]];
            if (currentIndex === false || (!retry && currentIndex === "x")) {
                return;
            }
            [retry, useRepeat] = micro[currentIndex](useRepeat);
        }
        resBalance += winMultiplier;
    }

    for (let gameIndex = 0; gameIndex < countGames; gameIndex++) {
        const repeatConfig = repeats[gameIndex % repeats.length];
        playGame(repeatConfig);
        indexG++;
    }

    return resBalance;
}
