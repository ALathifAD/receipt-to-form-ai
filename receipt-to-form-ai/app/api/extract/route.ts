import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  console.log("--- API REQUEST STARTED ---");

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gunakan "gemini-1.5-flash" atau "gemini-1.5-flash-latest"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = "Extract merchantName, date (YYYY-MM-DD), totalAmount (number), and currency from this receipt. Return JSON.";

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    console.log("Gemini Response:", text);

    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    console.error("DETAILED ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}