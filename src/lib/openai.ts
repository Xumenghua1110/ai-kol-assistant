import OpenAI from "openai";
import { aiPrompts } from "@/config/prompts.config";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export async function analyzeKOLProfile(kolData: {
  name: string;
  platform: string;
  followers: number;
  contentDescription: string;
}) {
  const systemPrompt = aiPrompts.profileAnalysis.system +
    (aiPrompts.profileAnalysis.industryContext
      ? `\n\nAdditional industry context: ${aiPrompts.profileAnalysis.industryContext}`
      : "");

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Analyze this contact:
        Name: ${kolData.name}
        Platform: ${kolData.platform}
        Followers: ${kolData.followers.toLocaleString()}
        Content: ${kolData.contentDescription}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
}

export async function generateOutreachEmail(params: {
  kolName: string;
  kolProfile: string;
  language: string;
  cooperationType: "gift" | "paid" | "commission";
  brandInfo: string;
  tone: string;
}) {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "system",
        content: `${aiPrompts.outreachGeneration.system}\n\nLanguage: ${params.language}\nTone: ${params.tone}`,
      },
      {
        role: "user",
        content: `Generate an outreach message for:
        Contact: ${params.kolName}
        Profile: ${params.kolProfile}
        Cooperation Type: ${params.cooperationType}
        Our Brand: ${params.brandInfo}`,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}
