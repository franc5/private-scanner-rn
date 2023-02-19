import React, {useRef, useState} from 'react';
import { ActivityIndicator, Button, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import useCameraPermissions from './hooks/use-camera-permissions';

import SheetCornersPicker from './components/SheetCornersPicker';

export default function App(): JSX.Element {
  const cameraRef = useRef<Camera>(null);
  const [cameraPermission] = useCameraPermissions({ autoTriggerPermissionRequest: true });
  const { back: backCamera } = useCameraDevices(); // TODO: This may throw an exception -> Add Error Boundaries to the app
  const [photoPath, setPhotoPath] = useState<string>("");

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

  if (photoPath) return <SheetCornersPicker photoPath={`file://${photoPath}`} />;

  const capture = async () => {
    if (!cameraRef.current) return; // TODO: Check whether this is possible and consider what to do

    try {
      const { path } = await cameraRef.current.takePhoto({
        skipMetadata: true,
        enableAutoStabilization: true,
      });

      setPhotoPath(path);
    } catch(error) {
      // TODO: Handle this error
      console.error("Error taking photo", error);
    }
  }

  return (
    <View style={styles.appContainer}>
      <Camera
        ref={cameraRef}
        style={styles.cameraPreview}
        device={backCamera}
        isActive
        photo
      />
      <Button title='Capture' onPress={capture} />
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
