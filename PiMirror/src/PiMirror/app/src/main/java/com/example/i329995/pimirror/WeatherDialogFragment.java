package com.example.i329995.pimirror;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.widget.EditText;

/**
 * Created by I329995 on 14/04/2018.
 */

public class WeatherDialogFragment extends DialogFragment {
    public static String weatherLocation;
    private EditText weatherText;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        
        builder.setView(inflater.inflate(R.layout.dialog_weather, null))
                // Add action buttons
                .setPositiveButton("Save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        Dialog dialogObj = Dialog.class.cast(dialog);
                        weatherText = (EditText) dialogObj.findViewById(R.id.password);
                        weatherLocation = weatherText.getText().toString();
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        moduleEdit.putString("WeatherLocation", weatherLocation);
                        moduleEdit.apply();
                    }
                })
                .setNegativeButton("Cancel", null);
        return builder.create();
    }
}
