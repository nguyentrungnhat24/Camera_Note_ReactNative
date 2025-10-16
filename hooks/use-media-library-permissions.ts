// filepath: /home/trungnhat24/Documents/camera-notes/components/camera/CameraView.tsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../themed-view';
import ThemedText from '../themed-text';
import { useThemeColor } from '../../hooks/use-theme-color';

interface CameraViewProps {
  onCapture: (uri: string) => void;
}

export default function CameraView({ onCapture }: CameraViewProps) {
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const accentColor = useThemeColor('tint');

  const toggleCameraType = () => {
    setType(current => current === CameraType.back ? CameraType.front : CameraType.back);
  };

  const toggleFlash = () => {
    setFlash(current => 
      current === Camera.Constants.FlashMode.off 
        ? Camera.Constants.FlashMode.on 
        : Camera.Constants.FlashMode.off
    );
  };

  const takePicture = async () => {
    if (cameraRef.current && !capturing) {
      try {
        setCapturing(true);
        const photo = await cameraRef.current.takePictureAsync();
        onCapture(photo.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      } finally {
        setCapturing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flash}
      >
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
            <Ionicons 
              name={flash === Camera.Constants.FlashMode.on ? 'flash' : 'flash-off'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={takePicture} 
            style={[styles.captureButton, capturing && styles.disabledButton]}
            disabled={capturing}
          >
            {capturing ? (
              <ActivityIndicator color={accentColor} size="large" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleCameraType} style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  disabledButton: {
    opacity: 0.7,
  },
});