import { createPreloader } from './preloader';

const tick = async (t:number) => new Promise((resolve) => setTimeout(resolve, t));

const init = async function(){
    const preloaderCleanup = createPreloader();
    await tick(10000); // give chance to see mu nice preloader
    const { default: loadGame } = await import('./game');
    const gameInstance = loadGame('gamePixi', 'root');
    preloaderCleanup();
    return () => {
        gameInstance.cleanup();
    };
};

init().then(cleanup => {
    // Optionally, handle cleanup when necessary
    window.addEventListener('beforeunload', cleanup);
});
