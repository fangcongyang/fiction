/*
 * 文件名: AppContainer.js
 * 作者: liushun
 * 描述: 用户详情页
 * 修改人:
 * 修改时间:
 * 修改内容:
 * */

import React from 'react';
import {ListItem, Avatar } from 'react-native-elements';
import NavigtionBar from '../components/NavigationBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MainView from '../components/MainView';
import {TouchableOpacity, Text} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {connect} from 'react-redux';
import config from '../config';
let RNFS = require('react-native-fs');
import {UpdateUser} from '../redux/actionCreators';
import ApiUtil from '../service/ApiUtil';
import Toast from 'react-native-root-toast';

class UserView extends React.Component {
  constructor(props) {
    super(props);
  }

  uploadAvatar = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      console.tron.log(image);
      const result = await this.uploadImage(image.path);
      const filename = JSON.parse(result.body).filename;
      const userId = this.props.user.id;
      ApiUtil.request('changeAvatar', {
        userId,
        avatar: filename,
      }).then(result => {
        if (result.data.errno === 0) {
          Toast.show(result.data.msg, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
          });
          this.props.updateUser({
            key: 'avatar',
            value: filename,
          });
        }
      });
    });
  };

  back = () => {
    this.props.navigation.goBack();
  };

  uploadImage = async mediaPath => {
    let uploadUrl = config.baseURL + '/api/upload/uploadImage';

    let uploadBegin = response => {
      let jobId = response.jobId;
      console.tron.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };

    let uploadProgress = response => {
      let percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
      );
      console.tron.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    let files = [
      {
        name: 'test1',
        filename: 'test1.w4a',
        filepath: mediaPath,
        filetype: 'audio/x-m4a',
      },
    ];

    return await RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      fields: {
        hello: 'world',
      },
      begin: uploadBegin,
      progress: uploadProgress,
    }).promise;
  };

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
          title={'个人信息'}
          titleStyle={{alignItems: 'flex-start', fontSize: 16,}}
          statusBar={{}}
        />
        <ListItem
          onPress={this.uploadAvatar}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>头像</ListItem.Title>
          </ListItem.Content>
          <Avatar rounded source={{uri: config.baseURL + '/' + this.props.user.avatar}} />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            this.props.navigation.navigate('ChangeName');
          }}
        >
          <ListItem.Content>
            <ListItem.Title>用户名</ListItem.Title>
          </ListItem.Content>
          <Text>{this.props.user.realName}</Text>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>邮箱号</ListItem.Title>
          </ListItem.Content>
          <Text>{this.props.user.email}</Text>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>二维码名片</ListItem.Title>
          </ListItem.Content>
          <AntDesign name={'qrcode'} size={20} color={'black'} />
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          onPress={() => {
            this.props.navigation.navigate('UserMoreView');
          }}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title>更多</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </MainView>
    );
  }
}

const mapState = state => ({
  user: state.UserReducer.get('user').toJS(),
});

const mapDispatch = dispatch => ({
  updateUser(param) {
    dispatch(UpdateUser(param));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(UserView);
