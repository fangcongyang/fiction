import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StatusBar, Text, StyleSheet, Platform} from 'react-native';
import MarqueeHorizontal from './MarqueeHorizontal';

const tarH = Platform.OS === 'ios' ? 44 : 50;
const StatusBarShape = {
  backgroundColor: PropTypes.string,
  barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  hidden: PropTypes.bool,
};
class NavigationBar extends Component {
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
      backgroundColor: '#f00',
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.title === nextProps.title &&
      this.props.navBar.backgroundColor === nextProps.navBar.backgroundColor &&
      this.props.hiddenStatusBar === nextProps.hiddenStatusBar
    ) {
      return false;
    }
    return true;
  }
  render() {
    let statusBar = (
      <View style={[styles.statusBar, this.props.statusBar]}>
        <StatusBar {...this.props.statusBar} hidden={this.props.hiddenStatusBar} />
      </View>
    );
    let textList = [];
    textList.push({label: 1, value: this.props.title.substr(0, 10)});
    textList.push({label: 1, value: this.props.title.substr(10)});
    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : this.props.title.length > 16 ? (
      <MarqueeHorizontal
        textList={textList}
        speed={60}
        width={250}
        direction={'left'}
        separator={0}
        reverse={false}
        bgContainerStyle={this.props.statusBar}
        textStyle={[styles.title, this.props.titleStyle]}
      />
    ) : (
      <Text style={[styles.title, this.props.titleStyle]}>
        {this.props.title}
      </Text>
    );
    let content = (
      <View style={[styles.navBar, this.props.navBar]}>
        {this.props.leftButton ? this.props.leftButton : <View style={styles.leftViewContainer}></View>}
        <View style={[styles.titleViewContainer, this.props.titleStyle]}>{titleView}</View>
        {this.props.rightButton ? this.props.rightButton : <View style={styles.rightViewContainer}></View>}
      </View>
    );
    return (
      <View style={[styles.container, this.props.styles]}>
        {statusBar}
        {content}
      </View>
    );
  }
}

NavigationBar.propTypes = {
  title: PropTypes.string,
  titleView: PropTypes.element,
  hide: PropTypes.bool,
  leftButton: PropTypes.element,
  rightButton: PropTypes.element,
  hiddenStatusBar: PropTypes.bool,
  statusBar: PropTypes.shape(StatusBarShape),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f00',
  },
  navBar: {
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    height: tarH,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leftViewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleViewContainer: {
    flex: 8,
    alignItems: 'center',
  },
  rightViewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statusBar: {
    height: 0,
  },
  title: {
    fontSize: 20,
    color: '#333',
  },
});

export default NavigationBar;
