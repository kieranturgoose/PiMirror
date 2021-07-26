package com.example.i329995.pimirror;

/**
 * Created by I329995 on 06/02/2018.
 */

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class SetWeatherAPIActivity extends MainActivity {
    private EditText eText;
    private Button btn;
    public static String weatherAPI;
    private static String Success;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_weather_api);

        eText = (EditText) findViewById(R.id.edittext);
        btn = (Button) findViewById(R.id.button);
        btn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(v == btn) {
                    weatherAPI = eText.getText().toString();

                    SharedPreferences.Editor moduleEdit = moduleInfo.edit();
                    moduleEdit.putString("WeatherAPI", weatherAPI);
                    moduleEdit.apply();
                    ((EditText) findViewById(R.id.edittext)).setText(weatherAPI);
                    if(moduleInfo.getString("WeatherAPI", "").equals(weatherAPI)){
                        showMessage("Weather API Saved");
                    }
                    else{
                        showMessage("Save Unsuccessful");
                    }
                    finish();
                }
            }
        });
    }
}
