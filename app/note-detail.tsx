import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NoteDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Chi tiết ghi chú</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
