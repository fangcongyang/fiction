import {
  LoginStart,
  LoginSuccess,
  LoginFail,
  RegisterStart,
  RegisterSuccess,
  RegisterFail,
  GetFriend,
} from '../redux/actionCreators';
import ApiUtil from '../service/ApiUtil';
import fetch from '../common/fetch';
import LocalStorageUtil from '../common/LocalStorageUtil';

export const login = param => dispatch => {
  dispatch(LoginStart());
  let formData = new FormData();
  formData.append('mobile', param.mobile);
  formData.append('password', param.password);
  fetch
    .post('login', formData)
    .then(async result => {
      if (result.code == 0) {
        LocalStorageUtil.setItem('tokenId', result.data.tokenId);
        LocalStorageUtil.setItem('mobile', result.data.mobile);
        dispatch(LoginSuccess(result));
      } else {
        dispatch(LoginFail(result));
      }
    })
    .catch(err => {
      dispatch(LoginFail({
        msg: err.message
      }));
    });
};

export const register = param => dispatch => {
  dispatch(RegisterStart());

  ApiUtil.request('register', param)
    .then(result => {
      if (result.data.errno === 0) {
        dispatch(RegisterSuccess(result.data));
      } else {
        dispatch(RegisterFail(result.data));
      }
    })
    .catch(() => {
      dispatch(RegisterFail());
    });
};

export const getFriendList = param => dispatch => {
  ApiUtil.request('getFriendList', param, true)
    .then(result => {
      if (result.data.errno === 0) {
        dispatch(GetFriend(result.data));
      }
    })
    .catch(() => {});
};
