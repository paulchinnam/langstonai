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
      <div className="flex justify-center h-full">
        {user && (
          <div className="flex flex-col justify-between h-full w-3/4">
            <div className="flex flex-col-reverse overflow-auto h-full w-full">
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
            </div>

            <div className="flex items-center mb-10 ">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className=" border w-3/4 border-black"
              />
              <button
                onClick={sendMessage}
                className="  mx-3 rounded-full px-6  py-2 hover:bg-blue-400 hover:scale-105 text-white bg-blue-300"
              >
                Send
              </button>
              <button
                onClick={clearChat}
                className="mx-3 rounded-full px-6 py-2 hover:bg-red-400 hover:scale-105 text-white bg-red-300"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
