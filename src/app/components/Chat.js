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
  function clearChat() {}
  const { user } = useAuth();
  const { data: messages, add: addMessage } = useCollection(
    `sessions/${sessionId}/messages`
  );
  return (
    <>
      <div className="flex justify-center h-screen p-10 ">
        {user && (
          <div className="flex flex-col justify-between h-full w-full border border-gray-200 rounded-md p-4 shadow-sm">
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
                        className={`border p-2 rounded-lg shadow-sm bg-white w-1/3 ${
                          message.sender === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <h1 className="font-bold text-lg">{message.sender}</h1>
                        <p className="text-md">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="w-full pt-4 border-t border-gray-200 mt-6">
              <div className="flex gap-4 items-center w-3/4 mx-auto">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border w-full border-gray-300 rounded-md px-4 py-4 bg-gray-100"
                  placeholder="enter your message"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={sendMessage}
                    className="rounded-md hover:bg-blue-400 hover:scale-105 text-white bg-green-600 px-4 py-2"
                  >
                    Send
                  </button>
                  <button
                    onClick={clearChat}
                    className="rounded-md hover:bg-red-400 hover:scale-105 text-white bg-red-500 px-4 py-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
