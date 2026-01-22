import React, { useRef, useState } from 'react';
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (screenWidth * 0.85 + 16));
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={screenWidth * 0.85 + 16} // تقريبًا Snap لكل صورة
        decelerationRate="fast"
      >
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Scroll Indicators */}
      <View style={styles.indicators}>
        {images.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              { opacity: idx === activeIndex ? 1 : 0.5, backgroundColor: idx === activeIndex ? '#2a9d8f' : '#fff' },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  image: {
    width: Dimensions.get('window').width * 0.85,
    height: 250,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});
