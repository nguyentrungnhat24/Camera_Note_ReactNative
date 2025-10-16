// filepath: /home/trungnhat24/Documents/camera-notes/components/gallery/PhotoGrid.tsx
import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { PhotoNote } from '../../services/storage';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import PhotoItem from './gallery-item';

interface PhotoGridProps {
  photos: PhotoNote[];
  refreshing: boolean;
  onRefresh: () => void;
  onPhotoPress: (note: PhotoNote) => void;
}

export default function PhotoGrid({ photos, refreshing, onRefresh, onPhotoPress }: PhotoGridProps) {
  const accentColor = useThemeColor({}, 'tint');

  if (photos.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No photos yet. Tap the camera tab to capture your first photo!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => <PhotoItem item={item} onPress={onPhotoPress} />}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor={accentColor}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
});