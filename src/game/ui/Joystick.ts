import { joystickStore } from '../store/joystick';
import './Joystick.css';

interface JoystickConfig {
  container: HTMLElement;
  maxDistance?: number;
  onVectorChange?: (vector: { x: number; y: number; force: number }) => void;
}

export class Joystick {
  private container: HTMLElement;
  private wrapper: HTMLElement;
  private joystickElement: HTMLDivElement;
  private knob: HTMLDivElement;
  private xValElement: HTMLDivElement;
  private yValElement: HTMLDivElement;
  private forceValElement: HTMLDivElement;
  
  private maxDistance: number;
  private isActive = false;
  private centerX = 0;
  private centerY = 0;
  private state = { x: 0, y: 0, force: 0 };
  private needsRender = false;
  private animationFrameId: number | null = null;
  private onVectorChange?: (vector: { x: number; y: number; force: number }) => void;

  // Поддержка различных API ввода
  private supportsPointerEvents = 'onpointerdown' in window;
  private supportsTouchEvents = 'ontouchstart' in window;

  constructor(config: JoystickConfig) {
    this.container = config.container;
    this.maxDistance = config.maxDistance || 80;
    this.onVectorChange = config.onVectorChange;

    // Создаем DOM структуру
    this.wrapper = this.createDOM();
    this.joystickElement = this.wrapper.querySelector('.joystick') as HTMLDivElement;
    this.knob = this.wrapper.querySelector('.knob') as HTMLDivElement;
    this.xValElement = this.wrapper.querySelector('#xVal') as HTMLDivElement;
    this.yValElement = this.wrapper.querySelector('#yVal') as HTMLDivElement;
    this.forceValElement = this.wrapper.querySelector('#forceVal') as HTMLDivElement;

    this.container.appendChild(this.wrapper);
    this.init();
  }

  private createDOM(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'joystick-wrapper';
    wrapper.innerHTML = `
      <div class="joystick-container">
        <h3 class="joystick-title">🎮 Joystick</h3>
        <div class="joystick">
          <div class="knob"></div>
        </div>
        <div class="values">
          <div class="value" id="xVal">X: 0</div>
          <div class="value" id="yVal">Y: 0</div>
          <div class="value" id="forceVal">Force: 0</div>
        </div>
      </div>
    `;
    return wrapper;
  }

  private init(): void {
    this.initEventHandlers();
    this.startRenderLoop();
  }

  private initEventHandlers(): void {
    if (this.supportsPointerEvents) {
      this.initPointerEvents();
    } else if (this.supportsTouchEvents) {
      this.initTouchEvents();
    } else {
      this.initMouseEvents();
    }

    // Prevent context menu
    this.joystickElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private initPointerEvents(): void {
    this.joystickElement.addEventListener('pointerdown', this.handleStart);
    document.addEventListener('pointermove', this.handleMove);
    document.addEventListener('pointerup', this.handleEnd);
    document.addEventListener('pointercancel', this.handleEnd);
  }

  private initTouchEvents(): void {
    this.joystickElement.addEventListener('touchstart', this.handleStart, { passive: false });
    document.addEventListener('touchmove', this.handleMove, { passive: false });
    document.addEventListener('touchend', this.handleEnd, { passive: false });
    document.addEventListener('touchcancel', this.handleEnd, { passive: false });
  }

  private initMouseEvents(): void {
    this.joystickElement.addEventListener('mousedown', this.handleStart);
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);
  }

  private updateJoystickRect(): void {
    const rect = this.joystickElement.getBoundingClientRect();
    this.centerX = rect.left + rect.width / 2;
    this.centerY = rect.top + rect.height / 2;
  }

  private getEventPosition(e: Event): { x: number; y: number } {
    const ev = e as TouchEvent | PointerEvent | MouseEvent;
    if ('touches' in ev && ev.touches && ev.touches[0]) {
      return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    } else if ('changedTouches' in ev && ev.changedTouches && ev.changedTouches[0]) {
      return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
    } else {
      const mev = ev as MouseEvent | PointerEvent;
      return { x: mev.clientX, y: mev.clientY };
    }
  }

