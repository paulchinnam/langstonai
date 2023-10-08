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
import OpenAI from "openai";

initializeApp();
const db = getFirestore();

exports.generateMessageResponse = onDocumentCreated(
  "users/{userId}/sessions/{sessionId}/messages/{messageId}",
  async (event) => {
    try {
      const { userId, sessionId } = event.params;
      const userRef = db.collection("users").doc(userId);
      const messagesRef = userRef
        .collection("sessions")
        .doc("sessionId")
        .collection("messages");

      const userMessageSnap = event.data;
      const userMessage = userMessageSnap.data();
      const { text } = userMessage;

      const userSnap = await userRef.get();
      const user = userSnap.data();
      const words = { user };

      let wordsArray = [];
      for (let word of words) {
        wordsArray.push(word.word);
      }

      //generate chatgpt response

      // messagesRef.add(someResponse)
    } catch (err) {
      console.error(err);
    }
  }
);

exports.fetchOpenAIResponse = async () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const apiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `prompt goes here`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let assistantMessage = apiResponse.choices[0].message.content;
    const parsed = JSON.parse(assistantMessage);
    console.log(assistantMessage);
    console.log(parsed);
    setResponse(parsed);
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
  }
};
