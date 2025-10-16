// filepath: /home/trungnhat24/Documents/camera-notes/app/(tabs)/camera.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CameraView from '../../components/camera/camera-view';
import CaptionInput from '../../components/camera/caption-input';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useCameraPermission } from '../../hooks/user-permissions';
import { PhotoNote, savePhotoNote } from '../../services/storage';

export default function CameraScreen() {
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const cameraPermission = useCameraPermission();

  const handleCapture = (uri: string) => {
    setCapturedPhotoUri(uri);
  };

  const handleSave = async (note: PhotoNote) => {
    await savePhotoNote(note);
    setCapturedPhotoUri(null);
    router.replace('/');
  };

  const handleCancel = () => {
    setCapturedPhotoUri(null);
  };

  if (cameraPermission === null) {
    return (
      <ThemedView style={styles.messageContainer}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (cameraPermission === false) {
    return (
      <ThemedView style={styles.messageContainer}>
        <ThemedText style={styles.errorText}>
          Camera permission denied. Please enable camera permission in your device settings to take photos.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhotoUri ? (
        <CaptionInput 
          photoUri={capturedPhotoUri} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <CameraView onCapture={handleCapture} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
  },
});