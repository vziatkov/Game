import { makeAutoObservable } from 'mobx';

export interface JoystickVector {
  x: number;  // -1 to 1
  y: number;  // -1 to 1
  force: number;  // 0 to 1
}

class JoystickStore {
  vector: JoystickVector = { x: 0, y: 0, force: 0 };
  isActive = false;

  constructor() {
    makeAutoObservable(this);
  }

  public updateVector(vector: JoystickVector) {
    this.vector = vector;
    this.isActive = vector.force > 0.01;
  }

  public reset() {
    this.vector = { x: 0, y: 0, force: 0 };
    this.isActive = false;
  }

  public getVector(): JoystickVector {
    return { ...this.vector };
  }

  public getAngle(): number {
    return Math.atan2(this.vector.y, this.vector.x);
  }

  public getMagnitude(): number {
    return Math.sqrt(this.vector.x ** 2 + this.vector.y ** 2);
  }
}

export const joystickStore = new JoystickStore();

