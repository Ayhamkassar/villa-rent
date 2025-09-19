import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function PageTransition({ children, direction = 'slide' }) {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // انيميشن الدخول
    const enterAnimation = () => {
      if (direction === 'slide') {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (direction === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      } else if (direction === 'scale') {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    enterAnimation();
  }, []);

  const getAnimatedStyle = () => {
    switch (direction) {
      case 'slide':
        return {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        };
      case 'fade':
        return {
          opacity: fadeAnim,
        };
      case 'scale':
        return {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        };
      default:
        return {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        };
    }
  };

  return (
    <Animated.View style={[{ flex: 1 }, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
}
