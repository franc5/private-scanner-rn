import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import ImageProcessingModule from './ImageProcessingModule';

interface Props {
  photoPath: string;
}

export default function SheetCornersPicker({photoPath}: Props) {
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