  private handleStart = (e: Event): void => {
    e.preventDefault();
    this.isActive = true;
    this.joystickElement.classList.add('touch-feedback');
    this.updateJoystickRect();

    // Вибрация
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      (navigator as any).vibrate(50);
    }
  };

  private handleMove = (e: Event): void => {
    if (!this.isActive) return;
    e.preventDefault();

    const pos = this.getEventPosition(e);
    const dx = pos.x - this.centerX;
    const dy = pos.y - this.centerY;
    const dist = Math.hypot(dx, dy);
    const k = dist > this.maxDistance ? this.maxDistance / dist : 1;

    this.state.x = dx * k;
    this.state.y = dy * k;
    this.state.force = (Math.min(dist, this.maxDistance) / this.maxDistance) * 100;
    this.needsRender = true;
  };

  private handleEnd = (e: Event): void => {
    if (!this.isActive) return;
    e.preventDefault();

    this.isActive = false;
    this.joystickElement.classList.remove('touch-feedback');

    // Анимация возврата
    this.knob.style.transition = 'transform 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)';
    this.knob.style.transform = 'translate(-50%,-50%)';
    setTimeout(() => {
      this.knob.style.transition = 'transform 0.1s ease';
    }, 500);

    this.state = { x: 0, y: 0, force: 0 };
    this.needsRender = true;
  };

  private render(): void {
    const { x, y, force } = this.state;

    // Обновляем UI
    this.knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    this.xValElement.textContent = `X: ${Math.round(x)}`;
    this.yValElement.textContent = `Y: ${Math.round(-y)}`;
    this.forceValElement.textContent = `Force: ${Math.round(force)}`;

    // Обновляем фон
    const normalizedX = x / this.maxDistance;
    const normalizedY = y / this.maxDistance;
    const intensity = Math.min(force / 100, 1);

    document.body.style.setProperty('--light-x', `${50 + normalizedX * 25}%`);
    document.body.style.setProperty('--light-y', `${50 + normalizedY * 25}%`);
    document.body.style.setProperty('--light-size', `${30 + intensity * 40}%`);

    // Обновляем store
    joystickStore.updateVector({
      x: x / this.maxDistance,
      y: -y / this.maxDistance,
      force: force / 100
    });

    // Колбэк
    if (this.onVectorChange) {
      this.onVectorChange({
        x: x / this.maxDistance,
        y: -y / this.maxDistance,
        force: force / 100
      });
    }
  }

  private startRenderLoop(): void {
    const loop = () => {
      if (this.needsRender) {
        this.render();
        this.needsRender = false;
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public destroy(): void {
    // Отменяем рендер луп
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Удаляем обработчики событий
    if (this.supportsPointerEvents) {
      this.joystickElement.removeEventListener('pointerdown', this.handleStart);
      document.removeEventListener('pointermove', this.handleMove);
      document.removeEventListener('pointerup', this.handleEnd);
      document.removeEventListener('pointercancel', this.handleEnd);
    } else if (this.supportsTouchEvents) {
      this.joystickElement.removeEventListener('touchstart', this.handleStart);
      document.removeEventListener('touchmove', this.handleMove);
      document.removeEventListener('touchend', this.handleEnd);
      document.removeEventListener('touchcancel', this.handleEnd);
    } else {
      this.joystickElement.removeEventListener('mousedown', this.handleStart);
      document.removeEventListener('mousemove', this.handleMove);
      document.removeEventListener('mouseup', this.handleEnd);
    }

    // Удаляем DOM элемент
    this.wrapper.remove();

    // Сбрасываем store
    joystickStore.reset();
  }

  public show(): void {
    this.wrapper.style.display = 'block';
  }

  public hide(): void {
    this.wrapper.style.display = 'none';
  }
}

