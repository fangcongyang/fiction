import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
    width: ImageWH,
    height: ImageWH * 0.3,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginLeft: 10,
    marginTop: 10,
  },
  name: {
    marginTop: 8,
    marginLeft: 20 + ImageWH * 0.22,
    fontSize: 12,
    lineHeight: 14,
    color: '#333',
  },
  introduce: {
    marginTop: 8,
    marginLeft: 20 + ImageWH * 0.22,
    fontSize: 12,
    lineHeight: 14,
    color: '#333',
  },
  introduceContent: {
    marginTop: 30,
    marginLeft: 46 + ImageWH * 0.22,
    position: 'absolute',
    fontSize: 12,
    lineHeight: 14,
    width: 170,
    height: 28,
    color: '#333',
  },
  separator: {
    backgroundColor: '#666',
  },
  author: {
    marginTop: 22,
    marginLeft: 20 + ImageWH * 0.22,
    fontSize: 12,
    color: '#333',
  },
  bookImage: {
    width: ImageWH * 0.2,
    height: ImageWH * 0.2,
    position: 'absolute',
    left: 0,
    marginLeft: ImageWH * 0.02,
    marginTop: ImageWH * 0.05,
  },
  addFont: {
    position: 'absolute',
    right: 0,
    marginRight: ImageWH * 0.05,
    marginTop: (ImageWH * 0.3 - 35) / 2,
  },
});

import fetch from '../../common/fetch';
class FictionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fictionList: [],
      sort: this.props.navigation.state.params.sort,
      pageNo: 1,
      pageSize: 10,
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
      .get('fiction', {
        sortId: this.state.sort.id,
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
      })
      .then(value => {
        let data = this.state.fictionList;
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
          fictionList: data,
          pageNo: value.pageNo,
          pages: value.pages,
        });
      });
  }
  getCollectItem(props) {
    return (
      <TouchableOpacity
        style={sortItemStyle.item}
        onPress={this.gotoIntroduce.bind(this, props)}>
        <Image style={sortItemStyle.bookImage} source={{uri: props.logo}} />
        <Text style={sortItemStyle.name}>{props.name}</Text>
        <Text style={sortItemStyle.introduce}>简介:</Text>
        <Text style={sortItemStyle.introduceContent} numberOfLines={2}>
          {props.introduce.replace(/' '/g, '')}
        </Text>
        <Text style={sortItemStyle.author}>作者: {props.bookCount}</Text>
        <AntDesign
          style={sortItemStyle.addFont}
          name={'pluscircle'}
          size={35}
          color="#38adfd"
        />
      </TouchableOpacity>
    );
  }
  gotoIntroduce = fiction => {
    this.props.navigation.navigate('Fiction', {
      fictionId: fiction.id,
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
            data={this.state.fictionList}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => this.getCollectItem(item)}
            onEndReachedThreshold={0.3}
            onEndReached={() => this._onEndReached()}
            onRefresh={() => {
              this._onRefresh();
            }}
            refreshing={this.state.isRefreshing}
          />
        </View>
      </MainView>
    );
  }
}

export default FictionList;
