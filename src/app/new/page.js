"use client";

export default function Chat() {
  return (
    <>
      <div className="fixed h-full w-full z-10">
        <video
          autoPlay
          loop
          type="video/mp4"
          src="/clouds.mp4"
          className="h-[110%] w-[110%] blur-sm"
        />
      </div>
      <div className="fixed w-screen h-screen z-20 bg-white bg-opacity-20"></div>
      <div className="h-screen w-screen flex items-center z-0">
        <div className="w-fit mx-auto h-1/4 flex items-center gap-4 z-20">
          <div className="shadow-lg flex flex-col p-4 h-full rounded-lg gap-3 bg-white bg-opacity-50 ">
            <h1 className="text-xl font-semibold">
              Provide a practice scenario
            </h1>
            <textarea className="w-full border rounded-md border-gray-300"></textarea>
            <button className="bg-green-500 hover:bg-green-600 rounded-lg px-4 py-1 duration-200 text-white text-lg font-semibold">
              Go
            </button>
          </div>
          <h1 className="text-lg">or</h1>
          <button className="bg-green-500 hover:bg-green-600 rounded-lg px-4 py-1 duration-200 text-white text-lg font-semibold">
            Generate a random one
          </button>
        </div>
      </div>
    </>
  );
}
