import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, PanGestureHandler, State } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function InteractiveTransitions({ 
  children, 
  onSwipeBack,
  animationType = 'slideInRight',
  duration = 300 
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // انيميشن الدخول
    const enterAnimation = () => {
      switch (animationType) {
        case 'slideInRight':
          translateX.setValue(screenWidth);
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ]).start();
          break;
        
        case 'slideInLeft':
          translateX.setValue(-screenWidth);
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ]).start();
          break;
        
        case 'fadeIn':
          opacity.setValue(0);
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }).start();
          break;
        
        case 'scaleIn':
          scale.setValue(0.8);
          opacity.setValue(0);
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ]).start();
          break;
      }
    };

    enterAnimation();
  }, [animationType, duration]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      
      if (translationX > screenWidth * 0.3 || velocityX > 500) {
        // Swipe back
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onSwipeBack) onSwipeBack();
        });
      } else {
        // Return to original position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const getAnimatedStyle = () => {
    return {
      transform: [
        { translateX },
        { scale },
      ],
      opacity,
    };
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={10}
    >
      <Animated.View style={[{ flex: 1 }, getAnimatedStyle()]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}
