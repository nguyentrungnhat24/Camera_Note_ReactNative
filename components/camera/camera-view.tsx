import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface CameraViewProps {
  onCapture: (uri: string) => void;
}

export default function CustomCameraView({ onCapture }: CameraViewProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const accentColor = useThemeColor({}, 'tint');
  
  const screenWidth = Dimensions.get('window').width;

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    const photo = await cameraRef.current.takePictureAsync();
    onCapture(photo.uri);
    setCapturing(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Đang kiểm tra quyền truy cập camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>Ứng dụng chưa được cấp quyền camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Cấp quyền</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Header controls */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              setFlash((prev) => prev === 'off' ? 'on' : 'off')
            }
          >
            <Ionicons
              name={flash === 'off' ? 'flash-off' : 'flash'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </SafeAreaView>
        
        {/* Footer controls */}
        <SafeAreaView style={styles.footer}>
          <View style={styles.buttonContainer}>
            {/* Flip camera */}
            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
            >
              <Ionicons name="camera-reverse" size={28} color="#fff" />
            </TouchableOpacity>
            
            {/* Capture button */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              disabled={capturing}
            >
              {capturing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            {/* Placeholder for balance */}
            <View style={styles.sideButton} />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    zIndex: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  sideButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
    padding: 12,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 40,
    padding: 4,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  btn: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});