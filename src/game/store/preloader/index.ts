import { action, observable } from "mobx";

type DefaultValues = {
    appLoaded: boolean
}
export class Preloader {
    @observable
    public appLoaded;
    constructor({appLoaded}: Partial<DefaultValues> = {}){
        this.appLoaded = appLoaded ?? false;
    }
    @action
    public updateIsLoaded(value: boolean){
        this.appLoaded = value;
    }
}