import { Store } from "src/game/store";
import { createPreloader } from "./preloader";

export function createRootActor(store: Store){
    const container = [
        createPreloader(store),
    ];

    return () => {
        container.forEach((destructor) => destructor());
    }
}