// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "https://esm.run/@google/generative-ai";
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyA9nh0Jlkfih8vlrXn4Cd9-esW-L_J3C4s";
  

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];



// Get access to the webcam
let frams = []
let MODIFIER = 25;
let dat = "";
let ASLField = document.getElementById('ASL');
let lang = document.getElementById('language');
var count = {
    'A' : 0, 'B' : 0, 'C' : 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0, 'I' : 0, 'SPACE': 0, 'K': 0, 
               'L': 0,  'M': 0, 'N': 0, 'O': 0, 'P': 0, 'Q': 0, 'R': 0, 'S': 0, 'T': 0, 'U': 0, 
               'V': 0, 'W': 0, 'X': 0, 'Y': 0, 'NEXT': 0}

navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
    var video = document.getElementById("videoElement");
    
    video.srcObject = stream;
    
    // Set up the WebSocket connection
    var socket = new WebSocket('ws://localhost:3000/ws');
    socket.onopen = function(event) {
        console.log('WebSocket connection established');
    };
    socket.onmessage = function(event) {
        // 'event.data' contains the received data
        // console.log('Received data:', event.data);
        // YUFAN DO STUFF HERE THIS IS THE DATA

        // datArr = event.data.toString().trim().split("\n");
        // dat = datArr[1];
        // uri = datArr[0];
        // hands.src = '../server/annotated_image.jpg';
        // console.log(datArr);

        dat = event.data.toString().trim();

        if (frams.length == MODIFIER) {
            let removed = frams.shift();
            count[removed]--;
        }
        
        frams.push(dat);
        count[dat]++;
        if (frams.length == MODIFIER) {
            if (count[dat] >= 0.60 * MODIFIER) {
                if (dat.length == 5) {
                    ASLField.innerText += '_';
                } else if (dat.length == 4) {
                    ASLField.innerText += '.\n';
                    const lines = ASLField.innerText.split('\n');
                    console.log(lang.options[lang.selectedIndex].text);
                    send(lines[lines.length - 2].trim(), lang.options[lang.selectedIndex].text);
                } else {
                    ASLField.innerText += dat;
                }
                frams = [];
            }
        }

    };
    
    // Send video stream to the server
    setInterval(function() {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var data = canvas.toDataURL('image/jpeg');
        if(socket.readyState === socket.OPEN){
            // console.log(data);
            socket.send(data);
        }
    }, 50); // Adjust the interval as needed
})
.catch(function(err) {
    console.log("Error: " + err);
});


async function send(message, lang) {
    const result = await model.generateContent(`Translate the following to ${lang}, and respond only with the translated message. Note that there may be typoes, so take your best interpretation of the sentence: ${message}`);
    const response = await result.response;
    setTimeout(() => {
    console.log(response.candidates[0].content.parts[0].text);
    ASLField.innerText += `(Translated to: ${response.candidates[0].content.parts[0].text})\n`
    const utterance = new SpeechSynthesisUtterance(response.candidates[0].content.parts[0].text);
    speechSynthesis.speak(utterance);
    }, 100);
}