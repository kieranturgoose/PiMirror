# Blog: PiMirror

**By Kieran Turgoose**

## My First Blog Entry - Introduction to PiMirror - 10/10/2017

This blog has been created with the intention of showing the process behind the design and development of my CA400 Final Year Project: PiMirror.

PiMirror is a smart mirror deployed on a raspberry pi, that holds facial recognition functionality for its users; and an accompanying Android application. The main goal for the mirror itself is to have an interface of widgets/modules - some supplied by a 3rd party, and some built from scratch by myself - which each user can configure to their own preference. Therefore, when a user stands infront of the mirror, the interface display will alter depending on which user is recognised by the facial recognition software. 

The accompanying app allows the user to login via their Google account, and edit the configuration of their modules from the app so that on their next use of the mirror, their personalised interface will be saved. 

Upon meeting with Dr. Suzanne Little for the first time on the 2nd October 2017, she gratiously accepted the role as my supervisor for this project; and during this first meeting we discussed some of the potential for this project. 

Potential modules were discussed with ideas such as: Weather reports, scrolling news feeds, Dublin Bus/Luas timetable integration, GoogleMaps integration to show journey times in the morning, Calendar/Gmail integration, etc.. 
Alternative methods of controlling the mirror were also discussed, such as: Voice Recognition, or Gesture recognition. But both of these were seen as added extras that would only be considered if facial recognition seemed unfeasible or was completed with plenty of time to spare as they were not in the original plan. Although, they could be seen as potential for where this product could lead in the future outside of the scope of this CA400 module.


## Second Blog Entry - First Steps - 30/10/2017

Having done a fair bit of research into the project over the summer and since the first meeting with Suzanne, I decided upon my first tasks for the project. Having previous experience using OpenCV with Python for some basic image processing I decided to use this again for this project, having researched that facial recognition was possible using these technologies. My first step was to install OpenCV onto the Raspberry Pi model 3. I chose to do this first as I knew - from first hand experience, and also from Suzanne's warnings - that installing and building OpenCV can be quite a painful experience. Luckily I got through it this time with only minor issues. I also managed to successfully install and boot the MagicMirror 3rd party that I would be using to host the modules. This was a pretty pain-free and easy installation.

I continued researching any similar material online in an attempt to further expand my ideas for the project, and also booked my first official meeting with Suzanne for the 9th November 2017. 


## Third Blog Entry - Functional Specification - 28/11/2017

After my meeting with Suzanne earlier this month, we determined that the installations and planning were sufficient progress and that I should focus on the functional spec deliverable that was due on the 24th. 

The writing of the functional spec was a very good exercise for me as it fully laid out just how much work was involved in this project and how much time I could assign for each task. Below you can see the GANNT chart that was made for this, with a initial estimated timespan of how the project timeline should look.

![images](docs/blog/images/GANTTpart1.png)
![images](docs/blog/images/GANTTpart2.png)

-> For some reason these images wont display properly but are in the images folder to view or at the following link: "https://app.smartsheet.com/b/publish?EQBCT=1f5dc52b00f14f3e8769883f38bc8555"


It also allowed me to closer think of the design of the android application itself, something which I hadn't previously thought too much detail about. I knew the functionality I wanted, but not quite the design and layout. 
In order to rectify this I built some basic prototype screens for the app, which I will show below. These showed that the main app page would be a list of the modules and positions that they could be placed on the mirror, in a list view format. 

![images](docs/blog/images/HomeScreen.PNG)
![images](docs/blog/images/Widgets.PNG)
![images](docs/blog/images/Settings.PNG)


I also planned how to connect the Pi and the android app, and whether some sort of web service would be required. However, from some research and after discussion with Suzanne, I decided that due to how lightweight the functionality of the connection would be - i.e Turning the mirror on/off, and changing a user's configuration - that using an SSH connection would be the most beneficial and straightforward way to perform these functions.


## Fourth Blog Entry - Christmas/New Year Period - 30/01/2018

Over the christmas and new year period I completed some goals for the project but ultimately - due to a few technical issues, and the fact that study and participation in Semester One exams took up a large chunk of my time - I didn't complete quite as much as I had initially hoped. 

### OpenCV version issues

