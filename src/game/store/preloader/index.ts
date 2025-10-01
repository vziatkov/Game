import { makeAutoObservable } from "mobx";

export class Preloader {
    public appLoaded: boolean;
    constructor({appLoaded}: Partial<{appLoaded: boolean}> = {}){
        this.appLoaded = appLoaded ?? false;
        makeAutoObservable(this);
    }
    public updateIsLoaded(value: boolean){
        this.appLoaded = value;
    }
}