interface Circle {
    x: number;
    y: number;
    speed: number;
    alpha: number;
    burst: boolean;
    particles: Particle[];
    rotation: number;
    direction: { x: number; y: number };
}

interface Particle {
    x: number;
    y: number;
    radius: number;
    speedX: number;
    speedY: number;
    alpha: number;
    fadeSpeed: number;
    color: string;
}