Despite having OpenCV installed and built on my raspberry pi successfully, when I started to develop the facial recognition code I ran into problems that derailed me for roughly a week. Unfortunately, the version I had been working on up to that point was not able to use the necessary library and so I had to reinstall and rebuild a newer version of the software. For some reason, which still is unclear the building process would repeatedly stall on 100% and not complete fully. After a few days of troubleshooting similar issues online and making no progress, I eventually made the decision to completely re-image the raspberry pi OS. This thankfully solved the issue. 

### OpenCV and Python code

Before re-imaging the Pi OS I had managed to develop some basic code using Python and OpenCV which captured when movement was detected, and drew a bounding box around movement. The next step of this was to detect a face rather than just generic movement. This was shelved until after the re-imaging issue, but was eventually completed. This was done using an xml file within OpenCV that is used to detect the facial features, and then once detected a drew the bounding box around the face and labelled appropriately.

The next step was to be able to recognise the detected face. This used the Local Binary Pattern Histograms (LBPH) method. This method is a simple but pretty effective method of facial recognition. Its process labels the pixels of an image by thresholding the neighbourhood of each pixel and considers the result as a binary number. This is useful for mapping the facial features of a person. Using the face module in OpenCV - the one which forced me to re-install the newer version - I was able to build a simple facial recognition system fairly easily. At this stage it is certainly not perfect, the accuracy of the recognition is tempermental at best; but i'm hoping by providing more (and better) pictures of subjects this will improve, as well as changing the code and the thresholds to test which values are best for running most accurately. 

At present, the training of the data is all done in the same file as the video capture, which means that each run takes roughly 2 minutes to start-up. This is obviously an issue and will need to changed, especially as more and more pictures are added to the training model. My plan is to make the training python code into it's own seperate file and train it on Windows using my laptop, and then once trained export an XML file onto the pi which will be used in the video capture python file. 

At this stage I am relatively happy with the progress with this section, although alot of work is still required in order to get the accuracy high enough for it to be considered reliable. My lack of profiency in Python coding itself isn't holding me back too much. I had only slight, self-taught, knowledge of python going into this project - with my main language being Java - but this additional learning challenge has actually been quite fun. Being object-oriented means that it isn't too difficult to get to grips with but there's still limitations to my knowledge at present. 

![images](docs/blog/images/FaceID.jpg)

### Android Application

I made some small starts on the Android Application also over this period. I have not previously developed in Android before, but - being Java-based - I don't see this being a major issue. Also, I have been told by other students within the course that Android Studio itself has recently been updated so it is far more stable to work with now, which can only be good for me. 

As of present I have only the basic shell of the app developed, I created the pages that I think I need for the final product: A login screen, a module-selector/home screen, and then a button in the top-right corner that extends to a options menu on-click. These screens don't have functionality as of now but have helped me to further seperate what is needed in each screen.

### Supervisor Meeting

I have an upcoming meeting with Suzanne on the 6th February, where I hope to get good feedback on the current progress of my project. I also want clarification on which part of the project I should focus on for the next period; whether I should try to get the facial-recognition prefected first, or focus on getting the app fully developed so that the product is at the very least functional from this standpoint. My thinking is the latter. 

## Fifth Blog Entry - Android App Development - 28/02/2018

### First Supervisor Meeting - 6/02/2018

After my last blog post I had my supervisor meeting and clarified the points discussed at the end of my previous post. Suzanne agreed that getting the application fully functional was the best next step to take. The plan was that by the next meeting in 3 weeks (27th) I should have at least the basic functionality of the app completed, i.e have the app connect to the Pi, Google login complete, and have the modules list up and selectable. 

### Android App Progress

During this month I have completed the app development that was discussed in the first meeting, for the most part. The Google login, was relatively easy to implement as there is such high-level documentation for this functionality.

Connecting to the pi using SSH involved some more research however. I was able to find a class called "JSch" - Java Secure Channel - which allowed this functionality. An external jar was needed to implement this. 
Using a mixture of this class, and the SharedPreferences class in Android I was able to store and save the user's Pi IP address and password needed for an SSH connection - provided by the user in the app - and then pull this from the SharedPreferences when having to connect via SSH to perfrom functionality. 

