import React, {Component} from 'react';
import Entry from './src/entry';
import {AppRegistry} from 'react-native';
export default class fiction extends Component {
  render() {
    return <Entry />;
  }
}

AppRegistry.registerComponent('fiction', () => fiction);
