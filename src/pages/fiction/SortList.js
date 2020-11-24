import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import {connect} from 'react-redux';
import {
  GetSortList,
  GetMoreSortList,
  RefreshSortList,
  ChangeCurrentRoute,
  SortFetchException,
} from '../../redux/actionCreators';
import Line from '../../components/Line';
import LocalStorageUtil from '../../common/LocalStorageUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-root-toast';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const screenW = Dimensions.get('window').width;
const ImageWH = (screenW - (2 + 1) * 10) / 2; // 图片大小

const sortItemStyle = StyleSheet.create({
  item: {
    width: ImageWH,
    height: ImageWH * 0.5,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  name: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 12,
    color: '#333',
  },
  separator: {
    backgroundColor: '#666',
  },
  bookCount: {
    marginTop: 34,
    position: 'absolute',
    marginLeft: 20,
    fontSize: 12,
    color: '#666',
  },
  bookImage: {
    width: ImageWH * 0.35,
    height: ImageWH * 0.4,
    position: 'absolute',
    right: 0,
    marginRight: ImageWH * 0.02,
    marginTop: ImageWH * 0.05,
  },
  search: {
    paddingTop: 4, paddingBottom: 4, flex: 1,
  },
});
import fetch from '../../common/fetch';
class SortList extends Component {
  static navigationOptions = {
    title: '小说分类',
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.ChangeCurrentRoute({
      routeName: this.props.navigation.state.routeName,
    });
    if (this.props.sortList.size === 0) {
      this._onRefresh();
    }
  }
  async getDataList() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('fictionSort', {
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize,
          tokenId: tokenId,
        })
        .then(value => {
          let data = this.props.sortList;
          if (this.props.pageNo === 1) {
            data = value.data.records;
          } else {
            data = data.concat(value.data.records);
          }
          this.props.GetSortList({
            sortList: data,
            pages: value.data.pages,
            isRefreshing: false,
            isLoadMore: false,
          });
        })
        .catch(err => {
          this.props.SortFetchException({});
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
        onPress={this.gotoArticle.bind(this, props)}>
        <Text style={sortItemStyle.name}>{props.name}</Text>
        <Text style={sortItemStyle.bookCount}>{props.bookCount}本</Text>
        <Image style={sortItemStyle.bookImage} source={{uri: props.logo}} />
      </TouchableOpacity>
    );
  }
  footer = () => {
    return <Line color="666" size={10} />;
  };
  gotoArticle = article => {
    this.props.navigation.navigate('FictionList', {
      sort: article,
    });
  };
  _onEndReached() {
    //上拉加载更多
    const {pageNo, pages, isLoadMore} = this.props;
    if (pageNo < pages && !isLoadMore) {
      this.props.GetMoreSortList({
        pageNo: pageNo + 1, //加载下一页
        isLoadMore: true, //正在加载更多});
      });
      setTimeout(() => {
        this.getDataList();
      }, 200);
    }
  }
  _onRefresh() {
    // 下拉刷新
    // 正在上拉刷新，请求第一页
    this.props.RefreshSortList({
      isRefreshing: true,
      pageNo: 1,
    });
    setTimeout(() => {
      this.getDataList();
    }, 200);
  }
  goToSearch = () => {
    this.props.navigation.navigate('FictionSearch', {});
  };
  render() {
    let searchBtn = (
      <TouchableOpacity style={sortItemStyle.search} onPress={this.goToSearch}>
        <AntDesign
          style={{color: '#fff'}}
          name={'search1'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    );
    return (
      <View style={{flex: 1}}>
        <NavigtionBar
          titleStyle={{color: '#fff'}}
          navBar={{
            backgroundColor: '#3e9ce9',
          }}
          title={'小说分类'}
          rightButton={searchBtn}
          statusBar={{}}
        />
        <FlatList
          style={{flex: 1}}
          ItemSeparatorComponent={() => (
            <View style={sortItemStyle.separator} />
          )}
          horizontal={false}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          data={this.props.sortList.toJS()}
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
    );
  }
}

const mapState = state => ({
  sortList: state.SortListReducer.get('sortList'),
  pageNo: state.SortListReducer.get('pageNo'),
  pageSize: state.SortListReducer.get('pageSize'),
  pages: state.SortListReducer.get('pages'),
  isRefreshing: state.SortListReducer.get('isRefreshing'),
  isLoadMore: state.SortListReducer.get('isLoadMore'),
  routeName: state.RouteReducer.get('routeName'),
  tip: state.SortListReducer.get('tip'),
  resultCode: state.SortListReducer.get('resultCode')
});

const mapDispatch = dispatch => ({
  GetSortList(param) {
    dispatch(GetSortList(param));
  },
  GetMoreSortList(param) {
    dispatch(GetMoreSortList(param));
  },
  RefreshSortList(param) {
    dispatch(RefreshSortList(param));
  },
  ChangeCurrentRoute(obj) {
    dispatch(ChangeCurrentRoute(obj));
  },
  SortFetchException(param){
    dispatch(SortFetchException(param));
  }
});

export default connect(
  mapState,
  mapDispatch,
)(SortList);