In order to make the home screen whereby the modules were viewable and selectable by the user, I chose to use and expandable list view. The thinking behind this was that each position could be shown (e.g Top Left, Bottom Right) in a list format, and upon click, each of these would be expandable to show the list of available modules to select within it. 
Implementing the design of this was pretty straight-forward, creating the expandable list view and filling it with the positions and placeholder module names. The next step is to make the modules selectable within the list itself.

I chose to format it this way (Position Name with the module list nested within) because, technically, the user can have the same module twice on the same interface in two seperate positions if they so want. However, they cannot have two modules in the same position. Therefore, making the main list the positions limits the number of modules in each position to 1 without any additional coding checks which would have been far more time consuming.

### Config file Issues 

The main reason why I was unable to make the modules selectable by the next meeting was because of an issue that arose on the pi itself. While my logic of changing the modules through SSH seemed simple enough in theory, further research developed issues for me. For the mirror to start, it reads the module names and positions from a config file on the pi. Therefore, I had not completely thought through how this would be editable for multiple users. There was the potential for implementing a String variable for the username which would be pulled from the pi to select the user; this would allow the config file to have multiple different configurations through 'if' statements using the username. e.g if(user == user1) -> run this config; else if(user == user2) -> run this one. 

The problem with this was that the way the file would be edited using SSH would mean that any module name changed would be changed throughout the file, not just for the correct user. This led me to look into the possiblility of multiple different config files. I went though the configurations of the MagicMirror software to find where the config file was run. Eventually, I found it and realised I could just change the filename here through the SSH, and so each user would have their own individual config file that could be edited properly. This was an unfortunate time-consuming issue. However, it was essential to be placated before any further progress was made. 

### Second Supervisor Meeting - 27/02/2018

During this meeting I discussed the progress made on the app and the issue I managed to solve with the config files on the pi. We agreed that by the next meeting in 2 weeks, I should have the app fully implemented in terms of functionality.

She also suggested that, in regards to my facial recognition, that I should try to alter the box that is drawn around the detected face, so that only faces within say, 1 meter, are detected and not faces in the background. This would be because the main focus of the mirror would be to be used as a normal mirror, which means standing directly infront for the most part. Therefore, extra background faces are not needed to be detected. She also suggested I try to improve the accuracy of the facial-recognition if possible by the next meeting.

## Sixth Blog Entry - App Redesign/ FR Speed Improvements - 15/03/2018

### Changes to Android Design (Spinners/Clickable buttons)

During these last two weeks I have undergone a complete redesign on the main app screen (module selector). Unfortunately, I discovered during my research and attempted development of making the nested modules in the expandable list view selectable, that this was not possible - or at least was potentially doable but far too convoluted and time-consuming. This led me to use a different layout than originally planned, although one that is similar to my initial prototype plan.

I began using "Spinners" which are essentially dropdown menus, that contained the module choices; along with a text field and checkbox beside each spinner to state the position it related to, and the ability to toggle off the modules at each position if the user did not want any module present there. I also created a save button which would be used to save the state of the module hashmap and send the configuration to the Pi, and a cancel button which would refresh the page to it's last saved state - although this cancel functionality is not working as of yet, as I have not figured out how to store the state of the hashmap.

![images](docs/blog/images/ListViewLayout.PNG)

### Finishing Android Functionality

I finished the main functionality of the android app this week, i.e making the modules selectable and sendable to the pi in the correct format to the user's config file; and turning the mirror on/off manually from the app. The only steps left are to implement the saved state feature for the modules, and ensuring that the mirror turn on/off is dependant on if a user is already using the mirror or not. 

### Facial Recognition improvements (Port to Windows, Confidence score)

Although the majority of my time this last fortnight was spent working on the android app, I did manage to fix some issues with the facial recognition and improve performance. I refactored the code, which was previously all in one file (that trained the images and ran the camera each time), so that the training of the images was now in a seperate file that exported an xml file that is now used as an input to the main camera run file. This means that the training can now also be done on my laptop, and only needs to be done once before exporting to the pi. This drastically improves startup/runtime performance of the program. 

I also added a confidence score to the facial recognition so that the when a face was detected it was only shown as being identified as a user's face if the confidence score was better than the threshold I set. This improved the stability and reliability of the FR quite a bit, although improvements are still needed.

### Supervisor Meeting - 13/03/2018

