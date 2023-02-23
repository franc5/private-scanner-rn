import React, { useRef } from 'react';
import { Animated, PanResponder, PanResponderGestureState, View } from 'react-native';

interface Props {
  defaultX: number,
  defaultY: number,
  onChange(x: number, y: number): void,
}

export default function CornerIndicator({defaultX, defaultY, onChange}: Props) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, {moveX, moveY}: PanResponderGestureState) => {
        pan.extractOffset();
        onChange(
          Math.round(moveX),
          Math.round(moveY),
        );
      },
    }),
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{translateX: pan.x}, {translateY: pan.y}],
      }}
      {...panResponder.panHandlers}
    >
      <View style={{
        width: 32,
        height: 32,
        top: defaultY,
        left: defaultX,
        borderRadius: 16,
        position: 'absolute',
        backgroundColor: '#1e88e588',
      }} />
    </Animated.View>
  );
}
