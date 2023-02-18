package com.privatescanner;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.opencv.android.OpenCVLoader;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String sayHello() {
        if (OpenCVLoader.initDebug()) {
            return "Hello from Image Processing Native Module: OpenCV is working! =)";
        } else {
            return "Hello from Image Processing Native Module: OpenCV is not working! =(";
        }
    }
}