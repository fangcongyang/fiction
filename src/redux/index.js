import {applyMiddleware, createStore, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import Reactotron from '../config/ReactotronConfig';
import HomeReducer from './reducer/HomeReducer';
import RouteReducer from './reducer/RouteReducer';
import UserReducer from './reducer/userReducer';
import SortListReducer from './reducer/SortListReducer';
import FictionListReducer from './reducer/FictionListReducer';
import BookShelfReducer from './reducer/BookShelfReducer';
import ThemeReducer from './reducer/ThemeReducer';
import MessageReducer from './reducer/messageReducer';
import AsyncStorage from '@react-native-community/async-storage';
import immutableTransform from 'redux-persist-transform-immutable';
import commentReducer from './reducer/commentReducer';

const persistConfig = {
  transforms: [immutableTransform()],
  key: 'root',
  storage: AsyncStorage,
};

const reducer = combineReducers({
  HomeReducer: HomeReducer,
  RouteReducer: RouteReducer,
  UserReducer: UserReducer,
  ThemeReducer: ThemeReducer,
  MessageReducer: MessageReducer,
  CommentReducer: commentReducer,
  SortListReducer: SortListReducer,
  FictionListReducer: FictionListReducer,
  BookShelfReducer: BookShelfReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export default function configureStore() {
  const enhancers = compose(
    applyMiddleware(thunkMiddleware),
    Reactotron.createEnhancer(),
  );
  const store = createStore(persistedReducer, enhancers);

  let persistor = persistStore(store);

  return {store, persistor};
}
