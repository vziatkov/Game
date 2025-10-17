import { Container } from 'pixi.js';
import { AIPlayer } from './AIPlayer';
import { joystickStore, JoystickVector } from '../../store/joystick';
import { reaction } from 'mobx';

export class GameScene extends Container {
  private aiPlayer: AIPlayer | null = null;
  private joystickDisposer: (() => void) | null = null;
  private moveSpeed = 5;

  constructor() {
    super();
    this.init();
  }

  async init() {
    this.aiPlayer = new AIPlayer('src/assets/images/ai-avatar.webp');
    await this.aiPlayer.init();
    this.addChild(this.aiPlayer as unknown as any);

    // Центрируем AI Player
    if (this.aiPlayer) {
      this.aiPlayer.x = 400;
      this.aiPlayer.y = 300;
    }

    // Подключаем джойстик к движению игрока
    this.setupJoystickControls();

    setTimeout(async () => {
      if (!this.aiPlayer) return;
      const response = await this.aiPlayer.interact('Hello, AI!');
      console.log('AI Response:', response);
    }, 2000);
  }

  private setupJoystickControls() {
    // Реакция на изменения джойстика
    this.joystickDisposer = reaction(
      () => joystickStore.getVector(),
      (vector: JoystickVector) => {
        this.updatePlayerMovement(vector);
      },
      { fireImmediately: false }
    );
  }

  private updatePlayerMovement(vector: JoystickVector) {
    if (!this.aiPlayer) return;

    // Движение на основе джойстика
    const moveX = vector.x * this.moveSpeed;
    const moveY = vector.y * this.moveSpeed;

    this.aiPlayer.x += moveX;
    this.aiPlayer.y += moveY;

    // Ограничиваем движение в пределах экрана (пример)
    const maxX = 800;
    const maxY = 600;
    this.aiPlayer.x = Math.max(0, Math.min(maxX, this.aiPlayer.x));
    this.aiPlayer.y = Math.max(0, Math.min(maxY, this.aiPlayer.y));
  }

  async handlePlayerInput(input: string) {
    if (!this.aiPlayer) return 'no ai';
    const response = await this.aiPlayer.interact(input);
    return response;
  }

  public destroy(): void {
    // Отключаем реакцию при уничтожении сцены
    if (this.joystickDisposer) {
      this.joystickDisposer();
      this.joystickDisposer = null;
    }
    super.destroy();
  }
}

