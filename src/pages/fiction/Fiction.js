import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyButton from '../../components/Button';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  NativeModules,
} from 'react-native';

const {StatusBarManager} = NativeModules;
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const ImageWH = screenW * 0.35; // 图片大小
const statusTarHeight = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const tarH = Platform.OS === 'ios' ? 44 : 50;

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
    marginTop: screenH * 0.55 - ImageWH * 0.2 - tarH - statusTarHeight,
    marginLeft: screenW * 0.2,
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
    };
  }
  UNSAFE_componentWillMount() {
    fetch.get('fiction/' + this.state.fictionId).then(value => {
      this.setState({
        fiction: value,
      });
    });
  }
  gotoChapterList = fictionId => {
    this.props.navigation.navigate('ChapterList', {
      fictionId: fictionId,
    });
  };
  back = () => {
    this.props.navigation.goBack();
  };
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
            作者: {this.state.fiction.bookCount}
          </Text>
          <Text style={sortItemStyle.author}>
            字&nbsp;: {this.state.fiction.bookCount}
          </Text>
          <Text style={sortItemStyle.author}>
            评分: {this.state.fiction.bookCount}
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
        <View style={{flex: 1}}>
          <MyButton
            style={sortItemStyle.button}
            fColor="#fff"
            bgColor="#38adfd"
            size={screenW * 0.05}
            text="加入书架"
            onPress={() => {}}
          />
        </View>
      </MainView>
    );
  }
}

export default Fiction;
