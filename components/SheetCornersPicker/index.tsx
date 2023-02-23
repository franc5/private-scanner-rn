import React, { useCallback, useEffect, useState } from 'react';
import { Button, ImageBackground, LayoutChangeEvent, StatusBar, StyleSheet, View } from 'react-native';
import { PhotoFile } from 'react-native-vision-camera';

import ImageProcessingModule from './ImageProcessingModule';

import CornerIndicator from './CornerIndicator';

interface Props {
  photo: PhotoFile;
}

type Corners = [
  topLeft: [x: number, y: number],
  topRight: [x: number, y: number],
  bottomLeft: [x: number, y: number],
  bottomRight: [x: number, y: number],
];

// TODO: Add tests
const cornerNormalizer = (photoWidth: number, photoHeight: number, containerWidth: number, containerHeight: number) => (x: number, y: number) => ({
  x: Math.round(x * containerWidth / photoWidth),
  y: Math.round(y * containerHeight / photoHeight),
});

export default function SheetCornersPicker({photo}: Props) {
  const photoPath = `file://${photo.path}`;
  const [containerSize, setContainerSize] = useState<{width: number, height: number} | undefined>();
  const [corners, setCorners] = useState<Corners | undefined>();

  useEffect(() => {
    if (!containerSize || !photoPath) return;

    // TODO: Consider moving this logic into ImageProcessingModule.ts (I do not do this now because I want to check
    //       first if it is possible to return a valid object from the native module.
    const corners = ImageProcessingModule.detectSheetCorners(photoPath)
      .split(';')
      .map(c => c
        .split(',')
        .map(v => +v)
      );

    // photo.width and photo.height values are flipped - See: https://github.com/mrousavy/react-native-vision-camera/issues/1401
    const normalizeCorner = cornerNormalizer(photo.height, photo.width, containerSize.width, containerSize.height - (StatusBar.currentHeight || 0));

    const normalizedCorners = corners.map(([x, y]) => {
      const normalizedCorner = normalizeCorner(x, y);

      return [normalizedCorner.x, normalizedCorner.y];
    }) as Corners;

    // TBD: I decided to use the normalized corners instead of the corners themselves to simplify things during this early stage
    //      of the development process. If the user does not change the default autodetected corners, the error should be pretty small.
    setCorners(normalizedCorners);
  }, [containerSize, photoPath]);

  const handleContainerSizeChange = useCallback(({ nativeEvent }: LayoutChangeEvent) => setContainerSize({
    width: Math.round(nativeEvent.layout.width),
    height: Math.round(nativeEvent.layout.height),
  }), [setContainerSize]);

  return (
    <View style={styles.appContainer}>
      <ImageBackground
        style={styles.photoPreview}
        source={{ uri: photoPath }}
        onLayout={handleContainerSizeChange}
      >
        {corners?.map(([x, y]) => <CornerIndicator
          key={`${x}${y}`}
          defaultX={x}
          defaultY={y}
          onChange={console.log} // TODO: Update corners
        />)}
      </ImageBackground>
      <Button
        title='Continue'
        onPress={console.log} // TODO: Continue by removing photo perspective based on corners
      />
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
