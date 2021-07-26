package com.example.i329995.pimirror;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;

import java.util.ArrayList;

/**
 * Created by I329995 on 27/04/2018.
 */

public class CryptoDialogFragment extends DialogFragment{
    final static ArrayList<String> selectedString = new ArrayList();

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        final String [] currencies = {"Bitcoin", "Bitcoin-cash","Cardano","Eos","Ethereum","Iota","Litecoin","Neo","Ripple","Stellar"};
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        selectedString.clear();
        builder.setTitle("Pick your currencies to track")
                .setMultiChoiceItems(R.array.currencies, null,
                        new DialogInterface.OnMultiChoiceClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which,
                                                boolean isChecked) {
                                if (isChecked) {
                                    // If the user checked the item, add it to the selected items
                                    selectedString.add(currencies[which]);
                                } else if (selectedString.contains(currencies[which])) {
                                    // Else, if the item is already in the array, remove it
                                    selectedString.remove(currencies[which]);
                                }
                            }
                        })
                // Set the action buttons
                .setPositiveButton("Save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                        SharedPreferences.Editor moduleEdit = MainActivity.moduleInfo.edit();
                        for(int i = 0; i< selectedString.size(); i ++){
                            moduleEdit.putString("stockNumber"+i, selectedString.get(i));
                            moduleEdit.apply();
                        }
                    }
                })
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int id) {
                    }
                });

        return builder.create();
    }


}
