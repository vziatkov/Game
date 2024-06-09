
import { createRoot } from 'react-dom/client';

const App = () => {

  return <div id="reactRoot">{"React"}</div>;
};

export const createReactMain = (rootContainer: HTMLElement) => {
  const root = createRoot(rootContainer);
  root.render(<App />);

  return () => {
    root.unmount();
  };;
};
