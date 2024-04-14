import pickle
import cv2
import mediapipe as mp
import numpy as np
import base64
import sys
import time
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

isPrinted = 0

hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'SPACE', 10: 'K', 
               11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 
               21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'NEXT'}

def readb64(uri):
    # global isPrinted
    encoded_data = uri.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    # return nparr 
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # if(isPrinted < 1):
    #     isPrinted += 1
    #     # print(len(message))
    #     # print(img)
    return img


def initialize():
    #LOAD MODEL HERE
    print("INITIALIZED")
    pass

# Process the received message
def process_message(message):
    printedstr = ""
    global isPrinted
    # Your processing logic here
    data_aux = []
    x_ = []
    y_ = []
    try:
        frame = readb64(message)
        # print("MAYBE WORKED")
    except:
        print("ERROR")
        return
    
    
    
    frame_rgb = cv2.cvtColor(frame, cv2.IMREAD_COLOR)
    # print(frame_rgb)
    
    # H, W = frame_rgb[0].size
    # print('{} by {}'.format(H, W))
    
    results = hands.process(frame_rgb)
    # print(results.multi_hand_landmarks)
    if results.multi_hand_landmarks:
        # for hand_landmarks in results.multi_hand_landmarks:
        #     mp_drawing.draw_landmarks(
        #         frame,  # image to draw
        #         hand_landmarks,  # model output
        #         mp_hands.HAND_CONNECTIONS,  # hand connections
        #         mp_drawing_styles.get_default_hand_landmarks_style(),
        #         mp_drawing_styles.get_default_hand_connections_style())

        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y

                x_.append(x)
                y_.append(y)

            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))

        try:
            prediction = model.predict([np.asarray(data_aux)])
            predicted_character = labels_dict[int(prediction[0])]
            # printedstr = printedstr.strip()+"\n"+predicted_character
            printedstr = predicted_character


        except Exception:
            print(str(Exception))
            print("SYSTEM ExCEPTION")
            return
        print(printedstr)
    else:
        pass
        # print("NO LANDMARKS")

    

def main():
    # Initialize resources
    # initialize()
    
    # Process incoming messages
    while True:
        # Read a line from stdin (which is where messages from Node.js will be written)
        message = sys.stdin.readline().strip()
        
        if message:            
            # Process the message
            process_message(message)
            
            sys.stdout.flush() # NEEDED TO SEND IMMEDIATELY

        time.sleep(0.001) # STOP FOR 100 MILLISECONDS

if __name__ == "__main__":
    main()