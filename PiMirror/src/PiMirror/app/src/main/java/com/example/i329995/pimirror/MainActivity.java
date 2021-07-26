package com.example.i329995.pimirror;

import android.app.DialogFragment;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

import java.util.HashMap;
import java.util.Properties;

import static android.content.ContentValues.TAG;


public class MainActivity extends AppCompatActivity {
    private Spinner topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight;
    GoogleSignInClient mGoogleSignInClient = LoginActivity.getGoogleSignInClient();
    public static SharedPreferences sharedPreferences, ssh, moduleInfo;
    public HashMap<String, String> positionModuleList = new HashMap<>(9);
    public HashMap<String, String> savedHashMap = new HashMap<>(9);
    HashMap<String, String> map;
    public static String userName;
    private String gmailPassword, weatherLocation;
    private int newsSource;
    private Button button;
    MenuItem menuItem;
    String[] items = {"None","WeatherForecast", "Gmail", "GoogleCalendar", "News", "DublinBus", "Crypto"};
    String[] positions = {"top_left", "top_center", "top_right", "bottom_left", "bottom_center", "bottom_right"};
    static String[] newsSources = {"New York Times", "Sky News", "RTE"};
    static String[] stopNumbers = new String [3];
    static String[] currencies = new String[10];
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        userName = GoogleSignIn.getLastSignedInAccount(this).getEmail();
        sharedPreferences = getSharedPreferences(userName, Context.MODE_PRIVATE);
        ssh = getSharedPreferences("SSHPREFS", Context.MODE_PRIVATE);
        moduleInfo = getSharedPreferences(userName+"Modules", Context.MODE_PRIVATE);

        if(sharedPreferences != null) {
            map = (HashMap<String, String>) sharedPreferences.getAll();
            for (String s : map.keySet()) {
                String value = map.get(s);
            }
        }
        topLeft = (Spinner) findViewById(R.id.topLeft);
        topCenter = (Spinner) findViewById(R.id.topCenter);
        topRight = (Spinner) findViewById(R.id.topRight);
        bottomLeft = (Spinner) findViewById(R.id.bottomLeft);
        bottomCenter = (Spinner) findViewById(R.id.bottomCenter);
        bottomRight = (Spinner) findViewById(R.id.bottomRight);
        Spinner[] spinArray = {topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight};

        for (int i = 0; i < spinArray.length; i++) {
            createAdapters(spinArray[i], positions[i]);
        }

