import { reaction } from "mobx";
import { Store } from "src/game/store";

export function createPreloader(store: Store) {
    const container = [
        loadSecondStage(store)
    ];

    return () => {
        container.forEach((d) => d());
    }
}

function loadSecondStage(store: Store) {
    return reaction(
        () => store.preloader.appLoaded,
        (value: boolean) => {
            if (value) {
                console.log("load additional assets");
            }
        }
    )
}
