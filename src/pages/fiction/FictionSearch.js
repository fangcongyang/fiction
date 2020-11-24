import React, {Component} from 'react';
import { SearchBar, Button  } from 'react-native-elements';
import MainView from '../../components/MainView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Line from '../../components/Line';
import LocalStorageUtil from '../../common/LocalStorageUtil';
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
const ImageWH = screenW - 2 * 10; // 图片大小

const styles = StyleSheet.create({
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
  bookImage: {
    flex: 3,
    marginLeft: 5,
    height: 80,
  },
  addFont: {
    flex: 2,
  },
});

import fetch from '../../common/fetch';
class FictionSearch extends Component {
  constructor(props) {
    super(props);
    this.search= React.createRef();
    this.state = {
      search: '',
      pageNo: 1,
      pageSize: 10,
      pages: 0,
      fictionList: [],
      isLoadMore: false,
    };
  }
  async getDataList() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('es/fiction', {
          search: this.state.search,
          pageNo: this.state.pageNo,
          pageSize: this.state.pageSize,
        })
        .then(value => {
          console.log(value);
          let data = this.state.fictionList;
          if (this.state.pageNo === 1) {
            data = value.data.records;
          } else {
            data = data.concat(value.data.records);
          }
          this.setState({
            fictionList: data,
            pages: value.data.pages,
            isLoadMore: false,
          });
        })
        .catch(err => {
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
        style={styles.item}
        onPress={this.gotoIntroduce.bind(this, props)}>
        <Image style={styles.bookImage} source={{uri: props.logo}} />
        <View style={styles.fictionInfo}>
          <Text style={styles.name}>{props.name}</Text>
          <View style={styles.fictionIntroduce}>
            <Text style={styles.introduce}>简介:</Text>
            <Text style={styles.introduceContent} numberOfLines={2}>
              {props.introduce.replace(/' '/g, '')}
            </Text>
          </View>
          <Text style={styles.author}>作者: {props.author}</Text>
        </View>
        {!props.collect ? (
          <AntDesign
            style={styles.addFont}
            onPress={this.collect.bind(this, props)}
            name={'pluscircle'}
            size={35}
            color="#38adfd"
          />
        ) : <View style={styles.addFont}></View>}
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
      let fictionList = this.state.fictionList;
      for (var i = 0, length = fictionList.length; i < length; i++) {
        if (fictionList[i].id === id) {
          fictionList[i].collect = true;
        }
      }
      this.setState({
        fictionList: fictionList,
      });
    }
  };
  back = () => {
    this.props.navigation.goBack();
  };
  _onEndReached() {
    //上拉加载更多
    const {pageNo, pages, isLoadMore} = this.state;
    if (pageNo < pages && !isLoadMore) {
      this.setState({
        pageNo: pageNo + 1, //加载下一页
        isLoadMore: true, //正在加载更多});
      });
      setTimeout(() => {
        this.getDataList();
      }, 200);
    }
  }
  _onChangeText(search) {
    this.setState({
      pageNo: 1,
      search: search,
    });
  }
  render() {
    return (
      <MainView>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E1E8EE'}}>
          <SearchBar
            ref={(search) => this.search = search}
            lightTheme
            inputContainerStyle={{backgroundColor: "#fff", height: 40, width: screenW * 0.8}}
            placeholder="请输入小说关键词"
            onChangeText={this._onChangeText.bind(this)}
            onCancel={this.back.bind(this)}
            onSubmitEditing={() => { 
              this.getDataList().then(() => {
                this.search.blur();
              });
            }}
            value={this.state.search}/>
          <Button title='取消' onPress={this.back.bind(this)}/>
        </View>
        <FlatList
          style={{flex: 1}}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.fictionList}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => this.getCollectItem(item)}
          onEndReachedThreshold={0.3}
          onEndReached={() => this._onEndReached()}
          ListFooterComponent={this.footer}
        />
      </MainView>
    );
  }
}

export default FictionSearch;
