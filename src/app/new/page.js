"use client";
import { Fragment, useState } from "react";
import { useAuth } from "../hooks/useFirebase";

export default function Example() {
  const { signOut } = useAuth();
  return (
    <>
      <div className="flex absolute justify-end w-full">
        <button
          onClick={() => signOut}
          className="px-4 py-2 border border-gray-400 m-4 rounded-md text-gray-400 hover:bg-gray-400 hover:text-gray-700"
        >
          Sign Out
        </button>
      </div>
      <main className="bg-gray-700 h-screen flex items-center">
        <div className="mx-auto space-y-6 w-96">
          <h1 className="font-serif text-white text-xl text-center">
            Choose a scenario
          </h1>
          <div>
            <textarea
              rows={10}
              placeholder="Enter a practice scenario"
              className="block rounded-md w-full p-4 bg-gray-800  text-white min-h-96 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-green-600"
            />
            <div className="flex justify-end mt-2">
              <button className=" px-4 py-2 rounded-md bg-green-600 text-white hover:bg-opacity-50">
                Go
              </button>
            </div>
          </div>
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
          <button className="bg-indigo-600 px-4 py-2 rounded-md hover:opacity-75 text-white w-full">
            Generate a random scenario
          </button>
        </div>
      </main>
    </>
  );
}
