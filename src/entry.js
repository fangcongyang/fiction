import React from 'react';
import AppNav from './container/AppContainer';
import {Provider} from 'react-redux';
import configureStore from './redux';
import {PersistGate} from 'redux-persist/integration/react';

const {store, persistor} = configureStore();

const fiction = function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNav />
      </PersistGate>
    </Provider>
  );
};

global.WebSocketIsNotInit = true;
export default fiction;