        //Save button
        button = (Button) findViewById(R.id.saveButton);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(v == button) {
                    saveModules();
                }
            }
        });

    }
    public void confirmGmailModuleLogin() {
        DialogFragment newFragment = new GmailLoginDialogFragment();
        newFragment.show(getFragmentManager(), "Gmail");
    }

    public void confirmCalendar(){
        DialogFragment newFragment = new GoogleCalendarDialogFragment();
        newFragment.show(getFragmentManager(), "Google Calendar");
    }

    public void confirmNewsSource(){
        DialogFragment newFragment = new NewsHeadlinesDialogFragment();
        newFragment.show(getFragmentManager(), "News Headlines");
    }

    public void confirmDublinBusStop(){
        DialogFragment newFragment = new DublinBusDialogFragment();
        newFragment.show(getFragmentManager(), "Dublin Bus Stop");
    }

    public void confirmWeatherLocation(){
        DialogFragment newFragment = new WeatherDialogFragment();
        newFragment.show(getFragmentManager(), "Weather Location");
    }

    public void confirmCryptoCurrencies(){
        DialogFragment newFragment = new CryptoDialogFragment();
        newFragment.show(getFragmentManager(), "Crypto Currencies");
    }

    //Generate all dropdowns for the main page
    public void createAdapters(Spinner name, final String modulePos){
        ArrayAdapter<String> adapter = new ArrayAdapter(this, R.layout.spinner, items);
        name.setAdapter(adapter);
        String selected = map.get(modulePos);
        if(map.get(modulePos)!=null) {
            for (int i = 0; i < items.length; i++) {
                if (selected.equals(items[i])) {
                    name.setSelection(i);
                }
            }
        }
        else {
            name.setSelection(0);
        }

        //If selected when not saved, show the extra information pop-ups
        name.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if(((String) parent.getItemAtPosition(position)).equals("Gmail") && !map.containsValue("Gmail")) {
                    confirmGmailModuleLogin();
                }
                else if(((String) parent.getItemAtPosition(position)).equals("GoogleCalendar") && !map.containsValue("GoogleCalendar")){
                    confirmCalendar();
                }
                else if(((String) parent.getItemAtPosition(position)).equals("News") && !map.containsValue("News")){
                    confirmNewsSource();
                }
                else if(((String) parent.getItemAtPosition(position)).equals("DublinBus") && !map.containsValue("DublinBus")){
                    confirmDublinBusStop();
                }
                else if(((String) parent.getItemAtPosition(position)).equals("WeatherForecast") && !map.containsValue("WeatherForecast")){
                    confirmWeatherLocation();
                }
                else if(((String) parent.getItemAtPosition(position)).equals("Crypto") && !map.containsValue("Crypto")){
                    confirmCryptoCurrencies();
                }
                positionModuleList.put(modulePos, (String) parent.getItemAtPosition(position));
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
           }
        });
    }

    //Changes position for news module only so that it doesn't overlap modules beside it
    public static String positionCheck(String position){
        if(position.equals("top_center")){
            position = "top_bar";
        }
        else if(position.equals("bottom_center")){
            position = "bottom_bar";
        }
        return position;
    }

    //Start of config file
    public static String fileStarter(){
        String preamble =
                "var config = {" +
                '\n' + '\t' + "address: \"localhost\" , port: 8080, ipWhiteList: [\"127.0.0.1\", \"::ffff:127.0.0.1\", \"::1\"], language: \"en\", timeFormat: 24, units: \"metric\", " +
                '\n' + '\t' + "modules: [ ";
        return preamble;
    }

    //End of config file
    public static String fileEnder(){
        String ending =
                "" + '\n' + '\t' + "]" +
                '\n' + "};" +
                '\n' +
                '\n' + "if(typeof module !== \"undefined\") {module.exports = config;}";
        return ending;
    }

    public static String gmailWriter(String position, String gmailPassword){
        String method =
                '\t' + "{" +
                '\n' + '\t' + '\t' + "module: \"Gmail\"," +
                '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                '\n' + '\t' + '\t' + "header: \"Gmail\"," +
                '\n' + '\t' + '\t' + "config: {" +
                '\n' + '\t' + '\t' + '\t' + "user: \"" + userName + "\"," +
                '\n' + '\t' + '\t' + '\t' + "password: \"" + gmailPassword + "\"," +
                '\n' + '\t' + '\t' + "}" +
                '\n' + '\t' + "},"
                ;

        return method;
    }

    public static String calendarWriter(String position){
        String method =
                '\t' + "{" +
                '\n' + '\t' + '\t' + "module: \"GoogleCalendar\"," +
                '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                '\n' + '\t' + '\t' + "header: \"Calendar\"," +
                '\n' + '\t' + '\t' + "config: {" +
                '\n' + '\t' + '\t' + '\t' + "url: \"" + moduleInfo.getString("CalendarICS", "NO CALENDAR SELECTED") + "\"," +
                '\n' + '\t' + '\t' + "}" +
                '\n' + '\t' + "},"
                ;

        return method;
    }

    public static String newsWriter(String position, int newsSource ){
        position = positionCheck(position);
        String title = newsSources[newsSource];
        String url = "";
        if(title.equals("New York Times")){
            url = "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml";
        }
        else if(title.equals("Sky News")){
            url = "http://feeds.skynews.com/feeds/rss/home.xml";
        }
        else if(title.equals("RTE")){
            url = "https://www.rte.ie/news/rss/news-headlines.xml";
        }
        String method =
                '\t' + "{" +
                        '\n' + '\t' + '\t' + "module: \"News\"," +
                        '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                        '\n' + '\t' + '\t' + "config: {" +
                        '\n' + '\t' + '\t' + '\t' + "feeds: [" +
                        '\n' + '\t' + '\t' + '\t' + '\t' + "{" +
                        '\n' + '\t' + '\t' + '\t' + '\t' + '\t' + "source: \"" + title + "\"," +
                        '\n' + '\t' + '\t' + '\t' + '\t' + '\t' + "url: \"" + url + "\"," +
                        '\n' + '\t' + '\t' + '\t' + '\t' + "}," +
                        '\n' + '\t' + '\t' + '\t' + "]" +
                        '\n' + '\t' + '\t' + "}" +
                        '\n' + '\t' + "},"
                ;

        return method;
    }

    public static String busWriter(String position, String [] stopNumbers){
        String stopOne = stopNumbers[0];
        String stopTwo = stopNumbers[1];
        String stopThree = stopNumbers[2];


        if(!stopOne.equals("")){
            stopOne = "" + '\n' + '\t' + '\t' + '\t' + '\t' + '\t' + "{ id: \"" + stopOne + "\" },";
        }
        if(!stopTwo.equals("")){
            stopTwo = "" + '\n' + '\t' + '\t' + '\t' + '\t' + '\t' + "{ id: \"" + stopTwo + "\" },";
        }
        if(!stopThree.equals("")){
            stopThree = "" + '\n' + '\t' + '\t' + '\t' + '\t' + '\t' + "{ id: \"" + stopThree + "\" },";
        }

        String method =
                '\t' + "{" +
                        '\n' + '\t' + '\t' + "module: \"DublinBus\"," +
                        '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                        '\n' + '\t' + '\t' + "header:  \"Dublin Bus\"," +
                        '\n' + '\t' + '\t' + "config: {" +
                        '\n' + '\t' + '\t' + '\t' + "stops: [" +
                        stopOne + stopTwo + stopThree +
                        '\n' + '\t' + '\t' + '\t' + "]" +
                        '\n' + '\t' + '\t' + "}" +
                        '\n' + '\t' + "},"
                ;

        return method;
    }

    public static String forecastWriter(String position, String weatherLocation){
        String location = weatherLocation;
        String api = moduleInfo.getString("WeatherAPI", "");
        String method =
                '\t' + "{" +
                        '\n' + '\t' + '\t' + "module: \"WeatherForecast\"," +
                        '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                        '\n' + '\t' + '\t' + "config: {" +
                        '\n' + '\t' + '\t' + '\t' + "location: \"" + location + "\"," +
                        '\n' + '\t' + '\t' + '\t' + "appid: \"" + api + "\"," +
                        '\n' + '\t' + '\t' + "}" +
                        '\n' + '\t' + "},"
                ;
        return method;
    }

    public static String getCurrencyString(String [] currencies){
        String currencyString = "\"" + currencies[0]+ "\"";
        for(int i = 1; i < CryptoDialogFragment.selectedString.size(); i++){
                currencyString = currencyString + ", " + "\"" + currencies[i] + "\"";
        }
        return currencyString;
    }

    public static String cryptoWriter(String position, String[] currencies){
        String currencyString = getCurrencyString(currencies);
        String method =
                '\t' + "{" +
                        '\n' + '\t' + '\t' + "module: \"Crypto\"," +
                        '\n' + '\t' + '\t' + "position: \"" + position +"\"," +
                        '\n' + '\t' + '\t' + "header: \"Crypto \"," +
                        '\n' + '\t' + '\t' + "config: {" +
                        '\n' + '\t' + '\t' + '\t' + "currency: [" + currencyString + "]," +
                        '\n' + '\t' + '\t' + '\t' + "displayType: \"" + moduleInfo.getString("CryptoGraphs", "NULL") + "\"" +
                        '\n' + '\t' + '\t' + "}" +
                        '\n' + '\t' + "},"
                ;

        return method;
    }

    //Calls all methods to create config file
    public String fileWriter(HashMap<String, String> positionModuleList, String userName){
        String fullFile = fileStarter();
        for(int i = 0; i < positions.length; i++){
            String moduleName = positionModuleList.get(positions[i]);
            if(positionModuleList.keySet().contains(positions[i])){
                //Gmail
                if(moduleName.equals("Gmail")){
                    String method = gmailWriter(positions[i], gmailPassword);
                    fullFile = fullFile + '\n' + method;
                }
                //GoogleCalendar
                else if(moduleName.equals("GoogleCalendar")){
                    String method = calendarWriter(positions[i]);
                    fullFile = fullFile + '\n' + method;
                }
                //News
                else if(moduleName.equals("News")){
                    String method = newsWriter(positions[i], newsSource);
                    fullFile = fullFile + '\n' + method;
                }

                //DublinBus
                else if(moduleName.equals("DublinBus")){
                    String method = busWriter(positions[i], stopNumbers);
                    fullFile = fullFile + '\n' + method;
                }
                //ForecastWeather
                else if(moduleName.equals("WeatherForecast")){
                    String method = forecastWriter(positions[i], weatherLocation);
                    fullFile = fullFile + '\n' + method;
                }
                //Crypto
                else if(moduleName.equals("Crypto")){
                    String method = cryptoWriter(positions[i], currencies);
                    fullFile = fullFile + '\n' + method;
                }
                else{
                    ;//Do nothing
                }
            }
            else{
                System.out.println("This position is not included in the moduleList: " + positions[i]);
            }


        }

        fullFile = fullFile + fileEnder();
        return fullFile;
    }

    //Used to send created file to pi via SSH
    public static void sshFileCreator(final String input, final String userName){
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSch jsch = new JSch();
                    Session session = jsch.getSession("pi", ssh.getString("IP", "IP address not found"), 22);
                    session.setPassword(ssh.getString("Password", "Password not correct"));

                    // Avoid asking for key confirmation
                    Properties prop = new Properties();
                    prop.put("StrictHostKeyChecking", "no");
                    session.setConfig(prop);
                    Log.d(TAG, "SSH Connecting");
                    session.connect();
                    Log.d(TAG, "SSH connected");

                    Channel channelssh = session.openChannel("exec");
                    ((ChannelExec) channelssh).setCommand("echo '" + input + "' > ~/MagicMirror/config/'" + userName + "'.js");
                    channelssh.setInputStream(null);
                    ((ChannelExec) channelssh).setErrStream(System.err);
                    channelssh.connect();
                    //exec here
                    channelssh.disconnect();
                    session.disconnect();
                    return;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
    }

    //Used to send command "input" to pi via SSH
    public static void sshCommand(final String input){
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSch jsch = new JSch();
                    Session session = jsch.getSession("pi", ssh.getString("IP", "IP address not found"), 22);
                    session.setPassword(ssh.getString("Password", "Password not correct"));

                    // Avoid asking for key confirmation
                    Properties prop = new Properties();
                    prop.put("StrictHostKeyChecking", "no");
                    session.setConfig(prop);
                    Log.d(TAG, "SSH Connecting");
                    session.connect();
                    Log.d(TAG, "SSH connected");

                    Channel channelssh = session.openChannel("exec");
                    ((ChannelExec) channelssh).setCommand(input);

                    channelssh.setInputStream(null);
                    ((ChannelExec) channelssh).setErrStream(System.err);

                    channelssh.connect();
                    //exec here
                    channelssh.disconnect();
                    session.disconnect();
                    //return;
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
    }

    private void signOut () {
        mGoogleSignInClient.signOut()
                .addOnCompleteListener(this, new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        Intent loginIntent = new Intent(MainActivity.this, LoginActivity.class);
                        showMessage("Signed Out");
                        startActivity(loginIntent);
                    }
                });

    }

    //Converts currencies from upper to lowercase and stores in array
    private void getCurrencies(){
        for(int i = 0; i < CryptoDialogFragment.selectedString.size(); i++) {
            String stock = moduleInfo.getString("stockNumber" + i, "");
            currencies[i] = stock.toLowerCase();
        }
    }

    //Creates the config file and sends to the pi
    private void saveModules(){
        gmailPassword = moduleInfo.getString("GmailPassword", "No password available");
        newsSource = moduleInfo.getInt("NewsSource", 0);
        weatherLocation = moduleInfo.getString("WeatherLocation", "No weather location available");
        stopNumbers[0] = moduleInfo.getString("StopNumber1", "");
        stopNumbers[1] = moduleInfo.getString("StopNumber2", "");
        stopNumbers[2] = moduleInfo.getString("StopNumber3", "");
        getCurrencies();
        final String fileName = "config"+userName;
        savedHashMap.clear();
        savedHashMap = positionModuleList;

        final String file = fileWriter(savedHashMap, userName);
        sshFileCreator(file, fileName);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        for(String s : savedHashMap.keySet()){
            editor.putString(s, savedHashMap.get(s));
        }
        editor.apply();
        editor.commit();
        showMessage("Configuration Saved");
    }

    //Turns on the PiMirror interface for account logged in on app
    private void turnOnMirror(){
        sshCommand("sed -i -e 's#config/config.*js#config/config" + userName + ".js#g' /home/pi/MagicMirror/js/app.js");
        sshCommand("sed -i -e 's#config/config.*js#config/config" + userName + ".js#g' /home/pi/MagicMirror/js/server.js");
        sshCommand("cd ~/MagicMirror; DISPLAY=:0 npm start");
        showMessage("Mirror enabled");
    }

    //Turns off the PiMirror interface
    private void turnOffMirror(){
        sshCommand("pkill -f MagicMirror");
        showMessage("Mirror disabled");
    }

    //option menu initiation
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.connect_to_pi, menu);
        inflater.inflate(R.menu.turn_on_mirror, menu);
        inflater.inflate(R.menu.turn_off_mirror, menu);
        inflater.inflate(R.menu.weather_api, menu);
        inflater.inflate(R.menu.show_graphs, menu);
        inflater.inflate(R.menu.signout, menu);
        menuItem = (MenuItem) menu.findItem(R.id.showGraphs);
        if(moduleInfo.getBoolean("ShowGraphs", true) == true)
            menuItem.setChecked(true);
        else
            menuItem.setChecked(false);

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        SharedPreferences.Editor moduleEdit = moduleInfo.edit();
        switch (item.getItemId()) {
            case R.id.connectToPi:
                startActivity(new Intent(this, SetSshIdActivity.class));
                return true;

            case R.id.turnOnMirror:
                turnOnMirror();
                return true;

            case R.id.turnOffMirror:
                turnOffMirror();
                return true;

            case R.id.weatherAPI:
                startActivity(new Intent(this, SetWeatherAPIActivity.class));
                return true;

            case R.id.showGraphs: //Enable/Disable graphs for crypto module
                if(item.isChecked()){
                    item.setChecked(false);
                    moduleEdit.putBoolean("ShowGraphs", false);
                    moduleEdit.putString("CryptoGraphs", "default");
                    moduleEdit.apply();
                }
                else{
                    item.setChecked(true);
                    moduleEdit.putBoolean("ShowGraphs", true);
                    moduleEdit.putString("CryptoGraphs", "graphs");
                    moduleEdit.apply();
                }
                return true;

            case R.id.signOut: //sign out user after finishing current activity
                finish();
                signOut();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    public void showMessage(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

}