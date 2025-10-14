import { PixiMain } from "./pixi";
import { Store } from "./store";
import { Joystick } from "./ui/Joystick";

const loadGame = async({ pixiRoot, uiRoot }: { pixiRoot: HTMLElement, uiRoot: HTMLElement }) => {
  const store = new Store();
  
  // Инициализация PixiJS
  const pixiMain = new PixiMain(pixiRoot);
  await pixiMain.init();
  
  // Инициализация джойстика (vanilla JS)
  const joystick = new Joystick({
    container: uiRoot,
    onVectorChange: (vector) => {
      // Можно добавить дополнительную логику здесь
      // console.log('Joystick:', vector);
    }
  });
  
  // Обновляем состояние загрузки
  store.preloader.updateIsLoaded(true);
  
  // Возвращаем функцию очистки
  return () => {
    joystick.destroy();
    pixiMain.destroy();
    store.destructor();
  };
};

export default loadGame;

