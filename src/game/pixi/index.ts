import { Application, Container, Graphics } from "pixi.js";
import { BaseGameSprite } from "./scenes/BaseGameSprite";
import { imagePath } from "src/assets/imageMap";
import { joystickStore } from "src/game/store/joystick";

export class PixiMain extends Application {
    private _container: HTMLElement;
    private _pixiContainer: Container;
    private sprites: BaseGameSprite[] = [];

    // overlay fields
    private wheelSprite?: BaseGameSprite;
    private overlayContainer?: Container;
    private overlayDots: Graphics[] = [];
    private overlaySpeed = 0;
    private overlayTargetSpeed = 0;
    private readonly overlayInertia = 0.12;

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
        this.wheelSprite = wheel;
    }

    public async init() {
        await super.init({
            resizeTo: window,
        });

        this.stage.eventMode = 'static';
        this._container.appendChild(this.view as unknown as HTMLElement);

        await Promise.all(this.sprites.map((sprite: BaseGameSprite) => sprite.init()));
        this.stage.addChild(this._pixiContainer);
        this.sprites.forEach((sprite) => this._pixiContainer.addChild(sprite));

        // create overlay after sprites added so we can position it relative to wheel
        this.createWheelOverlay();

        window.addEventListener('resize', this.resizeGame);
        this.resizeGame();

        // ticker: rotate overlay according to joystick input
        this.ticker.add(this.tickOverlay as any);
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

        // reposition overlay if exists (wheel uses local coords inside _pixiContainer)
        if (this.wheelSprite && this.overlayContainer) {
            this.overlayContainer.position.set(this.wheelSprite.x, this.wheelSprite.y);
        }
    }

    private createWheelOverlay() {
        if (!this.wheelSprite) return;
        // If overlay already exists, clear it
        if (this.overlayContainer) {
            this.overlayDots.forEach(d => d.destroy());
            this.overlayContainer.destroy({ children: true });
            this.overlayDots = [];
        }

        const overlay = new Container();
        const dotCount = 14;
        const radius = 50; // visual radius around wheel, tweak if needed

        for (let i = 0; i < dotCount; i++) {
            const g = new Graphics();
            g.beginFill(0xffffff, 0.85);
            g.drawCircle(0, 0, 4);
            g.endFill();
            const angle = (i / dotCount) * Math.PI * 2;
            g.x = Math.cos(angle) * radius;
            g.y = Math.sin(angle) * radius;
            overlay.addChild(g);
            this.overlayDots.push(g);
        }

        // position overlay at wheel center (wheel coordinates are local in _pixiContainer)
        overlay.position.set(this.wheelSprite.x, this.wheelSprite.y);
        overlay.visible = true;
        overlay.alpha = 0; // start hidden
        this._pixiContainer.addChild(overlay);
        this.overlayContainer = overlay;
    }

    private tickOverlay = (tickerOrDelta: any) => {
        if (!this.overlayContainer) return;
        // get joystick magnitude and direction
        const mag = joystickStore.getMagnitude(); // 0..~1
        const dirSign = joystickStore.vector.x >= 0 ? 1 : -1;

        // map magnitude to target speed (tweak multiplier for effect)
        const maxSpeed = 0.12; // radians per tick
        this.overlayTargetSpeed = dirSign * mag * maxSpeed;

        // smooth/inertia
        this.overlaySpeed += (this.overlayTargetSpeed - this.overlaySpeed) * this.overlayInertia;

        // apply rotation (ticker delta may be object or number)
        const delta = typeof tickerOrDelta === 'number' ? tickerOrDelta : (tickerOrDelta && (tickerOrDelta as any).delta ? (tickerOrDelta as any).delta : 1);
        this.overlayContainer.rotation += this.overlaySpeed * delta;

        // optional subtle scaling/pulse on dots based on magnitude
        const pulse = 1 + mag * 0.25;
        for (const d of this.overlayDots) {
            d.scale.set(pulse, pulse);
            d.alpha = 0.6 + Math.min(0.4, mag * 0.6);
        }

        // if joystick is idle, slowly hide overlay
        if (mag < 0.02) {
            this.overlayContainer.alpha = Math.max(0, this.overlayContainer.alpha - 0.04);
        } else {
            this.overlayContainer.alpha = Math.min(1, this.overlayContainer.alpha + 0.08);
        }
    }

    public destroy() {
        window.removeEventListener("resize", this.resizeGame);
        this.ticker.remove(this.tickOverlay as any);
        this.sprites.forEach(s => s.destroy({ texture: true, baseTexture: true }));
        if (this.overlayContainer) {
            this.overlayDots.forEach(d => d.destroy());
            this.overlayContainer.destroy({ children: true });
        }
        this._pixiContainer.destroy({ children: true });
        super.destroy();
        console.log("Pixi resources destroyed");
    }
}
