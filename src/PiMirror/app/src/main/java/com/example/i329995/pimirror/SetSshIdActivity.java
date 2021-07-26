package com.example.i329995.pimirror;

/**
 * Created by I329995 on 06/02/2018.
 */

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

import java.util.Properties;

public class SetSshIdActivity extends MainActivity {
    private EditText eText;
    private EditText ePassword;
    private Button btn;
    private static String ip;
    private static String password;
    private static String Success;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_ssh);

        eText = (EditText) findViewById(R.id.edittext);
        ePassword = (EditText) findViewById(R.id.editPassword);
        btn = (Button) findViewById(R.id.button);
        btn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(v == btn) {
                    ip = eText.getText().toString();
                    password = ePassword.getText().toString();

                    SharedPreferences.Editor sshEdit = ssh.edit();
                    sshEdit.putString("IP", ip);
                    sshEdit.putString("Password", password);
                    sshEdit.apply();
                    ((EditText) findViewById(R.id.edittext)).setText(ip);
                    ((EditText) findViewById(R.id.editPassword)).setText(password);
                    Thread t = new Thread(new Runnable() {
                        @Override
                        public void run() {
                            tester();
                        }
                    });
                    t.start();
                    try {
                        t.join();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    if(Success != null){
                        showMessage("Connection Successful");
                    }else{
                        showMessage("Unsuccessful");
                    }
                    finish();
                }
            }
        });
    }

    public void tester(){
        try {
            JSch jsch = new JSch();
            Session session = jsch.getSession("pi", ssh.getString("IP", "NOT WORKED"), 22);
            session.setPassword(ssh.getString("Password", "Password not correct"));
            // Avoid asking for key confirmation
            Properties prop = new Properties();
            prop.put("StrictHostKeyChecking", "no");
            session.setConfig(prop);
            session.connect();
            Success = "Connection Successfully Saved";

            Channel channelssh = session.openChannel("exec");
            channelssh.setInputStream(null);
            ((ChannelExec) channelssh).setErrStream(System.err);

            channelssh.connect();
            channelssh.disconnect();
            session.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
