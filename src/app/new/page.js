"use client";
import { Fragment, useState } from "react";
import { useAuth } from "../hooks/useFirebase";


export default function Example() {
  const {signOut} = useAuth()
  return (
    <>
    <button onClick={()=>signOut} className="px-3 py-2 bg-blue-300 rounded-full">Sign Out</button>
      <main className="bg-gray-700 h-screen flex items-center">
        <div className="mx-auto space-y-6 w-96">
          <h1 className="font-serif text-white text-xl text-center">
            Choose a scenario
          </h1>
          <textarea
            rows={10}
            placeholder="Enter a practice scenario"
            className="block rounded-md w-full p-4 bg-gray-800  text-white min-h-96 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-green-600"
          />
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-700 px-2 text-sm text-gray-300">Or</span>
            </div>
          </div>
          <button className="bg-green-600 px-4 py-2 rounded-md hover:opacity-75 text-white w-full">
            Generate a random scenario
          </button>
        </div>
      </main>
    </>
  );
}
