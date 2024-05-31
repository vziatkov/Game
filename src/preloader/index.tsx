import { centralYinYangSVG, smallYinYangSVG } from "./assets";

const centralCircleDiameter = 60;
const smallCircleDiameter = 25;

const canvas = document.getElementById("preloader") as HTMLCanvasElement;
const ctx = canvas?.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const maxNumCircles = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const maxAccelerationCentalCircle = 0.5;
const centralCircle: Circle = {
    x: centerX,
    y: centerY,
    speed: 0,
    alpha: 1,
    burst: false,
    particles: [],
    rotation: 0,
    direction: { x: 0, y: 0 }
};
const smallCircleSpeedRotation = 0.2;

const createOffscreenCanvas = (img: HTMLImageElement, radius: number): HTMLCanvasElement => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = radius;
    offscreenCanvas.height = radius;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    img.onload = () => {
        if (offscreenCtx) {
            offscreenCtx.imageSmoothingEnabled = true;
            offscreenCtx.drawImage(img, 0, 0, radius, radius);
        }
    };
    return offscreenCanvas;
};
const centralOffscreenCanvas = createOffscreenCanvas(centralYinYangSVG, centralCircleDiameter);
const smallOffscreenCanvas = createOffscreenCanvas(smallYinYangSVG, smallCircleDiameter);

function speedToCountSmallCircles(currentSpeed: number) {
    if (currentSpeed < 0.45) {
        return 0;
    }
    return Math.min(maxNumCircles, Math.floor(currentSpeed * 50));
}
function createParticles(circle: Circle) {
    const numParticles = 6 + Math.random() * 4;
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1;
        const speedX = speed * Math.cos(angle);
        const speedY = speed * Math.sin(angle);
        const particle: Particle = {
            x: circle.x,
            y: circle.y,
            radius: 2,
            speedX,
            speedY,
            alpha: 1,
            fadeSpeed: 0.02,
            color: ["red", "green", "cyan", "yellow"][Math.floor(Math.random() * 4)],
        };
        circle.particles.push(particle);
    }
}
export const createPreloader = function () {
    if (!ctx) {
        console.error('Failed to get 2D context');
        return () => { };
    }

    let circles: Circle[] = [];
    let animationFrameId: number | null = null;
    let rotationSpeed = 0.1;
    let centralCircleAcceleration = 0.004;

    function createCircle(): Circle {
        const x = centerX;
        const y = centerY;
        const speed = 1 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        const direction = { x: Math.cos(angle), y: Math.sin(angle) };
        const burst = false;
        const particles: Particle[] = [];
        return { x, y, speed, alpha: 1, burst, particles, rotation: rotationSpeed, direction };
    }

    function createCircles(numCircles: number) {
        circles = [];
        for (let i = 0; i < numCircles; i++) {
            circles.push(createCircle());
        }
    }

    const drawCircle = (circle: Circle, canvas: HTMLCanvasElement) => {
        ctx.save();
        ctx.globalAlpha = circle.alpha;
        ctx.translate(circle.x, circle.y);
        ctx.rotate(circle.rotation);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
        ctx.restore();
    };

    const drawParticle = (particle: Particle) => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw small circles
        circles.forEach((circle, index) => {
            if (!circle.burst) {
                circle.x += circle.direction.x * circle.speed;
                circle.y += circle.direction.y * circle.speed;
                circle.rotation += smallCircleSpeedRotation;
                drawCircle(circle, smallOffscreenCanvas);
                if (
                    circle.y <= smallCircleDiameter ||
                    circle.y + smallCircleDiameter >= canvas.height ||
                    circle.x <= smallCircleDiameter ||
                    circle.x + smallCircleDiameter >= canvas.width
                ) {
                    circle.burst = true;
                    createParticles(circle);
                }
            } else {
                circle.particles.forEach((particle, particleIndex) => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.alpha -= particle.fadeSpeed;
                    if (particle.alpha <= 0) {
                        circle.particles.splice(particleIndex, 1);
                    } else {
                        drawParticle(particle);
                    }
                });
                if (circle.particles.length === 0) {
                    circles[index] = createCircle();
                }
            }
        });

        // Draw central rotating symbol
        if (rotationSpeed < maxAccelerationCentalCircle) {
            rotationSpeed += centralCircleAcceleration;
        }
        centralCircle.rotation += rotationSpeed;
        drawCircle(centralCircle, centralOffscreenCanvas);

        // Adjust the number of small circles based on the rotation speed
        const desiredNumCircles = speedToCountSmallCircles(rotationSpeed);
        if (circles.length < desiredNumCircles) {
            const numToAdd = desiredNumCircles - circles.length;
            for (let i = 0; i < numToAdd; i++) {
                circles.push(createCircle());
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    createCircles(speedToCountSmallCircles(rotationSpeed));
    animate();

    return async function () {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        circles = [];
    }
};
