import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';

const defaultState = fromJS({
  // 将对象转成immutable对象
  fictionList: fromJS([]),
  sort: fromJS({}),
  pageNo: 1,
  pageSize: 10,
  pages: 0,
  isRefreshing: false, //控制下拉刷新
  isLoadMore: false, //控制上拉加载
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SaveSort:
      return state.merge({
        sort: action.data.sort,
      });
    case actionTypes.GetFictionList:
      return state.merge({
        fictionList: fromJS(action.data.fictionList),
        isRefreshing: false,
        isLoadMore: false,
        pages: action.data.pages,
      });
    case actionTypes.GetMoreFictionList:
      return state.merge({
        pageNo: action.data.pageNo,
        isLoadMore: true,
      });
    case actionTypes.RefreshFictionList:
      return state.merge({
        isRefreshing: true,
        pageNo: action.data.pageNo,
      });
    case actionTypes.ResetFictionRefresh:
      return state.merge({
        isRefreshing: action.data.isRefreshing,
      });
    case actionTypes.UpdateFictionList:
      return state.merge({
        fictionList: fromJS(action.data.fictionList),
      });
    case actionTypes.FictionListFetchException:
      return state.merge({
        isRefreshing: false,
        isLoadMore: false,
      })
  }
  return state;
};
