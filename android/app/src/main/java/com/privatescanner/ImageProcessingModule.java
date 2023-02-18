package com.privatescanner;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
        return "Hello from Image Processing Native Module";
    }
}