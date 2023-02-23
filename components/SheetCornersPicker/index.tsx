import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { PhotoFile } from 'react-native-vision-camera';

import ImageProcessingModule from './ImageProcessingModule';

interface Props {
  photo: PhotoFile;
}

export default function SheetCornersPicker({photo}: Props) {
  const photoPath = `file://${photo.path}`;

  useEffect(() => {
    console.log("NativeModules.ImageProcessingModule.detectSheetCorners", ImageProcessingModule.detectSheetCorners(photoPath));

  }, [photoPath]);

  return (
    <View style={styles.appContainer}>
      <ImageBackground style={styles.photoPreview} source={{ uri: photoPath }} />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flexGrow: 1,
  },
  photoPreview: {
    flexGrow: 1,
  },
});
