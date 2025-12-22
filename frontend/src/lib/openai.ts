// src/lib/openai.ts
import OpenAI from "@/lib/openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
