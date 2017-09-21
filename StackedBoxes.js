import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Accelerometer } from 'expo';

/* If you want more or less boxes, modify this list of colors. */
const BOX_COLORS = [
  '#b1c1d0',
  '#8aaed0',
  '#649bce',
  '#3f8bd2',
  '#3581c7',
  '#056ECF',
];

export default class StackedBoxes extends Component {
  state = {
    boxes: [],
    generatedBoxes: 0,
  };

  generateBoxes(numBoxes) {
    let boxes = [];
    for(var i = 0; i <  numBoxes; i++) {
      boxes.push({position: new Animated.ValueXY()})
    }
    return boxes;
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.boxes.length !== nextProps.numBoxes) {
      this._unsubscribeFromAccelerometer();

      this.setState({boxes: this.generateBoxes(nextProps.numBoxes)});

      this._subscribeToAccelerometer();
    }
  }

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer();
  }

  componentWillMount() {
    this.setState({boxes: this.generateBoxes(this.props.numBoxes)});
  }

  componentDidMount() {
    this._subscribeToAccelerometer();
  }

  _subscribeToAccelerometer = () => {
    this._acceleroMeterSubscription = Accelerometer.addListener(
      ({x, y}) => {
        this.state.boxes.forEach((box, idx) => {
          Animated.spring(this.state.boxes[idx].position, {
            toValue: {
              x: x.toFixed(1) * this.props.perspective * (idx + 1) / this.state.boxes.length,
              y: -y.toFixed(1) * this.props.perspective * (idx + 1) / this.state.boxes.length,
            },
            friction: 7,
          }).start();
        });
      }
    );
  };

  _unsubscribeFromAccelerometer = () => {
    this._acceleroMeterSubscription && this._acceleroMeterSubscription.remove();
    this._acceleroMeterSubscription = null;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.boxes.map((val, idx) => {
          return (
            <Animated.View
              key={idx}
              style={[
                styles.defaultBox,
                {
                  backgroundColor: BOX_COLORS[idx],
                  // opacity: (idx + 1) / BOX_COLORS.length,
                  transform: [
                    { translateX: this.state.boxes[idx].position.x },
                    { translateY: this.state.boxes[idx].position.y },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultBox: {
    position: 'absolute',
    width: 150,
    height: 150,
  },
});
