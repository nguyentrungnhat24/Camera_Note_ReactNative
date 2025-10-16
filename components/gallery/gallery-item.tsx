// filepath: /home/trungnhat24/Documents/camera-notes/components/gallery/PhotoItem.tsx
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PhotoNote } from '../../services/storage';
import { ThemedText } from '../themed-text';

interface PhotoItemProps {
  item: PhotoNote;
  onPress: (note: PhotoNote) => void;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 36) / 2; // 2 columns with padding

export default function PhotoItem({ item, onPress }: PhotoItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.image} />
      {item.caption ? (
        <View style={styles.captionContainer}>
          <ThemedText numberOfLines={2} style={styles.caption}>
            {item.caption}
          </ThemedText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: COLUMN_WIDTH,
    margin: 6,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: COLUMN_WIDTH,
    resizeMode: 'cover',
  },
  captionContainer: {
    padding: 8,
  },
  caption: {
    fontSize: 14,
  },
});