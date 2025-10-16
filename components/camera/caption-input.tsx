// filepath: /home/trungnhat24/Documents/camera-notes/components/camera/CaptionInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { createPhotoFile, PhotoNote } from '../../services/storage';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface CaptionInputProps {
  photoUri: string;
  onSave: (note: PhotoNote) => Promise<void>;
  onCancel: () => void;
}

export default function CaptionInput({ photoUri, onSave, onCancel }: CaptionInputProps) {
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const accentColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleSave = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      
      // Create persistent copy of the photo
      const persistentUri = await createPhotoFile(photoUri);
      
      const newNote: PhotoNote = {
        id: Date.now().toString(),
        uri: persistentUri,
        caption: caption.trim(),
        createdAt: Date.now()
      };
      
      await onSave(newNote);
    } catch (error) {
      console.error('Failed to save photo:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity onPress={onCancel} style={styles.button}>
          <Ionicons name="close" size={24} color={accentColor} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Add Caption</ThemedText>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.button}
          disabled={saving}
        >
          <ThemedText 
            style={[styles.saveButton, { color: accentColor, opacity: saving ? 0.5 : 1 }]}
          >
            {saving ? 'Saving...' : 'Save'}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      <Image source={{ uri: photoUri }} style={styles.image} />
      
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Add a caption..."
        placeholderTextColor="#999"
        value={caption}
        onChangeText={setCaption}
        multiline
        autoFocus
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    padding: 5,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  input: {
    padding: 15,
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
  },
});