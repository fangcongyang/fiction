import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import {connect} from 'react-redux';
import {login} from '../../service/action';
import MainView from '../../components/MainView';
import Line from '../../components/Line';
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
});
import fetch from '../../common/fetch';
class SortList extends Component {
  static navigationOptions = {
    title: '小说分类',
  };
  constructor(props) {
    super(props);
    this.state = {
      sortList: [],
      pageNo: 1,
      pageSize: 18,
      pages: 0,
      isRefreshing: false, //控制下拉刷新
      isLoadMore: false, //控制上拉加载
    };
  }
  UNSAFE_componentWillMount() {
    this.getDataList();
  }
  async getDataList() {
    fetch
      .get('fictionSort', {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
      })
      .then(value => {
        let data = this.state.sortList;
        if (this.state.pageNo == 1) {
          data = value.records;
          this.setState({
            isRefreshing: false, //有可能是下拉刷新
          });
        } else {
          data = data.concat(value.records);
          this.setState({
            isLoadMore: false, //关闭正在加载更多
          });
        }
        this.setState({
          sortList: data,
          pages: value.pages,
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
  back = () => {
    this.props.navigation.goBack();
  };
  _onEndReached() {
    //上拉加载更多
    const {pageNo, pages, isLoadMore} = this.state;
    if (pageNo < pages && !isLoadMore) {
      //还有数据没有加载完，并且不是正在上拉加载更多
      this.setState(
        {
          pageNo: pageNo + 1, //加载下一页
          isLoadMore: true, //正在加载更多
        },
        () => {
          this.getDataList(); //利用setState的第二个参数，以便获取最新的state
        },
      );
    }
  }
  _onRefresh() {
    // 下拉刷新
    // 正在上拉刷新，请求第一页
    this.setState({isRefreshing: true, pageNo: 1}, () => {
      this.getDataList(); //利用setState的第二个参数，以便获取最新的state
    });
  }
  render() {
    let leftBackBtn = (
      <TouchableOpacity style={{padding: 8}} onPress={this.back}>
        <Image
          style={{width: 26, height: 26}}
          source={require('../../res/images/ic_arrow_back_white_36pt.png')}
        />
      </TouchableOpacity>
    );
    return (
      <MainView>
        <View style={{flex: 1}}>
          <NavigtionBar
            titleStyle={{color: '#fff'}}
            navBar={{
              backgroundColor: '#3e9ce9',
            }}
            leftButton={leftBackBtn}
            title={'小说分类'}
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
            data={this.state.sortList}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => this.getCollectItem(item)}
            onEndReachedThreshold={0.2}
            onEndReached={() => this._onEndReached()}
            onRefresh={() => {
              this._onRefresh();
            }}
            refreshing={this.state.isRefreshing}
            ListFooterComponent={this.footer}
          />
        </View>
      </MainView>
    );
  }
}

const mapState = state => ({
  loading: state.UserReducer.get('loading'),
  tip: state.UserReducer.get('tip'),
  isLogin: state.UserReducer.get('login'),
});

const mapDispatch = dispatch => ({
  login(param) {
    dispatch(login(param));
  },
});

export default connect(
  mapState,
  mapDispatch,
)(SortList);
