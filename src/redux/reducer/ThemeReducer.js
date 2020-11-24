import actionTypes from '../actionTypes'
import {fromJS} from 'immutable'

const defaultState = fromJS({ // 将对象转成immutable对象
  isNight: false,
  bgColor: '#e4cba3',
  fontColor: '#333',
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.ChangeTheme:
      return state.merge({
        bgColor: action.data.isNight ? '#161616' : '#e4cba3',
        fontColor: action.data.isNight ? '#4f5050' : '#333',
        isNight: action.data.isNight,
      });
  }
  return state;
}
