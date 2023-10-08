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

exports.fetchOpenAIResponse = async (prompt, userMessage) => {
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
          content: prompt,
        },
        {
          role: "user",
          content: userMessage,
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

    return parsed;
  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
  }
};

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
      const prompt = `prompt goes here`;
      const gptResponse = await exports.fetchOpenAIResponse(
        prompt,
        userMessage
      );

      return gptResponse;

      // messagesRef.add(someResponse)
    } catch (err) {
      console.error(err);
    }
  }
);
