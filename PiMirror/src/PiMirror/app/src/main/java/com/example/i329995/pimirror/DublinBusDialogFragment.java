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

public class DublinBusDialogFragment extends DialogFragment {
    public static String stopNumber1, stopNumber2, stopNumber3;
    private EditText stop1Text,stop2Text,stop3Text;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();

        builder.setView(inflater.inflate(R.layout.dialog_dublin_bus, null))
                // Add action buttons
                .setPositiveButton("Save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        Dialog dialogObj = Dialog.class.cast(dialog);
                        stop1Text = (EditText) dialogObj.findViewById(R.id.stop1);
                        stopNumber1 = stop1Text.getText().toString();
                        stop2Text = (EditText) dialogObj.findViewById(R.id.stop2);
                        stopNumber2 = stop2Text.getText().toString();
                        stop3Text = (EditText) dialogObj.findViewById(R.id.stop3);
                        stopNumber3 = stop3Text.getText().toString();
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        moduleEdit.putString("StopNumber1", stopNumber1);
                        moduleEdit.putString("StopNumber2", stopNumber2);
                        moduleEdit.putString("StopNumber3", stopNumber3);
                        moduleEdit.apply();
                    }
                })
                .setNegativeButton("Cancel", null);
        return builder.create();
    }
}