During this meeting I showed Suzanne the completed module select layout on the app. She was pleased with this but also asked the question: "If there was no limitations to designing this, what would your ideal UI look like?". For some reason, someone else asking me this question made me think in a totally different direction, that the app screen should be the same grid layout as the Mirror itself would be. Where each position on the screen represents the mirror position and the modules are selectable this way. We agreed this would be more intuitive to use and so I will be looking into this, even just to gauge reaction from my fellow students as to their preference. 

Improvements on facial recognition are still needed but this is going to be pretty continual through the next few weeks I imagine. She was also pleased with the refactored code so that the training is now done on Windows as previously mentioned. 

For the next meeting in 2 weeks, Suzanne is looking for further facial recognition improvements, and to start some development into my own modules for the mirror. For the app, I need to find out how to save the state of the HashMaps I use for the modules shown on screen, this way when the user saves and exits the app, their current mirror configuration will be shown on start-up. 
I also have a group of 3 people who have agreed to conduct UI reviews/testing for me, so I hope to let them give me feedback on my current UI and the potential grid layout UI too.

## Seventh Blog Entry - Major Android rehaul & module dev progress- 28/03/2018

### UI Reviews

Considering last week's meeting with Suzanne, I drafted up a grid layout for my module selector page. This layout was a basic draft frame of what the grid layout would look like and so I asked the reviewers to take into consideration when reviewing the UI's that the list view was far more polished and fleshed out and to try and review based solely on the intuitiveness of the UI and the preference of list vs grid; rather than cosmetic looks. I also asked the reviewers to not take into consideration the additional buttons such as save.

Upon providing the user's with the two seperate layouts (both loaded onto my phone as two seperate apps), all three users agreed that the grid layout was far more intuitive for selecting the modules. Two of them commented that it was much better in allowing easier visualisation of what the mirror itself would look like, something that was quite difficult in the list view in comparison. One of the reviewers (who is very keen on design and graphics) did note that he preferred the actual look of the list over the grid, but conceded that it was clearly the more polished version so it is hard to properly judge. 

These reviews allowed me to make the decision to go ahead with the grid layout and apply the previously complete functionality to this new design. However, one thing to keep in consideration is that currently it isn't as aesthetically pleasing and so this is something that potentially needs addressing. Although, for the time being, considering the nature of this project, intuitiveness and ease-of-use is far more important in my mind. 

The two images below are representative of the apps shown to the reviewers.

![images](docs/blog/images/ListViewLayout.PNG)
![images](docs/blog/images/GridPlain.PNG)

### New Grid Layout

Before conducting major development on this layout I drew up a draft to show to the UI reviewers, and following their feedback decided to go ahead with using the grid layout as my primary layout. Before 100% confirming this I will get Suzanne's feedback also at my meeting on the 27th. 

Most of the functionality was transferrable straight from one layout to another, although now that the clickable toggle buttons were no longer available in this grid layout, I decided to introduce a "blank" module at the top of the module list, which the user will select if they do not wish to have a module in this position. I also had to change the save and cancel buttons. The cancel button was now surplus to requirements due to how the saved hashmaps were implemented (more on that later). I also have a decision to make with regard to the layout which will need further reviews to be undertaken. 

There are, in my mind, two potential ways to integrate the save button in this new layout. The first is shown below, whereby the save button is along the bottom of the screen in some capacity (TBD), but is similar to the previous list layout. This will mean that the grid itself is unable to occupy the full size of the screen.

![images](docs/blog/images/GridwSaveButton.PNG)

The second option is that the grid layout takes up the full screen and the save button is located within the options menu in the top-right. This may make the main screen potentially look better, but has the downside of the save button being an extra click/tap away for the user, and also not as intuitive as to where the function is on first glance.

![images](docs/blog/images/GridPlain.PNG)
![images](docs/blog/images/GridPlainOptionsMenu.PNG)

Upon further development with regards to the modules of the smart mirror, I learned something I had previously overlooked through lack of thorough testing. The software is unable to place modules along the middle "row" of the mirror. I knew this about the absolute center square of the grid, but the left-centre and right-centre squares were ones where I thought I would be able to place modules. I may have been able to "fix" this with custom css implementations, however after discussing it with Suzanne we agreed that it wasn't a major problem, especially as most users using a mirror would not want the view of the center of the mirror hidden behind modules. Therefore, the grid was changed to a 3x2 layout, so that only the top and bottom thirds would be selectable for module placement.

