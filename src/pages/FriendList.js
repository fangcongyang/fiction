import React from 'react';
import MainView from '../components/MainView';
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {Header, Button} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ApiUtil from '../service/ApiUtil';
import ListItem from '../components/ListItem';
import {connect} from 'react-redux';
import {ChangeShowInput} from '../redux/actionCreators';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;

const Tip = {
  loading: '正在加载',
  loaded: '上拉加载更多',
  allload: '已加载全部',
};

class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      refreshing: false,
      loading: false,
      page: 0,
      keyboardHeight: 0,
      comment: '',
      tip: Tip.loaded,
    };
  }

  UNSAFE_componentWillMount() {
    ApiUtil.request('getArticle', this.state.page, true).then(result => {
      if (result.data.errno === 0) {
        this.setState({
          articles: result.data.data,
        });
      }
    });
  }

  UNSAFE_componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  UNSAFE_componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  };

  _keyboardDidHide = e => {
    this.setState({
      keyboardHeight: 0,
    });
  };

  comment = () => {
    const userId = this.props.user.id;
    const articleId = this.props.articleId;
    const commentContent = this.state.comment;
    const param = {
      userId,
      articleId,
      commentContent,
    };
    ApiUtil.request('comment', param, true).then(result => {
      if (result.data.errno === 0) {
        this.props.changeInput({
          show: false,
          commentArticleId: this.props.articleId,
        });
      }
    });
  };

  refresh = () => {
    if (!this.state.refreshing) {
      this.setState(
        {
          page: 0,
          refreshing: true,
        },
        () => {
          ApiUtil.request('getArticle', this.state.page, true).then(result => {
            if (result.data.errno === 0) {
              this.setState({
                articles: result.data.data,
                refreshing: false,
              });
            }
          });
        },
      );
    }
  };

  scroll = () => {
    this.footer.measure((x, y, width, height, pageX, pageY) => {
      if (pageY < winHeight - 30 && !this.state.loading) {
        this.setState(
          {
            loading: true,
            page: ++this.state.page,
            tip: Tip.loading,
          },
          () => {
            setTimeout(() => {
              ApiUtil.request('getArticle', this.state.page, true).then(
                result => {
                  if (result.data.errno === 0 && result.data.data.length) {
                    this.setState({
                      articles: this.state.articles.concat(result.data.data),
                      tip: Tip.loaded,
                    });
                  } else {
                    this.setState({
                      page: --this.state.page,
                      tip: Tip.allload,
                    });
                  }
                },
              );
            }, 1000);
          },
        );
      } else if (pageY >= winHeight - 20) {
        this.setState({
          loading: false,
        });
      }
    });
  };

  renderItem = ({item}) => {
    const user = item.userId;
    return (
      <ListItem
        avatar={user.avatar}
        name={user.username}
        content={item.articleContent}
        articleId={item._id}
        time={item.time}
      />
    );
  };

  renderFooter = () => {
    return (
      <View
        style={{width: winWidth, height: 20, alignItems: 'center'}}
        ref={ref => (this.footer = ref)}>
        {this.state.tip === Tip.loading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Text>{this.state.tip}</Text>
        )}
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View style={{width: winWidth, height: 1, backgroundColor: 'black'}} />
    );
  };

  render() {
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
          centerComponent={{text: '朋友圈', style: {color: 'black'}}}
          containerStyle={{
            backgroundColor: 'rgb(238, 238, 238)',
            justifyContent: 'space-around',
          }}
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('PublishView');
              }}>
              <FontAwesome name={'camera'} size={20} color={'black'} />
            </TouchableOpacity>
          }
        />

        {/*文章列表*/}
        <FlatList
          keyExtractor={item => item._id.toString()}
          data={this.state.articles}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.refresh}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
          onScroll={this.scroll}
          extraData={this.state.tip}
        />

        {this.props.showInput ? (
          <View
            style={[
              {
                backgroundColor: 'gray',
                justifyContent: 'space-around',
                paddingHorizontal: 20,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
              },
              {marginBottom: this.state.keyboardHeight},
            ]}>
            <TextInput
              style={{
                width: winWidth - 200,
                height: 30,
                backgroundColor: 'white',
              }}
              autoFocus={true}
              onChangeText={text => {
                this.setState({
                  comment: text,
                });
              }}
            />
            <Button
              title={'发送'}
              onPress={() => {
                this.comment();
              }}
            />
            <Button
              title={'取消'}
              onPress={() => {
                this.props.changeInput({
                  show: false,
                });
              }}
            />
          </View>
        ) : null}
      </MainView>
    );
  }
}

const mapState = state => ({
  showInput: state.CommentReducer.get('showInput'),
  articleId: state.CommentReducer.get('articleId'),
  user: state.UserReducer.get('user').toJS(),
});

const mapDispatch = dispatch => ({
  changeInput(param) {
    dispatch(ChangeShowInput(param));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(FriendList);
