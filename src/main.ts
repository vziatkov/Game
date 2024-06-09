import { createPreloader } from './preloader';
//import { doIt } from './mathSimulate/simulate';

const tick = async (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const init = async function () {
    const pixiRoot = document.getElementById("gamePixi");
    const reactRoot = document.getElementById("reactRoot");
    if (!pixiRoot || !reactRoot) {
        throw new Error("USTA's - we cant find our ship");
    }
    const preloaderCleanup = createPreloader();
    await tick(15000); // give chance to see mu nice preloader
    const { default: loadGame } = await import('./game');

    const cleanGame = loadGame({ pixiRoot, reactRoot });
    preloaderCleanup();
    return () => {
        cleanGame();
    };
};

init().then(cleanup => {
    if(!cleanup){
        throw new Error("USTA's - we are locked in the ship");
    }
    window.addEventListener('beforeunload', cleanup);
});

//await doIt(); //- simulation rtp