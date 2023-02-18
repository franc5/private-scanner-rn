import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

type Options = {
  autoTriggerPermissionRequest?: boolean;
}

export default function useCameraPermissions({autoTriggerPermissionRequest}: Options) {
  const [permission, setPermission] = useState<CameraPermissionStatus | undefined>(undefined);

  useEffect(() => {
    async function getCameraPermission() {
      try {
        const permission = await Camera.getCameraPermissionStatus();
        setPermission(permission);

        // TODO: Validate this works as expected. I'm having problems to debug this using the emulator
        if (autoTriggerPermissionRequest && permission === "not-determined") requestPermission();
      } catch(error) {
        // TODO: Handle this error
        console.error("Error getting camera permissions", error);
      }
    }

    // Check permissions the first time and register a focus listener to check it when the app gains focus
    getCameraPermission();
    AppState.addEventListener('focus', getCameraPermission);
  }, []);

  const requestPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    setPermission(permission);
  }, [setPermission]);

  return [permission, requestPermission];
}
