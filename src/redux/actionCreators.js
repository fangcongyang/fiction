import actionTypes from './actionTypes';

// 首页
// banner获取
export function GetBannerList(data){
  return {
    type: actionTypes.GetBannerList,
    data: data,
  };
}

export function ChangeCurrentRoute(data) {
  // 统一管理action
  return {
    type: actionTypes.ChangeCurrentRoute,
    data: data,
  };
}

export function LoginStart(data) {
  // 统一管理action
  return {
    type: actionTypes.LoginStart,
    data: data,
  };
}

export function LoginSuccess(data) {
  // 统一管理action
  return {
    type: actionTypes.LoginSuccess,
    data: data,
  };
}

export function LoginFail(data) {
  return {
    type: actionTypes.LoginFail,
    data: data,
  };
}

export function LoginOut(data) {
  return {
    type: actionTypes.LoginOut,
    data: data,
  };
}

export function RegisterStart(data) {
  // 统一管理action
  return {
    type: actionTypes.RegisterStart,
    data: data,
  };
}

export function RegisterSuccess(data) {
  // 统一管理action
  return {
    type: actionTypes.RegisterSuccess,
    data: data,
  };
}

export function RegisterFail(data) {
  return {
    type: actionTypes.RegisterFail,
    data: data,
  };
}

// 主题切换
export function ChangeTheme(data) {
  return {
    type: actionTypes.ChangeTheme,
    data: data,
  };
}

export function GetFriend(data) {
  return {
    type: actionTypes.GetFriend,
    data: data,
  };
}

export function SetMessage(data) {
  return {
    type: actionTypes.SetMessage,
    data: data,
  };
}

export function SetTalkList(data) {
  return {
    type: actionTypes.SetTalkList,
    data: data,
  };
}

export function DeleteTalkList(data) {
  return {
    type: actionTypes.DeleteTalkList,
    data: data,
  };
}

export function AddLastMessage(data) {
  return {
    type: actionTypes.AddLastMessage,
    data: data,
  };
}

export function AddUnReadMessage(data) {
  return {
    type: actionTypes.AddUnReadMessage,
    data: data,
  };
}

export function DeleteUnReadMessage(data) {
  return {
    type: actionTypes.DeleteUnReadMessage,
    data: data,
  };
}

export function ChangeShowButton(data) {
  return {
    type: actionTypes.ChangeShowButton,
    data: data,
  };
}

export function ChangeShowInput(data) {
  return {
    type: actionTypes.ChangeShowInput,
    data: data,
  };
}

export function UpdateUser(data) {
  return {
    type: actionTypes.UpdateUser,
    data: data,
  };
}

// 小说相关
export function GetSortList(data) {
  return {
    type: actionTypes.GetSortList,
    data: data,
  };
}

export function GetMoreSortList(data) {
  return {
    type: actionTypes.GetMoreSortList,
    data: data,
  };
}

export function RefreshSortList(data) {
  return {
    type: actionTypes.RefreshSortList,
    data: data,
  };
}

export function SortFetchException(data) {
  return {
    type: actionTypes.SortFetchException,
    data: data,
  };
}

/**
 * 小说列表相关
 * @param {} data 
 */
export function SaveSort(data) {
  return {
    type: actionTypes.SaveSort,
    data: data,
  };
}

export function GetFictionList(data) {
  return {
    type: actionTypes.GetFictionList,
    data: data,
  };
}

export function GetMoreFictionList(data) {
  return {
    type: actionTypes.GetMoreFictionList,
    data: data,
  };
}

export function RefreshFictionList(data) {
  return {
    type: actionTypes.RefreshFictionList,
    data: data,
  };
}

export function UpdateFictionList(data) {
  return {
    type: actionTypes.UpdateFictionList,
    data: data,
  };
}

export function FictionListFetchException(data) {
  return {
    type: actionTypes.FictionListFetchException,
    data: data,
  };
}

/**
 * 书架相关
 * @param {} data 
 */
export function GetBookShelfList(data) {
  return {
    type: actionTypes.GetBookShelfList,
    data: data,
  };
}

export function GetMoreBookShelfList(data) {
  return {
    type: actionTypes.GetMoreBookShelfList,
    data: data,
  };
}

export function RefreshBookShelfList(data) {
  return {
    type: actionTypes.RefreshBookShelfList,
    data: data,
  };
}

export function BookShelfFetchException(data){
  return {
    type: actionTypes.BookShelfFetchException,
    data: data,
  }
}
