/*
 * 文件名: userMore.js
 * 作者: fangcy
 * 描述: 用户详情页
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */
import React from 'react';
import {ListItem} from 'react-native-elements';
import NavigtionBar from '../components/NavigationBar';
import {TouchableOpacity, Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainView from '../components/MainView';
import {connect} from 'react-redux';

class UserMoreView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MainView style={{marginTop: 0}}>
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
          title={'更多信息'}
          titleStyle={{alignItems: 'flex-start', fontSize: 16}}
          statusBar={{}}
        />
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>性别</ListItem.Title>
          </ListItem.Content>
          <Text>{this.props.user.sex === 2 ? '男' : this.props.user.sex === 1 ? '女' : '未知'}</Text>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>昵称</ListItem.Title>
          </ListItem.Content>
          <Text>{this.props.user.nickName}</Text>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>个性签名</ListItem.Title>
          </ListItem.Content>
          <Text>哈哈哈</Text>
          <ListItem.Chevron />
        </ListItem>
      </MainView>
    );
  }
}

const mapState = state => ({
  user: state.UserReducer.get('user').toJS(),
});

export default connect(
  mapState,
  null,
)(UserMoreView);
