/*
 * 文件名: AppContainer.js
 * 作者: liushun
 * 描述: 用户详情页
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */
import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {Header, ListItem, Button} from 'react-native-elements';
import MainView from '../components/MainView';
import config from '../config';
import ApiUtil from '../service/ApiUtil';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import ActionSheet from 'react-native-actionsheet';
import {DeleteTalkList, SetTalkList} from '../redux/actionCreators';
import {sort} from '../utils/Tool';
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user'),
      isFriend: false,
    };
  }

  componentWillMount(): void {
    this.props.friendList.forEach((item, index) => {
      if (item.friendId.username === this.state.user.username) {
        this.setState({
          isFriend: true,
        });
      }
    });
  }

  componentDidMount(): void {}

  deleteFriend = async () => {
    ApiUtil.request(
      'deleteFriend',
      {
        selfId: this.props.self.id,
        friendId: this.state.user._id,
      },
      true,
    ).then(result => {
      if (result.data.errno === 0) {
        this.props.deleteFriend({username: this.state.user.username});

        Toast.show(result.data.msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });

        this.props.navigation.navigate('Mail');
      }
    });
  };

  goChat = () => {
    const {username, _id} = this.state.user;
    const {id} = this.props.self;
    const roomId = sort(id, _id);
    const data = {...this.state.user, roomId};
    this.props.setTalkList(data);
    this.props.navigation.navigate('ChatView', {
      friendName: username,
      friendId: _id,
    });
  };

  addFriend = () => {
    const self = this.props.self;
    const user = this.state.user;

    ApiUtil.request('addFriend', {selfId: self.id, friendId: user.id}, true)
      .then(result => {
        Toast.show(result.data.msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
      })
      .catch(() => {});
  };

  render() {
    const user = this.state.user;
    return (
      <MainView style={{marginTop: 0}}>
        <Header
          placement="left"
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <FontAwesome name={'angle-left'} size={20} color={'black'} />
            </TouchableOpacity>
          }
          containerStyle={{
            backgroundColor: 'rgb(238, 238, 238)',
            justifyContent: 'space-around',
          }}
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                this.ActionSheet.show();
              }}>
              <Entypo
                name={'dots-three-horizontal'}
                size={20}
                color={'black'}
              />
            </TouchableOpacity>
          }
        />
        <ListItem
          leftAvatar={{source: {uri: config.baseURL + '/' + user.avatar}}}
          title={user.username}
          subtitle={user.address}
          containerStyle={{paddingVertical: 30, paddingHorizontal: 30}}
          onPress={() => {
            this.props.navigation.navigate('UserView');
          }}
          bottomDivider
        />
        {this.state.isFriend ? (
          <Button
            title="发消息"
            titleStyle={{color: 'blue'}}
            buttonStyle={{backgroundColor: 'white'}}
            onPress={this.goChat}
          />
        ) : (
          <Button
            title="添加到通讯录"
            titleStyle={{color: 'blue'}}
            buttonStyle={{backgroundColor: 'white'}}
            onPress={this.addFriend}
          />
        )}

        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['删除', '取消']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={index => {
            if (index === 0) {
              Alert.alert('删除联系人', '将删除联系人', [
                {text: '取消', onPress: () => {}},
                {text: '删除', onPress: () => this.deleteFriend()},
              ]);
            }
          }}
        />
      </MainView>
    );
  }
}

const mapState = state => ({
  self: state.UserReducer.get('user').toJS(),
  friendList: state.UserReducer.get('friendList').toJS(),
});

const mapDispatch = dispatch => ({
  deleteFriend(param) {
    dispatch(DeleteTalkList(param));
  },
  setTalkList(param) {
    dispatch(SetTalkList(param));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(UserDetail);
