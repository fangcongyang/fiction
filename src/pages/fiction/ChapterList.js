import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Line from '../../components/Line';
import LocalStorageUtil from '../../common/LocalStorageUtil';
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
const ImageWH = screenW * 0.11; // 图片大小

const sortItemStyle = StyleSheet.create({
  item: {
    width: screenW,
    height: ImageWH,
    backgroundColor: '#fff',
  },
  name: {
    marginTop: (ImageWH - 14) / 2,
    marginLeft: ImageWH * 0.5,
    fontSize: 14,
    color: '#333',
  },
  separator: {
    backgroundColor: '#eee',
    height: 1,
  },
  addFont: {
    position: 'absolute',
    right: ImageWH * 0.2,
    marginTop: (ImageWH - 20) / 2,
  },
});
import fetch from '../../common/fetch';
class ChapterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapterList: [],
      fictionId: this.props.navigation.state.params.fictionId,
    };
  }
  componentDidMount() {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('fictionChapter', {
          fictionId: this.state.fictionId,
          tokenId: tokenId,
        })
        .then(value => {
          this.setState({
            chapterList: value.data,
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
        });;
    });
  }
  getChapterItem(props) {
    return (
      <TouchableOpacity
        style={sortItemStyle.item}
        onPress={this.gotoReaderPage.bind(this, props)}>
        <Text style={sortItemStyle.name}>
          第{props.sort}章.{' '}
          {props.name.length > 18
            ? props.name.substr(0, 16) + '...'
            : props.name}
        </Text>
        <AntDesign
          style={sortItemStyle.addFont}
          name={'right'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    );
  }
  footer = () => {
    return <Line color="666" size={10} />;
  };
  gotoReaderPage = props => {
    this.props.navigation.navigate('ReaderPage', {
      chapter: props,
      chapters: this.state.chapterList,
    });
  };
  back = () => {
    this.props.navigation.goBack();
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
      <View style={{flex: 1}}>
        <NavigtionBar
          style={{
            flex: 1,
          }}
          titleStyle={{color: '#fff'}}
          navBar={{
            backgroundColor: '#3e9ce9',
          }}
          leftButton={leftBackBtn}
          title={'章节信息'}
          statusBar={{}}
        />
        <FlatList
          style={{
            flex: 1,
          }}
          ItemSeparatorComponent={() => (
            <View style={sortItemStyle.separator} />
          )}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.chapterList}
          keyExtractor={item => item.id}
          renderItem={({item}) => this.getChapterItem(item)}
          ListFooterComponent={this.footer}
        />
      </View>
    );
  }
}

export default ChapterList;
