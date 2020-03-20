import React, {Component} from 'react';
import NavigtionBar from '../../components/NavigationBar';
import MainView from '../../components/MainView';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
  UNSAFE_componentWillMount() {
    fetch
      .get('fictionChapter', {fictionId: this.state.fictionId})
      .then(value => {
        this.setState({
          chapterList: value,
        });
      });
  }
  getChapterItem(props) {
    return (
      <TouchableOpacity
        style={sortItemStyle.item}
        onPress={this.gotoReaderPage.bind(this, props)}>
        <Text style={sortItemStyle.name}>
          第{props.sort}章. {props.name}
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
      <TouchableOpacity style={{padding: 8}} onPress={this.back}>
        <Image
          style={{width: 26, height: 26}}
          source={require('../../res/images/ic_arrow_back_white_36pt.png')}
        />
      </TouchableOpacity>
    );
    return (
      <MainView style={{marginTop: 0}}>
        <View style={{flxe: 1}}>
          <NavigtionBar
            titleStyle={{color: '#fff'}}
            navBar={{
              backgroundColor: '#3e9ce9',
            }}
            leftButton={leftBackBtn}
            title={'章节信息'}
            statusBar={{}}
          />
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={sortItemStyle.separator} />
            )}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.chapterList}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => this.getChapterItem(item)}
            ListFooterComponent={this.footer}
          />
        </View>
      </MainView>
    );
  }
}

export default ChapterList;
