import { Assets, Sprite, Texture } from "pixi.js";

export class BaseGameSprite extends Sprite{
    protected _pathImage: string = "";
    constructor(pathImage: string) {
        super();
        this._pathImage = pathImage;
    }

    public async init() {
        try {
            const texture = await Assets.load(this._pathImage);
            this.texture = texture as Texture;
        } catch (error) {
            console.error('Failed to load background image', error);
        }
    }

    public destroy(options?: any){
        super.destroy(options);
    }
}