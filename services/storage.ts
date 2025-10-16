// filepath: /home/trungnhat24/Documents/camera-notes/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

export interface PhotoNote {
  id: string;
  uri: string;
  caption: string;
  createdAt: number;
}

const PHOTOS_DIRECTORY = `${(FileSystem as any).documentDirectory}photos/`;

const STORAGE_KEY = '@camera_notes';

// Ensure photos directory exists
export const initializeStorage = async () => {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIRECTORY, { intermediates: true });
  }
};

export const savePhotoNote = async (photoNote: PhotoNote): Promise<void> => {
  try {
    // Get existing notes
    const existingNotes = await getAllPhotoNotes();
    
    // Add new note
    const updatedNotes = [photoNote, ...existingNotes];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Failed to save photo note:', error);
    throw error;
  }
};

export const getAllPhotoNotes = async (): Promise<PhotoNote[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Failed to get photo notes:', error);
    return [];
  }
};

export const getPhotoNoteById = async (id: string): Promise<PhotoNote | null> => {
  const notes = await getAllPhotoNotes();
  return notes.find(note => note.id === id) || null;
};

export const updatePhotoNote = async (updatedNote: PhotoNote): Promise<void> => {
  try {
    const notes = await getAllPhotoNotes();
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Failed to update photo note:', error);
    throw error;
  }
};

export const deletePhotoNote = async (id: string): Promise<void> => {
  try {
    const notes = await getAllPhotoNotes();
    const noteToDelete = notes.find(note => note.id === id);
    
    if (noteToDelete) {
      // Delete the image file
      try {
        await FileSystem.deleteAsync(noteToDelete.uri);
      } catch (fileError) {
        console.warn('Failed to delete file:', fileError);
      }
      
      // Update storage
      const updatedNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    }
  } catch (error) {
    console.error('Failed to delete photo note:', error);
    throw error;
  }
};

export const saveToMediaLibrary = async (uri: string): Promise<MediaLibrary.Asset | null> => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      console.warn('Permission to access media library not granted');
      return null;
    }

    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset;
  } catch (error) {
    console.error('Failed to save to media library:', error);
    return null;
  }
};



export const createPhotoFile = async (uri: string): Promise<string> => {
  await initializeStorage();
  const filename = `photo_${Date.now()}.jpg`;
  const newUri = `${PHOTOS_DIRECTORY}${filename}`;
  
  await FileSystem.copyAsync({
    from: uri,
    to: newUri
  });
  
  return newUri;
};