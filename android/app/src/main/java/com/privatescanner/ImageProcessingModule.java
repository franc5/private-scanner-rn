package com.privatescanner;

import android.content.ContentResolver;
import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;

import com.facebook.react.bridge.*;

import org.opencv.android.Utils;
import org.opencv.core.*;
import static org.opencv.imgproc.Imgproc.*;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Vector;

public class ImageProcessingModule extends ReactContextBaseJavaModule {
    static {
        System.loadLibrary("opencv_java4");
    }

    ImageProcessingModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ImageProcessingModule";
    }

    private MatOfPoint2f MatOfPointToMatOfPoint2f(MatOfPoint input) {
        return new MatOfPoint2f(input.toArray());
    }

    private Mat loadImage(String imageUri) throws IOException {
        final Uri uri = Uri.parse(imageUri);
        final ContentResolver resolver = Objects.requireNonNull(getCurrentActivity()).getContentResolver();

        Bitmap bitmap = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
                ? ImageDecoder.decodeBitmap(ImageDecoder.createSource(resolver, uri))
                : MediaStore.Images.Media.getBitmap(resolver, uri);
        bitmap = bitmap.copy(Bitmap.Config.RGB_565, false);

        Mat image = new Mat();
        Utils.bitmapToMat(bitmap, image);

        return image;
    }

    private MatOfPoint getLargestContour(Mat input) {
        List<MatOfPoint> contours = new Vector<>();
        findContours(input, contours, new Mat(), RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);

        return Collections.max(contours, (c1, c2) -> {
            double perimeter1 = arcLength(MatOfPointToMatOfPoint2f(c1), true);
            double perimeter2 = arcLength(MatOfPointToMatOfPoint2f(c2), true);
            return Double.compare(perimeter1, perimeter2);
        });
    }

    private MatOfPoint getCurveConvexHull(MatOfPoint curve) {
        MatOfInt hullPointIdxs = new MatOfInt();
        convexHull(curve, hullPointIdxs);

        final Point[] curvePoints = curve.toArray();
        final List<Point> hullPoints = new Vector<>();
        hullPointIdxs.toList().forEach(idx -> hullPoints.add(curvePoints[idx]));

        MatOfPoint hull = new MatOfPoint();
        hull.fromList(hullPoints);
        return hull;
    }

    private MatOfPoint2f getSheetCorners(MatOfPoint curve, int maxIterations) {
        if (curve.rows() < 4) throw new Error("Invalid curve");
        if (curve.rows() == 4) return MatOfPointToMatOfPoint2f(curve);

        int iterations = 0;
        MatOfPoint hull = getCurveConvexHull(curve);
        if (hull.rows() == 4) return MatOfPointToMatOfPoint2f(hull);

        MatOfPoint2f hull2f = MatOfPointToMatOfPoint2f(hull);
        MatOfPoint2f approximatedCurve = new MatOfPoint2f();
        double epsilon = 0.02 * arcLength(hull2f, true);

        while (approximatedCurve.rows() != 4 && iterations < maxIterations) {
            approxPolyDP(hull2f, approximatedCurve, epsilon, true);
            if (approximatedCurve.rows() < 4) epsilon *= 0.8;
            else epsilon *= 1.2;
            iterations++;
        }

        if (approximatedCurve.rows() != 4) throw new Error("Cannot approximate curve");

        return approximatedCurve;
    }

    // TODO: Avoid blocking methods
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String detectSheetCorners(String photoUri) throws IOException {
        Mat original = loadImage(photoUri);

        // Resize original image to detect corners quicker. It does not affect quality
        final double scaleFactor = 1 / 0.3;
        Mat img = new Mat();
        resize(original, img, new Size(), 1 / scaleFactor, 1 / scaleFactor);

        // TODO: Investigate a way to automatically set the threshold and ratio based on the image
        Mat edges = new Mat();
        cvtColor(img, edges, COLOR_RGBA2GRAY);
        Canny(edges, edges, 200, 2 * 200);

        MatOfPoint sheetContour = getLargestContour(edges);
        Point[] sheetCorners = getSheetCorners(sheetContour, 25).toArray();
        // TODO: Sort corners from top-left to bottom-right

        // TODO: Return a proper object
        return ""
                + (int) sheetCorners[0].x * scaleFactor + "," + (int) sheetCorners[0].y * scaleFactor + ";"
                + (int) sheetCorners[1].x * scaleFactor + "," + (int) sheetCorners[1].y * scaleFactor + ";"
                + (int) sheetCorners[2].x * scaleFactor + "," + (int) sheetCorners[2].y * scaleFactor + ";"
                + (int) sheetCorners[3].x * scaleFactor + "," + (int) sheetCorners[3].y * scaleFactor;
    }
}