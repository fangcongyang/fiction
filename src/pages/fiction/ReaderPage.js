import React, {Component} from 'react';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import MyButton from '../../components/Button';
import fetch from '../../common/fetch';
import Toast from 'react-native-root-toast';
import {EasyLoading, Loading} from '../../components/EasyLoading';
import Slider from '@react-native-community/slider';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';

import NavigtionBar from '../../components/NavigationBar';
import Line from '../../components/Line';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const ImageWH = screenW * 0.35; // 图片大小

const styles = StyleSheet.create({
  endText: {
    textAlign: 'center',
  },
  content: {
    width: screenW - 20,
    marginLeft: 10,
    marginTop: 20,
    lineHeight: 30,
  },
  menu: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  chapterAddFont: {
    position: 'absolute',
    marginLeft: ImageWH * 0.05,
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

export default class ReadPage extends Component {
  _flatList;
  constructor(props) {
    super(props);
    this.state = {
      fontSizeStyle: {
        contentFontSize: 18,
      },
      bgColor: '#e4cba3',
      fontColor: '#333',
      chapter: this.props.navigation.state.params.chapter,
      chapters: this.props.navigation.state.params.chapters,
      content: null,
      modalVisible: false,
      sliderShow: false,
      setVisible: false,
      title: '',
      isNight: false,
      thresholdFontSize: 2,
      sliderValue: this.props.navigation.state.params.chapter.sort,
      contentOffset: {
        x: 0,
        y: 0,
      },
    };
  }
  UNSAFE_componentWillMount() {
    this.initReadPage(this.state.chapter.id);
  }
  initReadPage = chapterId => {
    fetch.get('fictionChapter/' + chapterId, {}).then(value => {
      this.setState({
        content: value.context.replace(/&nbsp;/g, '  ').replace(/\n+/g, '\n'),
        title: value.name,
        chapter: value,
        sliderShow: false,
        sliderValue: value.sort,
      });
      this.scrollView.scrollTo({x: 0, y: 0, animated: true});
      EasyLoading.dismiss();
    });
  };
  setBgStyles = target => {
    this.setState({
      readStyle: {
        bgStyles: {
          backgroundColor: target.bgColor,
        },
        title: {
          color: '#333',
        },
        content: {
          color: '#333',
        },
      },
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
  onFontSizeChange = activity => {
    let newFontSizeStyle = Object.assign({}, this.state.fontSizeStyle);
    if (activity === 'sub') {
      for (let key in this.state.fontSizeStyle) {
        newFontSizeStyle[key] -= this.state.thresholdFontSize;
      }
    } else {
      for (let key in this.state.fontSizeStyle) {
        newFontSizeStyle[key] += this.state.thresholdFontSize;
      }
    }
    this.setState({
      fontSizeStyle: newFontSizeStyle,
    });
  };
  /**
   * 日常夜间模式切换
   */
  onDayModeClick = () => {
    let bgColor;
    let fontColor;
    if (this.state.isNight) {
      bgColor = '#e4cba3';
      fontColor = '#333';
    } else {
      bgColor = '#161616';
      fontColor = '#4f5050';
    }
    this.setState({
      isNight: !this.state.isNight,
      bgColor: bgColor,
      fontColor: fontColor,
    });
  };
  getChapterItem(props) {
    return (
      <TouchableOpacity
        style={{
          width: screenW * 0.8,
          height: screenW * 0.11,
          backgroundColor: this.state.bgColor,
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
                : this.state.fontColor,
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
      let toast = Toast.show('文章已到末尾!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      setTimeout(function() {
        Toast.hide(toast);
      }, 1000);
    } else {
      EasyLoading.show('加载中', -1);
      this.initReadPage(this.state.chapters[sliderValue].id);
    }
  };
  //上一章点击事件
  onBeforeChapterClick = () => {
    let sliderValue = this.state.sliderValue - 2;
    if (sliderValue < 0) {
      let toast = Toast.show('文章已到头!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      setTimeout(function() {
        Toast.hide(toast);
      }, 1000);
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
        // viewPosition: 0,
        animated: true,
        index: this.state.chapter.sort - 1,
      });
    }, 1000);
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.state.bgColor}}>
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
              backgroundColor: this.state.bgColor,
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
          {/* <View
            style={{
              height: 20,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: this.state.bgColor,
            }}>
            <Slider />
          </View> */}
          <Line color="#fff" size={1} />
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: this.state.bgColor,
            }}>
            <Text
              style={{
                color: this.state.fontColor,
                fontSize: this.state.fontSizeStyle.contentFontSize,
                marginLeft: 10,
              }}>
              字号
            </Text>
            <MyButton
              style={{
                right: 0,
                position: 'absolute',
                marginRight: 100,
                borderWidth: 0.2,
                borderColor: '#808080',
                borderRadius: 3,
              }}
              fColor={this.state.fontColor}
              bgColor={this.state.bgColor}
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
            <Text
              style={{
                right: 0,
                position: 'absolute',
                marginRight: 72,
              }}>
              {this.state.fontSizeStyle.contentFontSize}
            </Text>
            <MyButton
              style={{
                left: 0,
                position: 'absolute',
                marginLeft: 300,
                borderWidth: 0.2,
                borderColor: '#808080',
                borderRadius: 3,
              }}
              fColor={this.state.fontColor}
              bgColor={this.state.bgColor}
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
        </Modal>
        <Modal
          swipeDirection="down"
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({modalVisible: false})}
          backdropOpacity={0}
          style={styles.menu}>
          <View>
            <Line color="#fff" size={1} />
            <View
              style={{
                height: 120,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: this.state.bgColor,
              }}>
              <MyButton
                style={{
                  right: 0,
                  marginRight: 270,
                  position: 'absolute',
                  borderWidth: 0.2,
                  borderColor: '#808080',
                  borderTopWidth: 0,
                  borderRadius: 3,
                }}
                fColor={this.state.fontColor}
                bgColor={this.state.bgColor}
                text="上一章"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={this.onBeforeChapterClick}
              />
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  top: 10,
                  right: 0,
                  position: 'absolute',
                  color: this.state.fontColor,
                  marginRight:
                    (screenW -
                      this.state.title.length *
                        this.state.fontSizeStyle.contentFontSize) /
                    2,
                }}>
                {this.state.title}
              </Text>
              <Slider
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  top: 0,
                  left: 0,
                  height: 20,
                  width: 200,
                  position: 'absolute',
                  marginTop: 50,
                  marginLeft: (screenW - 200) / 2,
                }}
                step={1}
                value={this.state.chapter.sort}
                minimumValue={1}
                maximumValue={this.state.chapters.length}
                onValueChange={this._sliderValueChange}
                onSlidingComplete={this._sliderValueComplete}
              />
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  bottom: 0,
                  left: 0,
                  position: 'absolute',
                  color: this.state.fontColor,
                  marginBottom: 10,
                  marginLeft:
                    (screenW -
                      this.state.fontSizeStyle.contentFontSize *
                        (2 +
                          this.state.sliderValue.toString.length +
                          this.state.chapters[this.state.sliderValue - 1].name
                            .length)) /
                    2,
                }}>
                第{this.state.sliderValue}章:{'  '}
                {this.state.chapters[this.state.sliderValue - 1].name}
              </Text>
              <MyButton
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  left: 0,
                  position: 'absolute',
                  borderWidth: 0.2,
                  borderTopWidth: 0,
                  marginLeft: 270,
                  borderColor: '#808080',
                  borderTopWidth: 0,
                  borderRadius: 3,
                }}
                fColor={this.state.fontColor}
                bgColor={this.state.bgColor}
                text="下一章"
                fontSize={this.state.fontSizeStyle.contentFontSize}
                size={this.state.fontSizeStyle.contentFontSize}
                onPress={this.onNextChapterClick}
              />
            </View>
            <Line color="#fff" size={1} />
            <View
              style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: this.state.bgColor,
              }}>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  left: 0,
                  position: 'absolute',
                  marginLeft: 10,
                  color: this.state.fontColor,
                }}
                onPress={this.openSlider}>
                目录
              </Text>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  right: 0,
                  position: 'absolute',
                  marginRight:
                    (screenW - 2 * this.state.fontSizeStyle.contentFontSize) /
                    2,
                  color: this.state.fontColor,
                }}
                onPress={() =>
                  this.setState({setVisible: true, modalVisible: false})
                }>
                设置
              </Text>
              <Text
                style={{
                  fontSize: this.state.fontSizeStyle.contentFontSize,
                  right: 0,
                  position: 'absolute',
                  marginRight: 10,
                  color: this.state.fontColor,
                }}
                onPress={this.onDayModeClick}>
                {this.state.isNight ? '白天' : '夜间'}
              </Text>
            </View>
          </View>
        </Modal>
        <NavigtionBar
          leftButton={
            <TouchableOpacity style={{padding: 12}} onPress={this.back}>
              <Entypo
                style={styles.chapterAddFont}
                name={'chevron-thin-left'}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          }
          navBar={{
            backgroundColor: this.state.bgColor,
          }}
          title={this.state.title}
          titleStyle={{color: this.state.fontColor}}
          statusBar={{
            backgroundColor: this.state.bgColor,
          }}
        />

        <ScrollView
          style={{
            backgroundColor: this.state.bgColor,
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
                    color: this.state.fontColor,
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
