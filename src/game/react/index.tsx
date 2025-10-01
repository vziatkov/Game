import { createRoot } from 'react-dom/client';
import React from 'react';
import { observer } from 'mobx-react';
import { Store } from '../store';

const App = observer(({store}:{store: Store}) => {
  return <div id="reactRoot">{store.preloader.appLoaded ? 'Loaded' : 'Loading...'}</div>;
});

export const createReactMain = (rootContainer: HTMLElement, store: Store) => {
  const root = createRoot(rootContainer);
  root.render(<App store={store} />);

  return () => {
    root.unmount();
  };
};
