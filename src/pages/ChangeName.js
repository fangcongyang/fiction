import React from 'react';
import MainView from '../components/MainView';
import NavigtionBar from '../components/NavigationBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import {Button, Input} from 'react-native-elements';
import ApiUtil from '../service/ApiUtil';
import {UpdateUser} from '../redux/actionCreators';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';

class ChangeName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.username,
    };
  }

  changeName = () => {
    const userId = this.props.user.userId;
    const username = this.state.name;
    ApiUtil.request('changeName', {
      userId,
      username,
    }).then(result => {
      if (result.data.errno === 0) {
        Toast.show(result.data.msg, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        this.props.updateUser({
          key: 'username',
          value: username,
        });
        this.props.navigation.goBack();
      }
    });
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
          title={'更改名字'}
          titleStyle={{alignItems: 'flex-start', fontSize: 16}}
          statusBar={{}}
          rightButton={
            <Button
              title={'保存'}
              titleStyle={{fontSize: 14}}
              buttonStyle={{backgroundColor: 'green'}}
              onPress={this.changeName}
            />
          }
        />
        <Input
          value={this.state.name}
          onChangeText={text =>
            this.setState({
              name: text,
            })
          }
        />
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
)(ChangeName);
