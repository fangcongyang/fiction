import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';

const defaultState = fromJS({
  bannerList: fromJS([]),
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GetBannerList:
      return state.merge({
        bannerList: fromJS(action.data.bannerList),
      });
  }
  return state;
};
