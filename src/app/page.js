"use client";
import Image from "next/image";
import Wave from "./components/Wave";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <main className="flex items-center h-screen bg-gray-700">
        <div className="mx-auto">
          <div className="flex flex-col items-center gap-4 place-items-center">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-serif gap-4 text-white">LangstonAI</p>
              <Wave />
            </div>
            <button
              onClick={() => router.push("/signin")}
              className="mt-6 border border-white px-4 py-2 text-white rounded-md hover:bg-white duration-100 hover:text-gray-700 font-serif"
            >
              Get started
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
