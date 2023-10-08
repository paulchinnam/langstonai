
const { initializeApp } = require("firebase-admin/app");
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Send_Flowers } from "next/font/google";
import { cloneDeep } from "lodash";
const functions = require("firebase-functions");
const {
  onDocumentCreated,
  Change,
  FirestoreEvent,
} = require("firebase-functions/v2/firestore");

initializeApp()
const db = getFirestore()

exports.generateMessageResponse = onDocumentCreated("users/{userId}/sessions/{sessionId}/messages/{messageId}", async (event) => {
    try {
        const {userId, sessionId} = event.params
        const userRef = db.collection("users").doc(userId);
        const messagesRef = userRef.collection("sessions").doc("sessionId").collection("messages")
        
        const userMessageSnap = event.data
        const userMessage = userMessageSnap.data()
        const { text } = userMessage;

        const userSnap = await userRef.get()
        const user = userSnap.data()
        const words = {user}

        let wordsArray = []
        for (let word of words){
            wordsArray.push(word.word)
        }

        


        

        //generate chatgpt response

       // messagesRef.add(someResponse)
        
    } catch (err){
        console.error(err)
    }
});






