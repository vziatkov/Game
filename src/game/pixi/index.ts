import { Application, Container } from "pixi.js";
import { BaseGameSprite } from "./scenes/BaseGameSprite";
import { imagePath } from "../../assets/imageMap";

export class PixiMain extends Application {
    private _container: HTMLElement;
    private _pixiContainer: Container;
    private sprites: BaseGameSprite[] = [];

    private readonly baseWidth: number = 1024;
    private readonly baseHeight: number = 1024;

    constructor(rootContainer: HTMLElement) {
        super();
        this._container = rootContainer;
        this._pixiContainer = new Container();
        this.sprites.push(new BaseGameSprite(imagePath.bgImage));
        this.sprites.push(new BaseGameSprite(imagePath.pirate));
        const wheel = new BaseGameSprite(imagePath.wheel);
        wheel.scale.set(0.45);
        wheel.position.set(40, 350);
        this.sprites.push(wheel);
    }

    public async init() {
        await super.init({
            resizeTo:window,
        });
        
        this.stage.eventMode = 'static';
        this._container.appendChild(this.canvas);

        await Promise.all(this.sprites.map((sprite:BaseGameSprite) => sprite.init()));
        this.stage.addChild(this._pixiContainer);
        this.sprites.forEach((sprite) => this._pixiContainer.addChild(sprite));
        window.addEventListener('resize', this.resizeGame);
        this.resizeGame();
    }

    public resizeGame = () => {
        const scaleX = window.innerWidth / this.baseWidth;
        const scaleY = window.innerHeight / this.baseHeight;
        const scale = Math.min(scaleX, scaleY);

        const newWidth = Math.ceil(this.baseWidth * scale);
        const newHeight = Math.ceil(this.baseHeight * scale);
        this._pixiContainer.scale.set(scale);
        this._pixiContainer.x = (window.innerWidth - newWidth) / 2;
        this._pixiContainer.y = (window.innerHeight - newHeight) / 2;
    }

    public destroy() {
        window.removeEventListener("resize", this.resizeGame);
        this.sprites.forEach(s => s.destroy({ texture: true, baseTexture: true }));
        this._pixiContainer.destroy({ children: true });
        super.destroy();
        console.log("Pixi resources destroyed");
    }
}
