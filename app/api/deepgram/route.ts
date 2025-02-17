import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content: text } = body;

    const deepgramApiKey =
      process.env.DEEPGRAM_API_KEY || "YOUR_DEEPGRAM_API_KEY";
    const deepgram = createClient(deepgramApiKey);

    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        // model: "aura-orpheus-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();

    if (stream) {
      const buffer = await getAudioBuffer(stream);

      // Return the audio buffer directly in the response
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": buffer.length.toString(),
        },
      });
    } else {
      console.error("Error generating audio:", stream);
      return NextResponse.json({
        msg: "Error generating audio",
      });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({
      msg: "Internal Server Error",
    });
  }
}

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response: ReadableStream) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};