### Saving Hashmaps

During this period I was able to get the hashmap state saved (finally). This was done using the same class I had previously used for storing the SSH id and password. I struggled to realise this because under the listed methods for this class there were set methods for Strings, Integers, etc.. but nothing for HashMaps. After quite a bit of research I was able to find that a method called "serializable()" allows the storing of objects such as HashMaps. Once this was discovered, the implementation side of things was pretty straight-forward.

To do this, I have one HashMap for the saved state, and another that is changed whenever the user edits the modules on screen. When the user hits save, the saved state HashMap is overridden by the second map. If the user leaves the page/closes the app without hitting save, the saved state has not been overridden and therefore the list displayed upon re-opening the app is that of the previously saved state. This is why the cancel button was no longer required, as refreshing the page/leaving the page/closing the app automatically restores the saved configuration. This means the cancel buttons functionality is moot at this stage.

After implementing this I was left with figuring out how to allow this for multiple users. In other words, when the state was saved, if I were to logout and login as another email address, the configuration would not have changed. This is necessary for users who have multiple email addresses, or even perhaps parents who want to control their child's configuration for them. To implement this I had to change how I instantiated the shared preferences 'onCreate'. When using the 'getSharedPreferences' method I was able to add a paremeter that linked the preferences to the userName given (their email address). This means everytime the state is saved it is only mapped to that specific user's preferences. 

I also encountered a small bug, whereby since the IP address and password were also using shared preferences to be stored, they were all being stored together. Therefore, when the hashmap was being printed in full I noticed these values were considered part of the hashmap. This led me to create a seperate 'ssh' variable for the shared preferences, in order to seperate them from the hashmaps. 

### Module Development

I finally managed to fully develop and implement a module of my own, which is used to display the emails of the user based on their email address taken from the app. It is a pretty standard module but one that was essential and nice to get out of the way. Developing this module was tough as it was new territory for me, but was not as rough as it could potentially have been. This is largely thanks to the "surprisingly" helpful developer documentation on the MagicMirror website, which goes through the standard files needed for building your own module and what each must consist of as a bare minimum. This, along with some default example modules pre-installed and online documentation of standard js/node.js syntax & methodologies were enough for me to slowly build this module by myself. 
I also developed some custom css for this module for it's size and text specifications, nothing too fancy, but something I may change to something a little more elaborate if time permits towards the back end of this project.

![images](docs/blog/images/GmailModule.PNG)

Upon first running this module, I did encounter one main error, which is outlined in detail below.

### Node_Helper loading issues

One thing I noticed when running my own modules for the first time was that they were not correctly loading the node_helper file (node.js). Therefore, the calls made in this file were not happening and so the module was not working properly. I thought this may be due to a similar error that I had previously encountered with changing the config files. When making it so each user had their own configuration file, I had to find where this file was being called for in the .js files already present on the system. While this worked for loading the config file, there was a also a second file where the node_helper files were loaded, which was still pointing to the default config file on the system. This led me to fix the problem the same way I did previously, by changing the config filepath in this file to that of the current user's config file. This fixed the issue and allowed the module to be loaded correctly.

### Facial Recognition Improvements

Since the last meeting I have added another user to my dataset of users for the facial recognition. The other user is a female, and adding this person's data did not deter from the accuracy of results for my own face when running the system. However, one potential hiccup I did notice was that the recognition for the other user did seem more consistent and stable that it did for me. One working theory I have is that my, rather unkempt, beard at this particular moment is probably not helping pick up my facial features to the system's best ability. So the next step for me is to pull out the razor and see how results compare. If I can get the system to run consistently at the level of accuracy it did for the female user, I would see that as a successful implementation that would satisfy my requirements for the use of my system.

### Supervisor Meeting - 27/03/2018

During this meeting I showed Suzanne the new saved state implementation and also the grid layout as a result of the UI reviews. I mentioned that I had a working email module on the mirror, and that I had added another user to the facial recognition with results remaining pretty consistent. 

We agreed that for the next meeting in 2 weeks, I would aim to try and get another 1 (hopefully 2) modules completed on the mirror. The last main functionality of the app should also be finished, i.e to have a popup appear when the user selects the email module so that they can enter their password. This may have to be implemented with other modules too, but once this first implementation is finished it's just a matter of changing variable contents, so will not be an issue. We also said to aim to have the facial recognition triggering the mirror to turn on with the correct user, so that the full flow of events can be seen working together. Once this is done, I aim to film some of it very roughly to show at the next meeting.

