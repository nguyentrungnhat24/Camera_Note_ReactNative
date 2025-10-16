// filepath: /home/trungnhat24/Documents/camera-notes/app/(tabs)/index.tsx
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import PhotoGrid from '../../components/gallery/gallery-grid';
import PhotoDetail from '../../components/gallery/photo-detail';
import { ThemedView } from '../../components/themed-view';
import { deletePhotoNote, getAllPhotoNotes, PhotoNote, updatePhotoNote } from '../../services/storage';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<PhotoNote[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoNote | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPhotos = async () => {
    const photoNotes = await getAllPhotoNotes();
    setPhotos(photoNotes);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const handlePhotoPress = (note: PhotoNote) => {
    setSelectedPhoto(note);
  };

  const handleUpdate = async (updatedNote: PhotoNote) => {
    await updatePhotoNote(updatedNote);
    setSelectedPhoto(updatedNote);
    await loadPhotos();
  };

  const handleDelete = async (id: string) => {
    await deletePhotoNote(id);
    await loadPhotos();
  };

  const handleCloseDetail = () => {
    setSelectedPhoto(null);
  };

  // Load photos when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      {selectedPhoto ? (
        <PhotoDetail
          note={selectedPhoto}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={handleCloseDetail}
        />
      ) : (
        <PhotoGrid
          photos={photos}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onPhotoPress={handlePhotoPress}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});