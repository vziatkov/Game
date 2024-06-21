import { PixiMain } from "./pixi";
import { createReactMain } from "./react";
import { Store } from "./store";

const loadGame = async({pixiRoot, reactRoot}: {pixiRoot:HTMLElement, reactRoot: HTMLElement}) => {
  const store = new Store();
  const pixiMain = new PixiMain(pixiRoot);
  await pixiMain.init();
  const reactDestructor = createReactMain(reactRoot);
  store.preloader.updateIsLoaded(true);
  return () => {
    reactDestructor();
    pixiMain.destroy();
    store.destructor();
  };
};

export default loadGame;
