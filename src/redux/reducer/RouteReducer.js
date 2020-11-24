import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';

const defaultState = fromJS({
  // 将对象转成immutable对象
  routeName: '',
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.ChangeCurrentRoute:
      return state.merge({
        routeName: action.data.routeName,
      });
  }
  return state;
};