## Eigth Blog Entry - Module Dev Progress - 11/04/2018

### More UI Reviews

Upon talking to Suzanne in the previous meeting, and also referring back to the same pool of reviewers as previously documented, the conclusion on the save button was that it was better to be located at the bottom of the main screen rather than in the menu at the top-right. The main points were generally that removing an extra button click is almost always a better idea, also that the user may not immediately know about the saving functionality if it is hidden away behind a menu. So this will be implemented as the standard from this point.

I also talked with my older brother who is a product/graphic designer about these things, and further ideas for the design of the app. He was happy with the current look of the app but suggested perhaps adding some colour to the save button to ensure user's know when the configuration is saveable. i.e to highlight the button when the user makes a change, a when it is saved (so that the onscreen configuration is the same as the saved hashmap) have the button grayed out. This is certainly a good idea in my eyes, and is something I will look into more once functionality is complete as it is not absolutely essential at this stage. I will be keeping him in the loop with app design and also module css design choices in the coming month to gather extra input in terms of the aesthetic design of my project.

### News Ticker and Calendar modules

Since I already had modules for the clock and email working fully on the pi; I went ahead with developing out the Google Calendar and News Ticker modules.

The calendar module takes the user's calendar .ics filepath as input and displays on the mirror the events that are linked to their Google Calendar. The issue with using the .ics filepath is that to make it useable without any additional user inputs, the user must make their calendar public. I will put an option into the app so that the user can choose whether to do this or not. If they choose not to, then they will have to manually input their .ics filepath from their Google Calendar settings. The module when running refreshes similar to the Gmail one, so that new events added will be shown on screen after a set refresh time. 

For the news ticker module, it allows a scrolling feed of news headlines to be displayed on the mirror. The user must pick their news source to do this, which will be an option from the app. I currently have the New York Times and BBC rss feeds implemented although the BBC one is not as good as the NYT, as for some reason the headlines are not really up-to-date. This is likely just an issue with the rss feed itself so I will continue to look for others. My aim is to have one global news source (NYT), one European news source (BBC), and one local news source (RTE). But this will depend on which rss feeds I can find. 

![images](docs/blog/images/CalendarModule.PNG)
![images](docs/blog/images/NewsModule.PNG)

### Finishing phone functionality

During this period I have finished the main functionality of the application. This involved developing pop-ups when the user selected a module, so that they could enter the necessary details. This was done using Dialog Fragments. From the list of potential modules I wish to have: clock, gmail, calendar, news, weather, dublin bus, and finance; all but clock will require the user to enter some additonal information to be used fully. For example the ones currently developed are: entering your gmail password when selecting the gmail module; selecting if your calendar is private or public when using calendar, and if private - inputting your private .ics path; and selecting your news source from a choice of two (NYT/BBC) when selecting the news module. However, for the news module I aim to implement being able to select multiple choices of news source rather than just pick 1, this is still to be implemented as it consists of changing the type of dialog I create, but is not difficult to do. 

Now that I have these first few options done, building the rest is just a matter of copying those already done and changing text and input variables so that the pop-up is specific to the chosen module. But this current template allows easy development of the rest of them. 
 
When developing these pop-ups I did run into one particular issue. Due to how the dialog fragments are called - it is the part of the code that runs based on which module is selected in each position, which is run from onCreate of the main page of the app - this meant that the dialog pop-ups were being created each time the main page was loaded, whether the user had already saved a configuration or not. This was obviously an issue due to the user being bombarded with pop-ups every time the main screen of the app was loaded, despite having already inputted their information. I was able to edit this as shown below, whereby the pop-up was only created when the module selected was the correct module AND that module was not in the currently saved hashmap of modules. This allows it so the pop-up is no longer created when the user has that module already saved as their configuration, only when they attempt to add it.


Java:
```java
public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
   	if(((String) parent.getItemAtPosition(position)).equals("Gmail") && !map.containsValue("Gmail")) {
   		//Create pop-up
        confirmGmailModuleLogin(); 
    }
```

