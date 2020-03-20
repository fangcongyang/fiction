import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Dimensions} from 'react-native';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineStyle: {},
    };
  }
  UNSAFE_componentWillMount() {
    let lineStyle = {};
    if (this.props.color) {
      lineStyle.backgroundColor = this.props.color;
    }
    if (this.props.orientation && this.props.orientation == 'vertical') {
      lineStyle.width = this.props.size;
      lineStyle.height = screenH;
    } else {
      lineStyle.height = this.props.size;
      lineStyle.width = screenW;
    }
    if (this.props.color) {
      this.setState({
        lineStyle: lineStyle,
      });
    }
  }
  render() {
    return <View style={this.state.lineStyle} />;
  }
}

Line.propTypes = {
  size: PropTypes.number, //宽度
  color: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']), //方向
};

export default Line;
