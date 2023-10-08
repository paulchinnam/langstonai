"use client";

import { useSearchParams } from "next/navigation";
import { useAuth, useCollection } from "../hooks/useFirebase";
import { useState } from "react";

export default function Chat() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [message, setMessage] = useState();

  function sendMessage() {
    let messageToSend = {
      sender: "user",
      text: message,
    };

    addMessage(messageToSend);
    setMessage("");
  }
  const { user } = useAuth();
  const { data: messages, add: addMessage } = useCollection(
    `sessions/${sessionId}/messages`
  );
  return (
    <>
      <div className="flex bg-gray-700">
        <aside className="w-1/5 border-l border-gray-800 p-6 bg-gray-800 text-white my-10 ml-4 rounded-md">
          Word library
        </aside>
        <div className="flex flex-col justify-center h-screen py-10 px-6 w-4/5">
          {/* <h1 className="text-2xl font-serif pb-6 text-white text-right">
            Talk to Langston
          </h1> */}
          {user && (
            <div className="flex flex-col justify-between h-full w-full border border-gray-800 bg-gray-800 rounded-md p-4 shadow-sm">
              {/* <div className="flex flex-col-reverse overflow-auto h-full w-full">
              {messages &&
                messages.map((message, i) => {
                  return (
                    <div
                      key={i}
                      className={`w-1/3 ${
                        message.sender == "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <h1 className="font-bold text-lg"> {message.sender}</h1>
                      <p className=" text-md">{message.text}</p>
                    </div>
                  );
                })}
            </div> */}
              <div className="flex flex-col-reverse overflow-auto h-full w-full space-y-2">
                {messages &&
                  messages.map((message, i) => {
                    return (
                      <div
                        key={i}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        } w-full px-4`}
                      >
                        <div
                          className={`border p-2 rounded-lg shadow-sm text-white border-gray-700 bg-gray-500 w-1/3 ${
                            message.sender === "user" ? "ml-auto" : "mr-auto"
                          }`}
                        >
                          <h1 className="font-bold text-lg capitalize">
                            {message.sender}
                          </h1>
                          <p className="text-md">{message.text}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="w-full pt-4 border-t border-gray-700 mt-6">
                <div className="flex gap-4 items-center w-3/4 mx-auto">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border w-full border-gray-700 rounded-md px-4 py-4 bg-gray-600"
                    placeholder="enter your message"
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-md hover:bg-blue-400 hover:scale-105 text-white bg-green-600 px-4 py-2"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
