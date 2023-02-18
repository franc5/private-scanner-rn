import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App(): JSX.Element {
  return (
    <View style={styles.appContainer}>
      <Text>PriveteScanner</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flexGrow: 1,
  },
});
