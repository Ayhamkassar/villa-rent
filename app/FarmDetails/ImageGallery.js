import { API_URL } from '@/server/config';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ImageGallery({ farm }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!farm?.images?.length) return null;

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {farm.images.map((imgUri, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedImage(`${API_URL}/api/images/${imgUri}`)}>
            <Image source={{ uri: `${API_URL}/api/images/${imgUri}` }} style={{ width: 300, height: 200, borderRadius: 20, marginRight: 15 }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedImage} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }} onPress={() => setSelectedImage(null)}>
            <Text style={{ fontSize: 28, color: '#fff' }}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', resizeMode: 'contain' }} />
        </View>
      </Modal>
    </>
  );
}
