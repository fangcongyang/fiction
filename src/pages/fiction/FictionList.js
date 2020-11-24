import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Line from '../../components/Line';
import LocalStorageUtil from '../../common/LocalStorageUtil';
import Toast from 'react-native-root-toast';
import {
  SaveSort,
  GetFictionList,
  GetMoreFictionList,
  RefreshFictionList,
  UpdateFictionList,
  FictionListFetchException,
} from '../../redux/actionCreators';
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
const ImageWH = screenW - 2 * 10; // 图片大小

const sortItemStyle = StyleSheet.create({
  item: {
    flex: 1,
    width: ImageWH,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  bookImage: {
    flex: 3,
    marginLeft: 5,
    height: 80,
  },

  fictionInfo: {
    marginLeft: 5,
    flex: 8,
    flexDirection: 'column',
  },

  name: {
    marginTop: 8,
    flex: 2,
    fontSize: 12,
    color: '#333',
  },
  
  fictionIntroduce: {
    flex: 3,
    flexDirection: 'row',
  },

  introduce: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },

  introduceContent: {
    flex: 5,
    fontSize: 12,
    color: '#333',
  },

  separator: {
    backgroundColor: '#666',
  },

  author: {
    flex: 2,
    fontSize: 12,
    color: '#333',
  },

  addFont: {
    flex: 2,
  },
});

import fetch from '../../common/fetch';
class FictionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: this.props.navigation.state.params.sort,
    };
  }
  
  componentDidMount() {
    if (
      JSON.stringify(this.props.sort) === '{}' ||
      this.state.sort.id !== this.props.sort.id ||
      this.props.fictionList.size === 0
    ) {
      this.props.SaveSort({
        sort: this.state.sort,
      });
      this._onRefresh();
    }
  }
  async getDataList() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('fiction', {
          sortId: this.state.sort.id,
          pageNo: this.props.pageNo,
          pageSize: this.props.pageSize,
          tokenId: tokenId,
        })
        .then(value => {
          let data = this.props.fictionList;
          if (this.props.pageNo === 1) {
            data = value.data.records;
          } else {
            data = data.concat(value.data.records);
          } 
          this.props.GetFictionList({
            fictionList: data,
            pages: value.data.pages,
            isRefreshing: false,
            isLoadMore: false,
          });
        })
        .catch(err => {
          this.props.FictionListFetchException({});
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
        onPress={this.gotoIntroduce.bind(this, props)}>
        <Image style={sortItemStyle.bookImage} source={{uri: props.logo}} />
        <View style={sortItemStyle.fictionInfo}>
          <Text style={sortItemStyle.name}>{props.name}</Text>
          <View style={sortItemStyle.fictionIntroduce}>
            <Text style={sortItemStyle.introduce}>简介:</Text>
            <Text style={sortItemStyle.introduceContent} numberOfLines={2}>
              {props.introduce.replace(/' '/g, '')}
            </Text>
          </View>
          <Text style={sortItemStyle.author}>作者: {props.author}</Text>
        </View>
        {!props.collect ? (
          <AntDesign
            style={sortItemStyle.addFont}
            onPress={this.collect.bind(this, props)}
            name={'pluscircle'}
            size={35}
            color="#38adfd"
          />
        ) : <View style={sortItemStyle.addFont}></View>}
      </TouchableOpacity>
    );
  }
  footer = () => {
    return <Line color="666" size={10} />;
  };
  gotoIntroduce = fiction => {
    this.props.navigation.navigate('Fiction', {
      fictionId: fiction.id,
      isFictionList: true,
      onCollect: this.onCollect,
    });
  };
  collect = fiction => {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      let formData = new FormData();
      formData.append('fictionId', fiction.id);
      formData.append('tokenId', tokenId);
      fetch.post('userFiction', formData).then(() => {
        this.onCollect(fiction.id, true);
      });
    });
  };
  onCollect = (id, isCollect) => {
    if (isCollect) {
      let fictionList = this.props.fictionList.toJS();
      for (var i = 0, length = fictionList.length; i < length; i++) {
        if (fictionList[i].id === id) {
          fictionList[i].collect = true;
        }
      }
      this.props.UpdateFictionList({
        fictionList: fictionList,
      });
    }
  };
  back = () => {
    this.props.navigation.goBack();
  };
  _onEndReached() {
    //上拉加载更多
    const {pageNo, pages, isLoadMore} = this.props;
    if (pageNo < pages && !isLoadMore) {
      this.props.GetMoreFictionList({
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
    this.props.RefreshFictionList({
      isRefreshing: true,
      pageNo: 1,
    });
    setTimeout(() => {
      this.getDataList();
    }, 200);
  }
  render() {
    let leftBackBtn = (
      <TouchableOpacity style={{paddingTop: 4, paddingBottom: 4, flex: 1,}} onPress={this.back}>
        <Image
          style={{width: 26, height: 26}}
          source={require('../../res/images/ic_arrow_back_white_36pt.png')}
        />
      </TouchableOpacity>
    );
    return (
      <MainView style={{marginTop: 0}}>
        <View style={{flex: 1}}>
          <NavigtionBar
            titleStyle={{color: '#fff'}}
            navBar={{
              backgroundColor: '#3e9ce9',
            }}
            leftButton={leftBackBtn}
            title={this.state.sort.name}
            statusBar={{}}
          />
          <FlatList
            style={{flex: 1}}
            ItemSeparatorComponent={() => (
              <View style={sortItemStyle.separator} />
            )}
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
      </MainView>
    );
  }
}

const mapState = state => ({
  sort: state.FictionListReducer.get('sort'),
  fictionList: state.FictionListReducer.get('fictionList'),
  pageNo: state.FictionListReducer.get('pageNo'),
  pageSize: state.FictionListReducer.get('pageSize'),
  pages: state.FictionListReducer.get('pages'),
  isRefreshing: state.FictionListReducer.get('isRefreshing'),
  isLoadMore: state.FictionListReducer.get('isLoadMore'),
});

const mapDispatch = dispatch => ({
  SaveSort(param) {
    dispatch(SaveSort(param));
  },
  GetFictionList(param) {
    dispatch(GetFictionList(param));
  },
  GetMoreFictionList(param) {
    dispatch(GetMoreFictionList(param));
  },
  RefreshFictionList(param) {
    dispatch(RefreshFictionList(param));
  },
  UpdateFictionList(param) {
    dispatch(UpdateFictionList(param));
  },
  FictionListFetchException(param) {
    dispatch(FictionListFetchException(param));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(FictionList);
