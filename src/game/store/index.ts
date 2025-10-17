import { createRootActor } from "src/game/store/actors";
import { Preloader } from "src/game/store/preloader/index";
import { joystickStore } from "src/game/store/joystick";

type DefaultValues = {
    preloader?: Preloader;
    externalRootBuilder?: (store: Store) => () => void;
  }
export class Store {
    private _preloader: Preloader;
    private _actorsDestructor: () => void;
    constructor({preloader, externalRootBuilder}: DefaultValues = {}) {
        this._preloader = preloader ?? new Preloader();
        this._actorsDestructor = externalRootBuilder ? externalRootBuilder(this) : createRootActor(this);
    }

    public get preloader(){
        return this._preloader;
    }
    
    public get joystick(){
        return joystickStore;
    }
    
    public destructor(){
        this._actorsDestructor();
    }
}