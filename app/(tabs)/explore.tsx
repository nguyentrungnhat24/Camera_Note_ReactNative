// filepath: /home/trungnhat24/Documents/camera-notes/app/(tabs)/explore.tsx
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useThemeColor } from '../../hooks/use-theme-color';

export default function ExploreScreen() {
  const accentColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.appIcon}
        />
        <ThemedText style={styles.title}>Camera Notes</ThemedText>
        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>

        <ThemedView style={styles.featureSection}>
          <ThemedText style={styles.sectionTitle}>Features</ThemedText>
          
          <ThemedView style={styles.feature}>
            <Ionicons name="camera" size={24} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>
              Take photos with your device camera
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.feature}>
            <Ionicons name="create" size={24} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>
              Add captions to remember important details
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.feature}>
            <Ionicons name="share" size={24} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>
              Share photos with friends and family
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.feature}>
            <Ionicons name="save" size={24} color={accentColor} style={styles.featureIcon} />
            <ThemedText style={styles.featureText}>
              Save photos to your device gallery
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.credits}>
          Created with React Native and Expo
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  appIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 30,
  },
  featureSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  credits: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 20,
  },
});