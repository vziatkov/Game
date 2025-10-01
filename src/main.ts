import { createPreloader } from './preloader';

const init = async function () {
    const pixiRoot = document.getElementById("gamePixi");
    const reactRoot = document.getElementById("reactRoot");
    if (!pixiRoot || !reactRoot) {
        throw new Error("Roots not found");
    }
    const preloaderCleanup = createPreloader();
    const { default: loadGame } = await import('./game');
    const cleanup = await loadGame({ pixiRoot, reactRoot });
    preloaderCleanup();
    return cleanup;
};

init().then(cleanup => {
    if(!cleanup){
        throw new Error("Game failed");
    }
    window.addEventListener('beforeunload', cleanup);
});