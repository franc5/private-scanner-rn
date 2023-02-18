import React from 'react';
import { NativeModules, StyleSheet, Text, View } from 'react-native';

// TODO - Remove these lines, they are just here to test our native module
console.log("NativeModules.ImageProcessingModule", NativeModules.ImageProcessingModule);
console.log("NativeModules.ImageProcessingModule.sayHello", NativeModules.ImageProcessingModule.sayHello());

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
