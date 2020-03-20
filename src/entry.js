import React from 'react';
import AppNav from './container/AppContainer';
import {Provider} from 'react-redux';
import configureStore from './redux';
import socket from 'socket.io-client';
import {PersistGate} from 'redux-persist/integration/react';
import {SetMessage, AddUnReadMessage} from './redux/actionCreators';
import Toast from 'react-native-root-toast';
import {getFriendList} from './service/action';

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

// const io = socket('http://127.0.0.1:8888');
// global.io = io;

// io.on('connect', socket => {
//   console.tron.log('socket connect');
// });

// io.on('message', obj => {
//   store.dispatch(SetMessage(obj));
//   store.dispatch(AddUnReadMessage(obj));
// });

// io.on('addFriend', () => {
//   const user = store
//     .getState()
//     .UserReducer.get('user')
//     .toJS();
//   store.dispatch(getFriendList(user.id));
// });

// io.on('disconnect', socket => {
//   console.tron.log('socket disconnect');

//   Toast.show('未连接到服务器', {
//     duration: Toast.durations.SHORT,
//     position: Toast.positions.TOP,
//   });
// });

export default fiction;
