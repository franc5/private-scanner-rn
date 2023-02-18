import React from 'react';
import { ActivityIndicator, Button, Linking, NativeModules, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import useCameraPermissions from './hooks/use-camera-permissions';

// TODO - Remove these lines, they are just here to test our native module
console.log("NativeModules.ImageProcessingModule", NativeModules.ImageProcessingModule);
console.log("NativeModules.ImageProcessingModule.sayHello", NativeModules.ImageProcessingModule.sayHello());

export default function App(): JSX.Element {
  const [cameraPermission] = useCameraPermissions({ autoTriggerPermissionRequest: true });
  const { back: backCamera } = useCameraDevices(); // TODO: This may throw an exception -> Add Error Boundaries to the app

  if (
    (!cameraPermission || cameraPermission === "not-determined")
    || !backCamera
  ) return (
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
      <Camera style={styles.cameraPreview} device={backCamera} isActive />
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
  cameraPreview: {
    flexGrow: 1,
  },
  manuallyGrantPermissionsMessage: {
    flexGrow: 1,
    textAlign: 'center',
  }
});
