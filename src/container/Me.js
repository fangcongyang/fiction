/*
 * 文件名: Find.js
 * 作者: fangcy
 * 描述: 我的页面
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */

import React from 'react';
import {ListItem, Avatar} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import config from '../config';
import { View } from 'react-native';
import {ChangeCurrentRoute} from '../redux/actionCreators';

class Me extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.ChangeCurrentRoute({
      routeName: this.props.navigation.state.routeName,
    });
  }

  render() {
    return (
      <View>
        <ListItem
          onPress={() => {
            this.props.navigation.navigate('UserView');
          }}
          bottomDivider>
          <Avatar 
            size="large"
            rounded
            source={{uri: config.baseURL + '/' + this.props.user.avatar}} />
          <ListItem.Content>
            <ListItem.Title>{this.props.user.realName  }</ListItem.Title>
            <ListItem.Subtitle>{'邮箱号: ' + this.props.user.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem
          onPress={() => {
            this.props.navigation.navigate('SettingView');
          }}
          style={{marginTop: 10}}
          bottomDivider>
            <Feather name={'settings'} size={20} color={'black'} />
          <ListItem.Content>
            <ListItem.Title>设置</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  }
}

const mapState = state => ({
  user: state.UserReducer.get('user').toJS(),
});

const mapDispatch = dispatch => ({
  ChangeCurrentRoute(obj) {
    dispatch(ChangeCurrentRoute(obj));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(Me);
