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
 * Created by I329995 on 06/04/2018.
 */
public class GmailLoginDialogFragment extends DialogFragment{
    public static String gmailPassword;
    private EditText ePassword;

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();

        builder.setView(inflater.inflate(R.layout.dialog_gmail_signin, null))
                // Add action buttons
                .setPositiveButton("Sign in", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        Dialog dialogObj = Dialog.class.cast(dialog);
                        ePassword = (EditText) dialogObj.findViewById(R.id.password);
                        gmailPassword = ePassword.getText().toString();
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        moduleEdit.putString("GmailPassword", gmailPassword);
                        moduleEdit.apply();
                    }
                })
                .setNegativeButton("Cancel", null);
        return builder.create();
    }
}
