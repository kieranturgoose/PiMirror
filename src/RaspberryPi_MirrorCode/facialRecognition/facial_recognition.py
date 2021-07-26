import cv2
import os
from threading import Thread

# Define classifier
lbp = cv2.CascadeClassifier("/home/pi/opencv/data/lbpcascades/lbpcascade_frontalface.xml");
# Existing subject names
subjects = ["", "kieranturgoose@gmail.com", "fourthyearemail@gmail.com", "Elvis Presley", "Ramiz Raja"]
prevName = ""
faceCnt = 0
noFaceCnt = 0
changeCnt = 0

# Face detection to draw box
def detect_faces(lbp, I, scaleFactor = 1.1):
	G = cv2.cvtColor(I, cv2.COLOR_BGR2GRAY)
	faces = lbp.detectMultiScale(G, scaleFactor = scaleFactor, minNeighbors = 5)
	
	for (x, y, w, h) in faces:
		cv2.rectangle(I, (x, y), (x+w, y+h), (255, 0, 0), 2)
		cv2.putText(I, "Face", (x, y), cv2.FONT_HERSHEY_PLAIN, 1.5, (255, 0, 0), 2)
		
	return I

# Used for face recog
def predict_detect(img):
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	face_cascade = cv2.CascadeClassifier('/home/pi/opencv/data/lbpcascades/lbpcascade_frontalface.xml')
	faces = face_cascade.detectMultiScale(gray, scaleFactor = 1.2, minNeighbors = 15)
	
	if (len(faces) == 0):
		return None, None
	
	(x, y, w, h) = faces[0]
	return gray[y:y+w, x:x+h], faces[0]

# Make predictions
def predict(img):
	global name,prevName, faceCnt, noFaceCnt, changeCnt
	face, box = predict_detect(img)
	
	if face is None:
		noFaceCnt += 1
		return None
	
	face_recognizer = cv2.face.LBPHFaceRecognizer_create()
	# Load trained model
	face_recognizer.read("face_model.xml")
	label, confidence = face_recognizer.predict(face)
	name = subjects[label]
	# Draw box around predicted face
	(x, y, w, h) = box

	if confidence < 100:
		noFaceCnt = 0
		#If same person stood infront of mirror
		if name == prevName:
			faceCnt += 1
			if faceCnt > 5:
				changeCnt = 0
		else:
			#Increment change count if user is different to current "logged in" user
			changeCnt +=1
			
			#If person is different 10 consecutive times, turn off the mirror and change "logged in" user
			if changeCnt == 10:
				faceCnt = 0
				prevName = name
				changeCnt = 0
				try:
					thread = Thread(target = stop_mirror())
					thread.start()
					thread.join()
				except RuntimeError as e:
					print(e)

	# Put the predicted name
	cv2.putText(img, name, (box[0], box[1]+h+5), cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 255, 0), 2)
	
	return img    

def start_mirror():
	#Change the config/.js files to the correct user
	os.system("sed -i -e 's#config/config.*js#config/config" + name + ".js#g' /home/pi/MagicMirror/js/app.js")
	os.system("sed -i -e 's#config/config.*js#config/config" + name + ".js#g' /home/pi/MagicMirror/js/server.js")
	os.system('lxterminal -e sh ~/mm.sh')

def stop_mirror():
	os.system('pkill -f MagicMirror')

#Read from webcam
camera = cv2.VideoCapture(0)

#Initialize first frame
first = None

while True:
	#Read frames from webcam
	(grabbed, I) = camera.read()
	
	#If can't get frame
	if not grabbed:
		break
	
	G = cv2.cvtColor(I, cv2.COLOR_BGR2GRAY)
	G = cv2.GaussianBlur(G, (21, 21), 0)
	
	# If no first frame, use G as first
	if first is None:
		first = G
		continue

	# Detect faces
	faces = detect_faces(lbp, I)
	
	# Predict the first detected face
	predicted = predict(I)
	
	if faceCnt == 5:
		#Load mirror for face name
		try:
			thread = Thread(target = start_mirror())
			thread.start()
			thread.join()
		except RuntimeError as e:
			print(e)	
				
		faceCnt += 1
		noFaceCnt = 0
	elif noFaceCnt == 40:
		faceCnt = 0
		#Stop the mirror 
		try:
			thread = Thread(target = stop_mirror())
			thread.start()
			thread.join()
		except RuntimeError as e:
			print(e)

	# Show image (Demo purposes only)
	cv2.imshow("Security Feed", I)
	key = cv2.waitKey(1)
	
	if key == ord("q"):
		break

camera.release()
cv2.destroyAllWindows()
