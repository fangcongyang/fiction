/*
 * 文件名: Home.js
 * 作者: fcy
 * 描述: 小说主页
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */

import React from 'react';
import MainView from '../components/MainView';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {GetBannerList, ChangeCurrentRoute} from '../redux/actionCreators';
import Toast from 'react-native-root-toast';
import env from '../utils/common';
import Swiper from 'react-native-swiper';
import LocalStorageUtil from '../common/LocalStorageUtil';
import fetch from '../common/fetch';
import socket from 'socket.io-client';

let lastBackPressed = {};

const styles = StyleSheet.create({
  skip: {
    height: 250,
  },
  bookImage: {
    resizeMode: 'stretch',
    height: 200,
    left: 0,
  },
});
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  UNSAFE_componentWillMount() {
    //绑定监听事件
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    // 如果当前io未初始化
    if (global.WebSocketIsNotInit){
      this.onInitWebsocket();
    }
    this.props.ChangeCurrentRoute({
      routeName: this.props.navigation.state.routeName,
    });
    const user = this.props.user;
    const login = this.props.login;
    if (login) {
      global.io.emit('login', user, mes => {
      });
    } else {
      this.props.navigation.navigate('LoginView');
    }
  }
  
  componentDidMount() {
    this.initBanner();
  }

  UNSAFE_componentWillUnmount() {
    //去除事件
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    if (this.props.navigation.isFocused() || this.props.routeName === 'Home'){
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        //在2秒内按过back返回，可以退出应用
        BackHandler.exitApp();
        return false;
      } else {
        lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
      }
    } else {
      return false;
    }
  };

  // 初始化websocket
  onInitWebsocket = () => {
    const io = socket(
      env.websocket,
      {
        timeout: 5000,
        jsonp: false,
        transports: ['websocket'],
        autoConnect: false,
        agent: '-',
        path: '', // Whatever your path is
        pfx: '-',
        key: '', // Using token-based auth.
        passphrase: '', // Using cookie auth.
        cert: '',
        query: {
          userName: this.props.user.mobile,
          token: 'eosousoc49ba59abbe56e057',
        },
        ca: '',
        ciphers: '-',
        rejectUnauthorized: false,
        perMessageDeflate: '-',
      },
    );
    global.io = io;
    
    io.on('connect', socket => {
      console.tron.log('socket connect');
    });
    
    io.on('reconnect_attempt', () => {
      io.io.opts.transports = ['polling', 'websocket'];
    });
    
    io.on('message', obj => {
      store.dispatch(SetMessage(obj));
      store.dispatch(AddUnReadMessage(obj));
    });
    
    io.on('disconnect', socket => {
      io.open()
      Toast.show('未连接到服务器', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
      });
    });
    global.io.open();
    global.WebSocketIsNotInit = false;
  }

  async initBanner() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .post('base/banner/queryList', {
          tokenId: tokenId,
          type: 1
        })
        .then(value => {
          this.props.GetBannerList({
            bannerList: value.data,
          });
        });
    });
  };
  back = () => {
    this.props.navigation.goBack();
  };
  onOpenMenuPanel = () => {
    this.setState({
      modalVisible: true,
    });
  };

  goSkipView = async item => {
    if (item.skipType === 2){
      this.props.navigation.navigate('SkipWebView', {
        webUrl: item.skipUrlAndroid,
        webName: item.name,
      });
    } else {

    }
  }

  render() {
    return (
      <MainView>
        <View style={styles.skip}>
          <Swiper autoplay={true} loop={true}
            horizontal={true}
            autoplayTimeout={2}>
            {this.props.bannerList.map((info,index) => {
                return (
                  <TouchableOpacity
                    activeOpacity = {1}
                    underlayColor = 'rgb(238, 238, 238)'
                    onPress={() => this.goSkipView(info)}
                    key={index + 1}>
                      <Image 
                        style={styles.bookImage} 
                        source={{uri: info.logo}} />
                  </TouchableOpacity>
                );
              })
            }
          </Swiper>
        </View>
      </MainView>
    );
  }
}

const mapState = state => ({
  bannerList: state.HomeReducer.get('bannerList').toJS(),
  user: state.UserReducer.get('user').toJS(),
  login: state.UserReducer.get('login'),
  routeName: state.RouteReducer.get('routeName')
});

const mapDispatch = dispatch => ({
  GetBannerList(param) {
    dispatch(GetBannerList(param));
  },
  ChangeCurrentRoute(obj) {
    dispatch(ChangeCurrentRoute(obj));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(Home);
