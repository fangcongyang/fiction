import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import {connect} from 'react-redux';
import Line from '../../components/Line';
import LocalStorageUtil from '../../common/LocalStorageUtil';
import Toast from 'react-native-root-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  GetBookShelfList,
  GetMoreBookShelfList,
  RefreshBookShelfList,
  ChangeCurrentRoute,
  BookShelfFetchException,
} from '../../redux/actionCreators';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

const screenW = Dimensions.get('window').width;
const ImageWH = (screenW - 4 * 15) / 3; // 图片大小
const screenH = Dimensions.get('window').height;
const ImageH = (screenH - 5 * 30) / 4; // 图片大小

const sortItemStyle = StyleSheet.create({
  item: {
    width: ImageWH,
    height: ImageH + 22,
    borderRadius: 0,
    marginLeft: 15,
    marginTop: 30,
    flexDirection:'row',
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 14,
    color: '#333',
    textAlign: "center"
  },
  separator: {
    backgroundColor: '#666',
  },
  bookImage: {
    width: ImageWH,
    height: ImageH,
    left: 0,
  },
  deleteFont: {
    left: -7,
    top: -7
  }
});

import fetch from '../../common/fetch';
class BookShelfList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBookDel: false,
    }
  }
  componentDidMount() {
    this.props.ChangeCurrentRoute({
      routeName: this.props.navigation.state.routeName,
    });
    this._onRefresh();
    if (this.props.fictionList.size === 0) {
      this._onRefresh();
    }
  }
  async getDataList() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('userFiction', {
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize,
          tokenId: tokenId,
        })
        .then(value => {
          let data = this.props.fictionList;
          let backData = value.data.records;
          if (this.props.pageNo === 1) {
            data = backData;
          } else {
            data = data.concat(backData);
          }
          this.props.GetBookShelfList({
            fictionList: data,
            pages: value.data.pages,
          });
        })
        .catch(err => {
          this.props.BookShelfFetchException({});
          Toast.show(err.message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        });
    });
  }
  getCollectItem(props) {
    return (
      <TouchableOpacity
        style={sortItemStyle.item}
        onPress={this.gotoIntroduce.bind(this, props)} 
        onLongPress={this.showBookDel.bind(this)}>
        <View style="flexDirection: 'column'" >
          <Image style={sortItemStyle.bookImage} 
            source={{uri: props.logo}} />
          <Text style={sortItemStyle.name}>{props.name}</Text>
        </View>
        {this.state.showBookDel ? (<AntDesign
          style={sortItemStyle.deleteFont}
          name={'close'}
          onPress={this.deleteFictionCollect.bind(this, props)}
          size={14}
          color="#000"
        />) : (<Text></Text>)}
        
      </TouchableOpacity>
    );
  }
  footer = () => {
    return <Line color="666" size={30} />;
  };
  showBookDel = () => {
    this.setState({
      showBookDel: true
    })
  };
  hideBookDel = () => {
    this.setState({
      showBookDel: false
    })
  };
  // 删除用户收藏记录
  deleteFictionCollect = (fiction) => {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .del('userFiction/delete', {
          id: fiction.userFictionId,
          tokenId: tokenId,
        })
        .then(value => {
          this._onRefresh()
        });
    });
  };
  gotoIntroduce = fiction => {
    this.setState({
      showBookDel: false
    })
    this.props.navigation.navigate('Fiction', {
      fictionId: fiction.id,
    });
  };
  _onEndReached() {
    //上拉加载更多
    const {pageNo, pages, isLoadMore} = this.props;
    if (pageNo < pages && !isLoadMore) {
      this.props.GetMoreBookShelfList({
        pageNo: pageNo + 1, //加载下一页
      });
      setTimeout(() => {
        this.getDataList();
      }, 200);
    }
  }
  _onRefresh() {
    // 下拉刷新
    // 正在上拉刷新，请求第一页
    this.props.RefreshBookShelfList({
      pageNo: 1,
    });
    setTimeout(() => {
      this.getDataList();
    }, 200);
  }
  render() {
    return (
      <MainView style={{marginTop: 0}}>
        <TouchableHighlight style={{flex: 1}}
          activeOpacity = {1}
          underlayColor = 'rgb(238, 238, 238)'
          onPress={this.hideBookDel.bind(this)}>
          <View style={{flex: 1}}
            >
            <NavigtionBar
              titleStyle={{color: '#fff'}}
              navBar={{
                backgroundColor: '#3e9ce9',
              }}
              title={'我的书架'}
              statusBar={{}}
            />
            <FlatList
              style={{flex: 1}}
              ItemSeparatorComponent={() => (
                <View style={sortItemStyle.separator} />
              )}
              numColumns={3}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              data={this.props.fictionList.toJS()}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => this.getCollectItem(item)}
              onEndReachedThreshold={0.2}
              onEndReached={() => this._onEndReached()}
              onRefresh={() => {
                this._onRefresh();
              }}
              refreshing={this.props.isRefreshing}
              ListFooterComponent={this.footer}
            />
          </View>
        </TouchableHighlight>
      </MainView>
    );
  }
}

const mapState = state => ({
  fictionList: state.BookShelfReducer.get('fictionList'),
  pageNo: state.BookShelfReducer.get('pageNo'),
  pageSize: state.BookShelfReducer.get('pageSize'),
  pages: state.BookShelfReducer.get('pages'),
  isRefreshing: state.BookShelfReducer.get('isRefreshing'),
  isLoadMore: state.BookShelfReducer.get('isLoadMore'),
  routeName: state.RouteReducer.get('routeName'),
  tip: state.BookShelfReducer.get('tip'),
  resultCode: state.BookShelfReducer.get('resultCode')
});

const mapDispatch = dispatch => ({
  GetBookShelfList(param) {
    dispatch(GetBookShelfList(param));
  },
  GetMoreBookShelfList(param) {
    dispatch(GetMoreBookShelfList(param));
  },
  RefreshBookShelfList(param) {
    dispatch(RefreshBookShelfList(param));
  }, 
  BookShelfFetchException(param) {
    dispatch(BookShelfFetchException(param));
  },
  ChangeCurrentRoute(obj) {
    dispatch(ChangeCurrentRoute(obj));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(BookShelfList);
