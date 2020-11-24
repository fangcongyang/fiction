import React, {Component} from 'react';
import NavigtionBar from '../components/NavigationBar';
import MainView from '../components/MainView';
import {
  View,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {ChangeCurrentRoute} from '../redux/actionCreators';
import {connect} from 'react-redux';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';

class SkipWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webUrl: this.props.navigation.state.params.webUrl,
      webName: this.props.navigation.state.params.webName,
      webView: {},
      canGoBack: false,
      canGoForward: false,
      hiddenStatusBar: false,
      isPlayPage: false,
      isLock: false,
    }
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE-LEFT') {
      this.setState({
        hiddenStatusBar: true,
      })
      Orientation.lockToLandscapeLeft();
    } else if (orientation === 'LANDSCAPE-RIGHT') {
      this.setState({
        hiddenStatusBar: true,
      })
      Orientation.lockToLandscapeRight();
    } else {
      this.setState({
        hiddenStatusBar: false,
      })
      Orientation.lockToPortrait();
    }
  };
  UNSAFE_componentWillMount(){
    //绑定监听事件
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentDidMount() {
    this.props.ChangeCurrentRoute({
      routeName: this.props.navigation.state.routeName,
    });
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this._orientationDidChange);
    //去除事件
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  back = () => {
    if (this.state.isPlayPage) {
      Orientation.removeDeviceOrientationListener(this._orientationDidChange);
    }
    if (!this.state.canGoBack) {
      this.props.ChangeCurrentRoute({
        routeName: 'HOME',
      });
      this.props.navigation.goBack();
    } else {
      this.state.webView.goBack();
    }
  };

  onBackAndroid = () => {
    if (this.state.isPlayPage) {
      Orientation.removeDeviceOrientationListener(this._orientationDidChange);
    }
    if (this.state.canGoBack){
      this.state.webView.goBack();
      return true;
    } else {
      return false;
    }
  };

  onLoad = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url.indexOf('play.php') !== -1){
      if (!this.state.isPlayPage){
        this.setState({
          isPlayPage: true,
        })
        Orientation.addDeviceOrientationListener(this._orientationDidChange);
      }
    } else {
      this.setState({
        isPlayPage: false,
      })
      Orientation.removeDeviceOrientationListener(this._orientationDidChange);
    }

    this.setState({
      canGoBack: nativeEvent.canGoBack,
      canGoForward: nativeEvent.canGoForward,
    })
  }

  render() {
    let leftBackBtn = (
      <TouchableOpacity style={{padding: 8}} onPress={this.back}>
        <Image
          style={{width: 26, height: 26}}
          source={require('../res/images/ic_arrow_back_white_36pt.png')}
        />
      </TouchableOpacity>
    );
    return (
      <MainView style={{marginTop: 0}}>
        <View style={{flex: 1}}
          onLayout={this._onLayout}
          >
          <NavigtionBar
            titleStyle={{color: '#fff'}}
            leftButton={leftBackBtn}
            navBar={{
              backgroundColor: '#3e9ce9',
            }}
            title={this.state.webName}
            hiddenStatusBar={this.state.hiddenStatusBar}
            statusBar={{}}
          />
          <WebView 
            ref={(component) => this.state.webView = component}
            onLoadStart={this.onLoad.bind(this)}
            allowsFullscreenVideo={true}
            source={{uri: this.state.webUrl}}/>
        </View>
      </MainView>
    );
  }
}

const mapDispatch = dispatch => ({
  ChangeCurrentRoute(obj) {
    dispatch(ChangeCurrentRoute(obj));
  },
});

export default connect(
  null,
  mapDispatch,
)(SkipWebView);
