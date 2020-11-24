import actionTypes from '../actionTypes';
import {fromJS} from 'immutable';

const defaultState = fromJS({
  // 将对象转成immutable对象
  sortList: fromJS([]),
  pageNo: 1,
  pageSize: 20,
  pages: 0,
  isRefreshing: false, //控制下拉刷新
  isLoadMore: false, //控制上拉加载
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.GetSortList:
      return state.merge({
        sortList: fromJS(action.data.sortList),
        isRefreshing: false,
        isLoadMore: false,
        pages: action.data.pages,
      });
    case actionTypes.GetMoreSortList:
      return state.merge({
        pageNo: action.data.pageNo,
        isLoadMore: true,
      });
    case actionTypes.RefreshSortList:
      return state.merge({
        isRefreshing: true,
        pageNo: action.data.pageNo,
      });
    case actionTypes.SortFetchException:
      return state.merge({
        isRefreshing: false,
        isLoadMore: false,
      });
  }
  return state;
};
