import { PixiMain } from "src/game/pixi";
import { Store } from "src/game/store";
import { Joystick } from "src/game/ui/Joystick";

const loadGame = async({ pixiRoot, uiRoot }: { pixiRoot: HTMLElement, uiRoot: HTMLElement }) => {
  const store = new Store();
  
  // Инициализация PixiJS
  const pixiMain = new PixiMain(pixiRoot);
  await pixiMain.init();
  
  // Инициализация джойстика (vanilla JS)
  const joystick = new Joystick({
    container: uiRoot,
    onVectorChange: (_vector) => {
      // Можно добавить дополнительную логику здесь
      console.log('Joystick:', _vector);
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

