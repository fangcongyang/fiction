import React, {Component} from 'react';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import MyButton from '../../components/Button';
import fetch from '../../common/fetch';
import Toast from 'react-native-root-toast';
import {EasyLoading, Loading} from '../../components/EasyLoading';
import Slider from '@react-native-community/slider';
import LocalStorageUtil from '../../common/LocalStorageUtil';
import {connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  ChangeTheme
} from '../../redux/actionCreators';
import NavigtionBar from '../../components/NavigationBar';
import Line from '../../components/Line';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

const styles = StyleSheet.create({
  endText: {
    textAlign: 'center',
  },
  content: {
    width: screenW - 20,
    marginLeft: 10,
    lineHeight: 30,
  },
  menu: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  //目录列表相关样式
  slider: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  separator: {
    width: screenW * 0.8,
    backgroundColor: '#eee',
    height: 1,
  },
});

class ReadPage extends Component {
  _flatList;
  constructor(props) {
    super(props);
    this.state = {
      fontSizeStyle: {
        contentFontSize: 18,
      },
      chapter: this.props.navigation.state.params.chapter,
      chapters: this.props.navigation.state.params.chapters,
      content: null,
      modalVisible: false,
      sliderShow: false,
      setVisible: false,
      title: '',
      sliderValue: this.props.navigation.state.params.chapter.sort,
      contentOffset: {
        x: 0,
        y: 0,
      },
    };
  }
  componentDidMount() {
    this.initReadPage(this.state.chapter.id);
  }
  initReadPage = chapterId => {
    LocalStorageUtil.getItem('tokenId').then(tokenId => {
      fetch
        .get('fictionChapter/' + chapterId, {
          tokenId: tokenId,
        })
        .then(value => {
          this.setState({
            content: value.data.context
              .replace(/&nbsp;/g, '  ')
              .replace(/\n+/g, '\n'),
            title: value.data.name,
            chapter: value.data,
            sliderShow: false,
            setVisible: false,
            modalVisible: false,
            sliderValue: value.data.sort,
          });
        })
        .then(() => {
          setTimeout(() => {
            this.scrollView.scrollTo({x: 0, y: 0, animated: true});
            EasyLoading.dismiss();
          }, 200);
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
  };
  back = () => {
    this.props.navigation.goBack();
  };
  onOpenMenuPanel = () => {
    this.setState({
      modalVisible: true,
    });
  };
  /**
   * 日常夜间模式切换
   */
  onDayModeClick = () => {
    this.props.ChangeTheme({
      isNight: !this.props.isNight
    })
  };
  getChapterItem(props) {
    return (
      <TouchableOpacity
        style={{
          width: screenW * 0.8,
          height: screenW * 0.11,
          backgroundColor: this.props.bgColor,
        }}
        onPress={this.onChapterItemClick.bind(this, props)}>
        <Text
          style={{
            fontSize: this.state.fontSizeStyle.contentFontSize,
            marginTop:
              (screenW * 0.11 - this.state.fontSizeStyle.contentFontSize) / 2,
            marginLeft: 10,
            color:
              this.state.sliderValue == props.sort
                ? '#449bda'
                : this.props.fontColor,
          }}>
          第{props.sort}章. {props.name}
        </Text>
      </TouchableOpacity>
    );
  }
  //字章节点击事件
  onChapterItemClick = chapter => {
    this.initReadPage(chapter.id);
  };
  //读书页点击事件
  onMenuClick = type => {
    this.setState({
      currShowMenu: type,
    });
  };
  //下一章点击事件
  onNextChapterClick = () => {
    let sliderValue = this.state.sliderValue;
    if (sliderValue >= this.state.chapters.length) {
      Toast.show('文章已到末尾!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      EasyLoading.show('加载中', -1);
      this.initReadPage(this.state.chapters[sliderValue].id);
    }
  };
  //上一章点击事件
  onBeforeChapterClick = () => {
    let sliderValue = this.state.sliderValue - 2;
    if (sliderValue < 0) {
      Toast.show('文章已到头!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      EasyLoading.show('加载中', -1);
      this.initReadPage(this.state.chapters[sliderValue].id);
    }
  };
  //滑块滑动事件
  _sliderValueChange = value => {
    this.setState({
      sliderValue: value,
    });
  };
  //滑块滑动结束事件
  _sliderValueComplete = value => {
    this.initReadPage(this.state.chapters[value - 1].id);
  };
  openSlider = () => {
    this.setState({
      modalVisible: false,
      sliderShow: true,
    });
    setTimeout(() => {
      this._flatList.scrollToIndex({
        animated: true,
        index: this.state.sliderValue - 1,
      });
    }, 1000);
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.props.bgColor}}>
        <Modal
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          animationInTiming={500}
          animationOutTiming={500}
          swipeDirection="left"
          isVisible={this.state.sliderShow}
          onBackdropPress={() => this.setState({sliderShow: false})}
          style={styles.slider}>
          <FlatList
            style={{
              height: screenH,
              width: screenW * 0.8,
              backgroundColor: this.props.bgColor,
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.chapters}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => this.getChapterItem(item)}
            ref={flatList => (this._flatList = flatList)}
            getItemLayout={(data, index) => {
              let offset = (screenW * 0.11 + 1) * index;
              return {length: screenW * 0.11 + 1, offset, index};
            }}
          />
        </Modal>
        <Modal
          swipeDirection="down"
          backdropOpacity={0}
          isVisible={this.state.setVisible}
          onBackdropPress={() => this.setState({setVisible: false})}
          style={styles.menu}>
          <Line color="#fff" size={1} />
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: this.props.bgColor,
            }}>
            <Text
              style={{
                color: this.props.fontColor,
                fontSize: this.state.fontSizeStyle.contentFontSize,
                marginLeft: 10,
              }}>
              字号
            </Text>
            <View style={{
              height: 60,
              flex: 1,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              backgroundColor: this.props.bgColor,
            }}>
              <MyButton
                style={{
                  borderWidth: 0.2,
                  borderColor: '#808080',
                  borderRadius: 3,
                  marginRight: 20
                }}
                fColor={this.props.fontColor}
                bgColor={this.props.bgColor}
                text="A－"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={() =>
                  this.setState({
                    fontSizeStyle: {
                      contentFontSize:
                        this.state.fontSizeStyle.contentFontSize - 1,
                    },
                  })
                }
              />
              <MyButton
                style={{
                  borderWidth: 0.2,
                  borderColor: '#808080',
                  borderRadius: 3,
                  marginRight: 20
                }}
                fColor={this.props.fontColor}
                bgColor={this.props.bgColor}
                text="A＋"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={() =>
                  this.setState({
                    fontSizeStyle: {
                      contentFontSize:
                        this.state.fontSizeStyle.contentFontSize + 1,
                    },
                  })
                }
              />
            </View>
          </View>
        </Modal>
        <Modal
          swipeDirection="down"
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({modalVisible: false})}
          backdropOpacity={0}
          style={styles.menu}>
          <View>
            <View style={{
                backgroundColor: this.props.bgColor,
              }}>
              <Line color="#fff" size={1} />
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  color: this.props.fontColor,
                  marginTop: 10,
                  textAlign: 'center',
                }}>
                {this.state.title.length > 18
                  ? this.state.title.substr(0, 18) + '...'
                  : this.state.title}
              </Text>
            </View>
            <View
              style={{
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: this.props.bgColor,
              }}>
              <MyButton
                style={{
                  right: 0,
                  marginLeft: 20,
                  borderWidth: 0.2,
                  borderColor: '#808080',
                  borderTopWidth: 0,
                  borderRadius: 3,
                }}
                fColor={this.props.fontColor}
                bgColor={this.props.bgColor}
                text="上一章"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={this.onBeforeChapterClick}
              />
              <Slider
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  height: 20,
                  flex: 2
                }}
                step={1}
                value={this.state.sliderValue}
                minimumValue={1}
                maximumValue={this.state.chapters.length}
                onValueChange={this._sliderValueChange}
                onSlidingComplete={this._sliderValueComplete}
              />
              <MyButton
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  borderWidth: 0.2,
                  borderTopWidth: 0,
                  marginRight: 20,
                  borderColor: '#808080',
                  borderTopWidth: 0,
                  borderRadius: 3,
                }}
                fColor={this.props.fontColor}
                bgColor={this.props.bgColor}
                text="下一章"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={this.onNextChapterClick}
              />
            </View>
            <View style={{
                backgroundColor: this.props.bgColor,
              }}>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  textAlign: 'center',
                  color: this.props.fontColor,
                  marginBottom: 10,
                }}>
                第{this.state.sliderValue}章:{'  '}
                {this.state.chapters[this.state.sliderValue - 1].name.length >
                14
                  ? this.state.chapters[this.state.sliderValue - 1].name.substr(
                      0,
                      14,
                    ) + '...'
                  : this.state.chapters[this.state.sliderValue - 1].name}
              </Text>
            </View>
            <Line color="#fff" size={1} />
            <View
              style={{
                height: 60,
                flexDirection: 'row',
                backgroundColor: this.props.bgColor,
                alignItems: 'center'
              }}>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  marginLeft: 10,
                  color: this.props.fontColor,
                  flex: 1,       
                  textAlign: 'left'
                }}
                onPress={this.openSlider}>
                目录
              </Text>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  color: this.props.fontColor,
                  flex: 1,
                  textAlign: 'center'
                }}
                onPress={() =>
                  this.setState({setVisible: true, modalVisible: false})
                }>
                设置
              </Text>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  marginRight: 10,
                  color: this.props.fontColor,
                  flex: 1,
                  textAlign: 'right'
                }}
                onPress={this.onDayModeClick}>
                {this.props.isNight ? '白天' : '夜间'}
              </Text>
            </View>
          </View>
        </Modal>
        <NavigtionBar
          leftButton={
            <TouchableOpacity style={{flex: 1,}} onPress={this.back}>
              <Entypo
                name={'chevron-thin-left'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          }
          navBar={{
            backgroundColor: this.props.bgColor,
          }}
          title={this.state.title}
          titleStyle={{color: this.props.fontColor}}
          statusBar={{
            backgroundColor: this.props.bgColor,
          }}
        />

        <ScrollView
          style={{
            backgroundColor: this.props.bgColor,
          }}
          ref={view => {
            this.scrollView = view;
          }}
          scrollEventThrottle={100}
          onScroll={this.onScroll}>
          <TouchableOpacity activeOpacity={1} onPress={this.onOpenMenuPanel}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.content,
                  {
                    fontSize: this.state.fontSizeStyle.contentFontSize,
                    color: this.props.fontColor,
                  },
                ]}>
                {this.state.content}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Loading />
      </View>
    );
  }
}

const mapState = state => ({
  isNight: state.ThemeReducer.get('isNight'),
  bgColor: state.ThemeReducer.get('bgColor'),
  fontColor: state.ThemeReducer.get('fontColor'),
});

const mapDispatch = dispatch => ({
  ChangeTheme(param) {
    dispatch(ChangeTheme(param));
  }
});

export default connect(
  mapState,
  mapDispatch,
)(ReadPage);
