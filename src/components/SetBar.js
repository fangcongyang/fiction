import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  setBar: {
    height: 1,
  },
  line: {
    marginLeft: 30,
    marginRight: 30,
    height: 1,
  },
  brightnessSection: {
    height: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  brightnessSlider: {
    flex: 1,
  },
  fontSection: {
    height: 1 / 2,
    display: 'flex',
  },
  fontTitleSection: {
    width: 1 / 2,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 30,
  },
  fontToolSection: {
    width: 1 / 2,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  fontCss: {
    color: '#000000',
    backgroundColor: 'transparent',
  },
});

export default class SetBar extends Component {
  constructor(props) {
    super(props);
  }
  eventClick = () => {
    this.props.onPress();
  };
  render() {
    return (
      <View
        style={{backgroundColor: this.props.currentThemeColor.backgroundColor}}
      />
    );
  }
}
