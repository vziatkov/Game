import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '30px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Game Loaded!', canvas.width / 2, canvas.height / 2);
      }
    }

    return () => {
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }} />;
};

const loadGame = (pixiElementId: string, reactElementId: string) => {
  const rootElement = document.getElementById(reactElementId);
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }

  const cleanup = () => {
    const rootElement = document.getElementById(reactElementId);
    if (rootElement) {
      const root = createRoot(rootElement);
      root.unmount();
    }
  };

  return { cleanup };
};

export default loadGame;
