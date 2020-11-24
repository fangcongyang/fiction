/*
 * 文件名: AppContainer.js
 * 作者: liushun
 * 描述: 设置页
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */

import React from 'react';
import {Button} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  TouchableOpacity, 
  Switch, 
  StyleSheet,
  Text,
  View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ApiUtil from '../service/ApiUtil';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import NavigtionBar from '../components/NavigationBar';
const Api = ApiUtil.api();
import {LoginOut, ChangeTheme} from '../redux/actionCreators';

const styles = StyleSheet.create({
  item: {
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
  },
  separator: {
    backgroundColor: '#eee',
    height: 10,
  },
  name: {
    marginLeft: 20,
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  switch: {
    flex: 1,
  },
});
class SettingView extends React.Component {
  constructor(props) {
    super(props);
  }

  loginOut = async () => {
    await AsyncStorage.clear();

    const user = this.props.user.toJS();

    try {
      const result = await Api.loginOut(user.id);
      if (result.data.errno === 0) {
        Toast.show(result.data.msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
        });

        this.props.logout();
      }
    } catch (e) {}

    this.props.navigation.navigate('LoginView');
  };

  onDayModeClick = () => {
    this.props.ChangeTheme({
      isNight: !this.props.isNight
    })
  };

  render() {
    return (
      <View>
        <NavigtionBar
          titleStyle={{color: '#000'}}
          leftButton={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <AntDesign
                name={'left'}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          }
          navBar={{
            backgroundColor: 'rgb(238, 238, 238)',
          }}
          title={'设置'}
          titleStyle={{alignItems: 'flex-start', fontSize: 16}}
          statusBar={{}}
        />
          <View
            style={styles.item}>
            <Text style={styles.name}>
              主题：{this.props.isNight? '黑夜' : '白天'}
            </Text>
            <Switch
              onTintColor={'#ffaa11'}
              tintColor={'#aaaa11'}
              value={this.props.isNight}
              onValueChange={this.onDayModeClick}
              testID={'one'}
              thumbTintColor={'#ff1111'}/>
        </View>
        <View style={styles.separator} />
        
        <Button
          title="退出"
          buttonStyle={{backgroundColor: 'white'}}
          titleStyle={{color: 'black'}}
          onPress={this.loginOut}
        />
      </View>
    );
  }
}

const mapState = state => ({
  user: state.UserReducer.get('user'),
  isNight: state.ThemeReducer.get('isNight'),
});

const mapDispatch = dispatch => ({
  logout() {
    dispatch(LoginOut());
  },
  ChangeTheme(param){
    dispatch(ChangeTheme(param));
  }
});

export default connect(
  mapState,
  mapDispatch,
)(SettingView);
