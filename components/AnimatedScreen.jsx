import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AnimatedScreen({ 
  children, 
  animationType = 'slideInRight',
  duration = 300,
  delay = 0 
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }).start();
    };

    startAnimation();
  }, [duration, delay]);

  const getAnimationStyle = () => {
    switch (animationType) {
      case 'slideInRight':
        return {
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'slideInLeft':
        return {
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'slideInUp':
        return {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenHeight, 0],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'slideInDown':
        return {
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenHeight, 0],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'fadeIn':
        return {
          opacity: animatedValue,
        };
      
      case 'scaleIn':
        return {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'bounceIn':
        return {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1.1, 1],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'flipInX':
        return {
          transform: [{
            rotateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['90deg', '0deg'],
            }),
          }],
          opacity: animatedValue,
        };
      
      case 'zoomIn':
        return {
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }],
          opacity: animatedValue,
        };
      
      default:
        return {
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
          opacity: animatedValue,
        };
    }
  };

  return (
    <Animated.View style={[styles.container, getAnimationStyle()]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
