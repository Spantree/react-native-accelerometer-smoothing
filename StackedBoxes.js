import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Accelerometer } from 'expo';

/* This changes the impact of the acceleromter data. Bigger number -> bigger change */
const PERSPECTIVE = 200;

/* If you want more or less boxes, modify this list of colors. */
const BOX_COLORS = [
  '#056ECF',
  '#3581c7',
  '#3f8bd2',
  '#649bce',
  '#8aaed0',
  '#b1c1d0',
];

export default class StackedBoxes extends Component {
  state = {
    positions: BOX_COLORS.map(() => new Animated.ValueXY()),
  };

  componentWillReceiveProps(props) {
  }

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer();
  }

  componentDidMount() {
    this._subscribeToAccelerometer();
  }

  _subscribeToAccelerometer = () => {
    this._acceleroMeterSubscription = Accelerometer.addListener(
      ({x, y}) => {
        this.state.positions.forEach((pos, idx) => {
          Animated.spring(this.state.positions[idx], {
            toValue: {
              x: x.toFixed(1) * PERSPECTIVE * (idx + 1) / 6,
              y: -y.toFixed(1) * PERSPECTIVE * (idx + 1) / 6,
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
        {this.state.positions.map((val, idx) => {
          return (
            <Animated.View
              key={idx}
              style={[
                styles.defaultBox,
                {
                  backgroundColor: BOX_COLORS[BOX_COLORS.length - 1 - idx],
                  opacity: (idx + 1) / BOX_COLORS.length,
                  transform: [
                    { translateX: this.state.positions[idx].x },
                    { translateY: this.state.positions[idx].y },
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
