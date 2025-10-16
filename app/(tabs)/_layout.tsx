// filepath: /home/trungnhat24/Documents/camera-notes/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { HapticTab } from '../../components/haptic-tab';
import { useThemeColor } from '../../hooks/use-theme-color';

export default function TabLayout() {
  const iconColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: iconColor,
        tabBarStyle: { backgroundColor },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Gallery",
          headerTitle: "Camera Notes",
          tabBarIcon: ({ color }) => <Ionicons name="images" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          headerTitle: "Take Photo",
          tabBarIcon: ({ color }) => <Ionicons name="camera" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "About",
          headerTitle: "About App",
          tabBarIcon: ({ color }) => <Ionicons name="information-circle" size={24} color={color} />,
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}