![images](docs/blog/images/PhoneImages/Calendar.png)
![images](docs/blog/images/PhoneImages/GmailPassword.png)
![images](docs/blog/images/PhoneImages/NewsSource.png)


### Python code to run script from correct recognition of user.

I edited my python code so that when the correct user is identified from the facial recognition the script to start the script is run. One problem doing this initially was that when the command to run the script was started it ran within the same process as the facial recognition, so that the camera feed and facial recognition was frozen whilst the mirror was on, and then continued to run once the mirror had been closed. To do this properly, I had to run the command within a seperate, newly created, terminal. This fixed the issue and had the python code consistantly checking the face of the user whilst the mirror was turned on. 

To allow the two seperate users to use the mirror by standing in front of it, I have to perform checks to ensure the face in front of the mirror is the correct one before starting the configuration. I did this by utilising counts so that the person standing in front of the mirror is only considered the "correct user" if there is a consistant number of results confirming one name. This prevents false startups, and also false closures so that if the result is a single false positive once amongst many true positives, the correct user will be chosen and the correct interface will be loaded. I also added functionality so that if the mirror is turned on, and then "no face" is detected for 50 concurrent predictions, then the mirror will terminate. This allows the user to just walk away from the mirror rather than have to manually turn off the mirror everytime they are finished with it.

Additionally, when a second user stands infront of an already on mirror (with a different user's configuration), once the facial recognition recognises that this is (consistantly) a different identifiable user, it will shutdown the current mirror interface, and start up again for the new user.
I have to continue to tamper with which counts allow for the best running of the mirror, making it as smooth as possible for startup, shutdown, and switching users.

### Filmed Demo

Prior to my supervisor meeting with Suzanne on the 10th April I filmed a short video that showed the following functionality running in real-time:

=> Ran the python facial recognition code and I stood in front of the camera.

=> Show it identifying the user correctly as me, and the mirror starting up.

=> Showing a second identifiable user standing infront of the camera in my place.

=> The mirror stopping and restarting with a seperate configuration for the new user.

=> The mirror stopping once the user moved away, leaving no users present in front of the camera.

=> The first user opening the app and adding the gmail module to the mirror, entering his password in the displayed pop-up.

=> The user turning on the mirror from the app, and showing the correct new configuration on the mirror.

=> The user turning off the mirror from the app.

### Supervisor Meeting - 10/04/2018

During this meeting with Suzanne I showed her the video demo outlined above, and explained each thing that I had implemented since the previous meeting. She was happy with the progress and we also discussed the option of using a token authentication rather than sending a password when the Gmail module is selected from the app. This was initially mentioned during the previous meeting, but having researched further I could not figure out an easy way of implementing this feature. Since I was using JavaScript, neither myself or Suzanne had previous experience in authenticating this way in this language, although we both knew how it was possible using python. Because of the non-trivial nature of this problem and the amount of research needed to implement it, we decided mutually that it was best to scrap the idea, at the very least until all the functionality has been completed, but more likely indefinitely.

In terms of progress for the next meeting in 2 weeks, we decided that the remaining modules are really the main and only real development left to do. So I hope to have these 3 - Weather, Dublin Bus, Finance - completed in 2 weeks time, essentially ending the development cycle. We also discussed for the finance module that it would be nice to add some additional graphics/imagery to the mirror for this module, essentially making the stock ticker and running graph that displays a certain period of activity, as the majority of the modules are only text based, with very basic graphics.


## FINAL Blog Entry - 20/05/2018

Over a month since my last blog post. The day of submission. Due to finishing implementation, studying and partaking in exams, and finalising all documentation and all other submission elements; I have been unable to keep track of blogs so much this last month. This is just a few final thoughts and updates.

Since my last documented meeting with my supervisor, I have had two more: on the 24th April, and the 3rd May. They both went well and we are confident in how the project has turned out.

I have since finished my implementation and documents and video walkthrough. Everything has been uploaded to git and is ready for the deadline.

I have finally set-up the monitor with the two-way glass and it looks better than expected honestly so I'm happy with that.

I have had a new logo, banner and poster designed for the expo and demo. All is prepared, and I am very pleased with how this project has turned out.

Just to quickly show the finished product of what the interface looks like with all modules running I will show an image below. Enjoy!

Thanks for reading!

![images](docs/blog/images/MirrorInterface.PNG)