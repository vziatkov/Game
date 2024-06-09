import { Application, Container } from "pixi.js";

export class PixiMain extends Application {
    private _container: HTMLElement;
    private _pixiContainer: Container;
    constructor(rootContainer: HTMLElement) {
        super();
        this._container = rootContainer;
        this._pixiContainer = new Container();
    }
    public async init() {
        await super.init();
        this._container.appendChild(this._container);
        this.stage.addChild(this._pixiContainer);
    }

    public destroy() {
        super.destroy();
        console.log("remove other need stuff");
    }
}