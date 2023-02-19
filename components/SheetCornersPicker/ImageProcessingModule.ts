import { NativeModules } from 'react-native';

interface ImageProcessingModule {
  detectSheetCorners(photoUri: string): string;
}

export default NativeModules.ImageProcessingModule as ImageProcessingModule;
