import React from 'react';
import { ActivityIndicator, Button, Linking, NativeModules, StyleSheet, Text, View } from 'react-native';

import useCameraPermissions from './hooks/use-camera-permissions';

// TODO - Remove these lines, they are just here to test our native module
console.log("NativeModules.ImageProcessingModule", NativeModules.ImageProcessingModule);
console.log("NativeModules.ImageProcessingModule.sayHello", NativeModules.ImageProcessingModule.sayHello());

export default function App(): JSX.Element {
  const [cameraPermission] = useCameraPermissions({ autoTriggerPermissionRequest: true });

  if (!cameraPermission || cameraPermission === "not-determined") return (
    <View style={styles.appContainer}>
      <ActivityIndicator style={styles.loadingSpinner} size="large" color="#1e88e5" />
    </View>
  );

  if (cameraPermission === "denied") return (
    <View style={styles.appContainer}>
      <Text style={styles.manuallyGrantPermissionsMessage}>
        PrivateScanner needs camera permission to work. Please, grant permission manually and reopen the app to use it.
      </Text>
      <Button title='Grant Permissions' onPress={Linking.openSettings} />
    </View>
  );

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
  loadingSpinner: {
    flexGrow: 1,
  },
  manuallyGrantPermissionsMessage: {
    flexGrow: 1,
    textAlign: 'center',
  }
});
