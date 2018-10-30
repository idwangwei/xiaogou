package com.allere.handwrite;

import android.content.Context;
import android.util.Log;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;


/**
 * Created by pjl on 2016/12/17.
 * 手写 cordova 插件
 */
public class HandWriteRecognize extends CordovaPlugin {
    static {
        System.loadLibrary("handwrite-recognize-lib");
    }

    private static final String TAG = "HWRecognize";
    private static final String SVM_MODEL_FILE_NAME = "train.yml";
    private static final String LABEL_CHARACTER_MAP_FILE_NAME = "label_character_map.json";


    private native String recognize();

    private native String undo();

    private native String clear();

    private native String addStroke(String strokeString, String strokeId);

    private native void init(int canvasWidth, int canvasHeight, String svmModelFileAddress, String labelCharacterMapFileAddress);

    private String moveFileToFilesDir(Context activity, String fileName) {
        String modelFileAddress = activity.getFilesDir().getAbsolutePath() + "/" + fileName;
        InputStream in;
        try {
            in = activity.getAssets().open(fileName);
            byte[] modelBuffer = new byte[in.available()];
            in.read(modelBuffer);
            in.close();
            FileOutputStream modelOut = new FileOutputStream(modelFileAddress);
            modelOut.write(modelBuffer);
            modelOut.close();
        } catch (IOException e) {
            Log.e(TAG, e.getMessage());
        }
        return modelFileAddress;
    }

    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if ("recognize".equals(action)) {
            this.cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    String recognizeRes = recognize();
                    JSONObject res = new JSONObject();
                    try {
                        res.put("recognizeRes", recognizeRes);
                        callbackContext.success(res);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });
        }
        if ("undo".equals(action)) {
            String recognizeRes = undo();
            JSONObject res = new JSONObject();
            res.put("recognizeRes", recognizeRes);
            callbackContext.success(res);
        }
        if ("clear".equals(action)) {
            String recognizeRes = clear();
            JSONObject res = new JSONObject();
            res.put("recognizeRes", recognizeRes);
            callbackContext.success(res);
        }
        if ("addStroke".equals(action)) {
            String jsonPoints = args.getString(0);
            String strokeId = args.getString(1);
            String deletedIds = addStroke(jsonPoints, strokeId);
            JSONObject rt = new JSONObject();
            if (deletedIds.length() > 0) {
                String[] deletedIdList = deletedIds.split("\\|");
                JSONArray ary = new JSONArray();
                for (int i = 0; i < deletedIdList.length; i++) {
                    ary.put(deletedIdList[i]);
                }
                rt.put("deletedIdList", ary);
            }
            callbackContext.success(rt);
        }
        if ("init".equals(action)) {
            int width = Integer.parseInt((String) args.get(0));
            int height = Integer.parseInt((String) args.get(1));
            init(width, height,
                    moveFileToFilesDir(this.cordova.getActivity(), SVM_MODEL_FILE_NAME),
                    moveFileToFilesDir(this.cordova.getActivity(), LABEL_CHARACTER_MAP_FILE_NAME));
            callbackContext.success();
        }
        return true;
    }

}
