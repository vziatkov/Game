import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div>
            Привет, мир!
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
