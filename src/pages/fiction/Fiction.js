import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyButton from '../../components/Button';
import LocalStorageUtil from '../../common/LocalStorageUtil';
import Toast from 'react-native-root-toast';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const ImageWH = screenW * 0.35; // 图片大小

const sortItemStyle = StyleSheet.create({
  item: {
    width: screenW,
    height: screenH * 0.3,
  },
  bookImage: {
    width: ImageWH,
    height: screenH * 0.25,
    position: 'absolute',
    marginLeft: ImageWH * 0.05,
    marginTop: ImageWH * 0.05,
  },
  name: {
    marginTop: ImageWH * 0.05,
    marginLeft: 20 + ImageWH,
    fontSize: 24,
    color: '#333',
  },
  author: {
    marginTop: 18,
    marginLeft: 20 + ImageWH,
    fontSize: 14,
    color: '#333',
  },
  introduceItem: {
    backgroundColor: '#fff',
    width: screenW,
    height: screenH * 0.1,
  },
  introduce: {
    marginLeft: 20,
    fontSize: 12,
    lineHeight: 14,
    width: screenW * 0.9,
    height: 42,
    color: '#333',
  },
  chapterItem: {
    backgroundColor: '#fff',
    marginTop: ImageWH * 0.1,
    width: screenW,
    height: screenH * 0.05,
  },
  chapterText: {
    fontSize: 14,
    height: 20,
    marginTop: (screenH * 0.05 - 20) / 2,
    marginLeft: 20,
  },
  chapterAddFont: {
    position: 'absolute',
    right: 0,
    marginRight: ImageWH * 0.15,
    marginTop: (screenH * 0.05 - 20) / 2,
  },
  button: {
    marginBottom: 30,
    width: screenW * 0.6,
    borderRadius: 24,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import fetch from '../../common/fetch';
class Fiction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fiction: [],
      fictionId: this.props.navigation.state.params.fictionId,
      isCollect: false,
    };
  }
  componentDidMount() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('fiction/' + this.state.fictionId, {
          tokenId: tokenId,
        })
        .then(value => {
          this.setState({
            fiction: value.data,
            isCollect: value.data.collect,
          });
        }).catch(err => {
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
  gotoChapterList = fictionId => {
    this.props.navigation.navigate('ChapterList', {
      fictionId: fictionId,
    });
  };
  back = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };
  onBackAndroid = () => {
    const {navigation} = this.props;
    if (this.props.navigation.state.params.isFictionList) {
      navigation.state.params.onCollect(
        this.state.fictionId,
        this.state.isCollect,
      );
    }
  };
  collect = fiction => {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      let formData = new FormData();
      formData.append('fictionId', fiction.id);
      formData.append('tokenId', tokenId);
      fetch.post('userFiction', formData).then(() => {
        this.setState({
          isCollect: true,
        });
        this.onBackAndroid();
      });
    });
  };
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
        <NavigtionBar
          titleStyle={{color: '#fff'}}
          navBar={{
            backgroundColor: '#3e9ce9',
          }}
          leftButton={leftBackBtn}
          title={'简介'}
          statusBar={{}}
        />
        <View style={sortItemStyle.item}>
          <Image
            style={sortItemStyle.bookImage}
            source={{uri: this.state.fiction.logo}}
          />
          <Text style={sortItemStyle.name}>{this.state.fiction.name}</Text>
          <Text style={sortItemStyle.author}>
            作者: {this.state.fiction.author}
          </Text>
          <Text style={sortItemStyle.author}>
            字数:{' '}
            {this.state.fiction.wordCount >= 10000
              ? (this.state.fiction.wordCount / 10000).toFixed(2) + '万'
              : (this.state.fiction.wordCount / 1000).toFixed(2) + '千'}
          </Text>
          <Text style={sortItemStyle.author}>
            评分: {this.state.fiction.score}
          </Text>
        </View>
        <View style={sortItemStyle.introduceItem}>
          <Text style={{marginLeft: 20, marginTop: 4}}>简介:</Text>
          <Text style={sortItemStyle.introduce} numberOfLines={3}>
            &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.fiction.introduce}
          </Text>
        </View>
        <TouchableOpacity
          style={sortItemStyle.chapterItem}
          onPress={this.gotoChapterList.bind(this, this.state.fictionId)}>
          <Text style={sortItemStyle.chapterText}>查看章节</Text>
          <AntDesign
            style={sortItemStyle.chapterAddFont}
            name={'right'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {!this.state.isCollect ? (
          <View style={{flex: 1, flexDirection: 'row',
            justifyContent: 'center',alignItems: 'flex-end'}}>
            <MyButton
              style={sortItemStyle.button}
              fColor="#fff"
              bgColor="#38adfd"
              size={screenW * 0.05}
              text="加入书架"
              onPress={this.collect.bind(this, this.state.fiction)}
            />
          </View>
        ) : null}
      </MainView>
    );
  }
}

export default Fiction;
