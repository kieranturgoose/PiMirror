package com.example.i329995.pimirror;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import static com.example.i329995.pimirror.MainActivity.userName;

/**
 * Created by I329995 on 06/04/2018.
 */
public class GoogleCalendarDialogFragment extends DialogFragment{
    public static String calendarICS;
    private EditText textField;
    String email = userName.substring(0, userName.lastIndexOf("@"));
    String url = "https://calendar.google.com/calendar/ical/" + email + "%40gmail.com/public/basic.ics";

    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();

        View mview = inflater.inflate(R.layout.dialog_calendar, null);
        textField = (EditText) mview.findViewById(R.id.calendarICS);
        CheckBox checkBox = (CheckBox) mview.findViewById(R.id.checkbox_public);
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if(compoundButton.isChecked()){
                    textField.setVisibility(View.GONE);
                }
                else{
                    textField.setVisibility(View.VISIBLE);
                }
            }
        });
        
                builder.setView(mview)
                // Add action buttons
                .setPositiveButton("Save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        Dialog dialogObj = Dialog.class.cast(dialog);
                        textField = (EditText) dialogObj.findViewById(R.id.calendarICS);
                        if(textField.isShown())
                            calendarICS = textField.getText().toString();
                        else{
                            calendarICS = url;
                        }
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        moduleEdit.putString("CalendarICS", calendarICS);
                        moduleEdit.apply();
                    }
                })
                .setNegativeButton("Cancel", null);
        return builder.create();
    }
}
