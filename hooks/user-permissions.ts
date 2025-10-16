// filepath: /home/trungnhat24/Documents/camera-notes/hooks/use-permissions.ts
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useCameraPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Needed',
          'Please grant camera permission to take photos',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  return hasPermission;
}

export function useMediaLibraryPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Media Library Permission Needed',
          'Please grant media library permission to save photos',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  return hasPermission;
}