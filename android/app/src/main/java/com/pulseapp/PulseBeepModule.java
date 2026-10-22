package com.pulseapp;

import android.media.AudioManager;
import android.media.ToneGenerator;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

/**
 * Короткий сигнал будильника через системный ToneGenerator.
 * beep("single") — один гудок, beep("double") — два.
 */
public class PulseBeepModule extends ReactContextBaseJavaModule {

    public PulseBeepModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "PulseBeep";
    }

    @ReactMethod
    public void beep(String kind) {
        final int count = "double".equals(kind) ? 2 : 1;
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    ToneGenerator tone = new ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80);
                    for (int i = 0; i < count; i++) {
                        tone.startTone(ToneGenerator.TONE_PROP_BEEP2, 250);
                        Thread.sleep(320);
                    }
                    tone.release();
                } catch (Exception e) {
                    // молча: звук не критичен
                }
            }
        }).start();
    }
}
