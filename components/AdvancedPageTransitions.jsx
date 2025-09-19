import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AdvancedPageTransitions({ 
  children, 
  animationType = 'slideInRight',
  duration = 400,
  delay = 0,
  easing = 'easeOutCubic'
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      const config = {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      };

      // إضافة easing مخصص
      if (easing === 'bounce') {
        config.tension = 100;
        config.friction = 8;
      } else if (easing === 'elastic') {
        config.tension = 200;
        config.friction = 3;
      }

      Animated.parallel([
        Animated.timing(animatedValue, config),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: duration * 0.8,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimation();
  }, [duration, delay, easing]);

  const getAnimationStyle = () => {
    const baseStyle = { opacity: fadeValue };

    switch (animationType) {
      case 'slideInRight':
        return {
          ...baseStyle,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
        };
      
      case 'slideInLeft':
        return {
          ...baseStyle,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenWidth, 0],
            }),
          }],
        };
      
      case 'slideInUp':
        return {
          ...baseStyle,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenHeight, 0],
            }),
          }],
        };
      
      case 'slideInDown':
        return {
          ...baseStyle,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-screenHeight, 0],
            }),
          }],
        };
      
      case 'fadeIn':
        return baseStyle;
      
      case 'scaleIn':
        return {
          ...baseStyle,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }],
        };
      
      case 'bounceIn':
        return {
          ...baseStyle,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1.2, 1],
            }),
          }],
        };
      
      case 'flipInX':
        return {
          ...baseStyle,
          transform: [{
            rotateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['90deg', '0deg'],
            }),
          }],
        };
      
      case 'flipInY':
        return {
          ...baseStyle,
          transform: [{
            rotateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['90deg', '0deg'],
            }),
          }],
        };
      
      case 'zoomIn':
        return {
          ...baseStyle,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }],
        };
      
      case 'rotateIn':
        return {
          ...baseStyle,
          transform: [{
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '0deg'],
            }),
          }],
        };
      
      case 'slideInDiagonal':
        return {
          ...baseStyle,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenWidth, 0],
              }),
            },
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenHeight, 0],
              }),
            },
          ],
        };
      
      case 'elasticIn':
        return {
          ...baseStyle,
          transform: [{
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5, 0.75, 1],
              outputRange: [0, 1.1, 0.9, 1],
            }),
          }],
        };
      
      case 'cascadeIn':
        return {
          ...baseStyle,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        };
      
      case 'slideInWithFade':
        return {
          ...baseStyle,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenWidth * 0.3, 0],
              }),
            },
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        };
      
      default:
        return {
          ...baseStyle,
          transform: [{
            translateX: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [screenWidth, 0],
            }),
          }],
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
