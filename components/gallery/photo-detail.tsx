// filepath: /home/trungnhat24/Documents/camera-notes/components/gallery/PhotoDetail.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { useMediaLibraryPermission } from '../../hooks/user-permissions';
import { PhotoNote, saveToMediaLibrary } from '../../services/storage';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface PhotoDetailProps {
  note: PhotoNote;
  onUpdate: (updatedNote: PhotoNote) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export default function PhotoDetail({ note, onUpdate, onDelete, onClose }: PhotoDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(note.caption);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaLibraryPermission = useMediaLibraryPermission();

  const accentColor = useThemeColor({}, 'tint');
  const dangerColor = '#ff3b30';
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const handleEdit = () => {
    setCaption(note.caption);
    setIsEditing(true);
  };

  const handleSaveCaption = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const updatedNote = { ...note, caption: caption.trim() };
      await onUpdate(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update caption:', error);
      Alert.alert('Error', 'Failed to update caption');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(note.uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Failed to share photo:', error);
      Alert.alert('Error', 'Failed to share photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!mediaLibraryPermission || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await saveToMediaLibrary(note.uri);
      if (result) {
        Alert.alert('Success', 'Photo saved to your library');
      }
    } catch (error) {
      console.error('Failed to save to library:', error);
      Alert.alert('Error', 'Failed to save to library');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            setIsProcessing(true);
            try {
              await onDelete(note.id);
              onClose();
            } catch (error) {
              console.error('Failed to delete photo:', error);
              Alert.alert('Error', 'Failed to delete photo');
              setIsProcessing(false);
            }
          } 
        },
      ]
    );
  };

  if (isProcessing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accentColor} />
        <ThemedText style={styles.loadingText}>Processing...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={accentColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {new Date(note.createdAt).toLocaleDateString()}
        </ThemedText>
        {isEditing ? (
          <TouchableOpacity onPress={handleSaveCaption} style={styles.headerButton}>
            <ThemedText style={{ color: accentColor, fontWeight: '600' }}>Save</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
            <Ionicons name="pencil" size={22} color={accentColor} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: note.uri }} style={styles.image} />
        
        {isEditing ? (
          <TextInput
            style={[styles.captionInput, { color: textColor }]}
            value={caption}
            onChangeText={setCaption}
            multiline
            autoFocus
            placeholder="Add a caption..."
            placeholderTextColor="#999"
          />
        ) : (
          <ThemedView style={styles.captionContainer}>
            <ThemedText style={styles.caption}>
              {note.caption || "No caption"}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      {!isEditing && (
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleSaveToLibrary}
            disabled={!mediaLibraryPermission}
          >
            <Ionicons 
              name="download" 
              size={22} 
              color={mediaLibraryPermission ? accentColor : '#999'} 
            />
            <ThemedText 
              style={[styles.actionText, { 
                color: mediaLibraryPermission ? accentColor : '#999' 
              }]}
            >
              Save
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-social" size={22} color={accentColor} />
            <ThemedText style={[styles.actionText, { color: accentColor }]}>
              Share
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash" size={22} color={dangerColor} />
            <ThemedText style={[styles.actionText, { color: dangerColor }]}>
              Delete
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  captionContainer: {
    padding: 16,
  },
  caption: {
    fontSize: 16,
    lineHeight: 24,
  },
  captionInput: {
    margin: 16,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
});