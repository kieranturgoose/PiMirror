package com.example.i329995.pimirror;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;

/**
 * Created by I329995 on 12/04/2018.
 */

public class NewsHeadlinesDialogFragment extends DialogFragment{
    public static int newsSource;
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Pick news source")
                .setItems(R.array.news_array, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        moduleEdit.putInt("NewsSource", which);
                        moduleEdit.apply();
                    }
                });
        return builder.create();
    }


}
