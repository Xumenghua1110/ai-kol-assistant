import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

/**
 * Generate a KOL profile analysis report
 */
export async function analyzeKOLProfile(kolData: {
  name: string;
  platform: string;
  followers: number;
  contentDescription: string;
}) {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert marketing analyst specializing in KOL (Key Opinion Leader) evaluation. 
        Analyze the given KOL profile and provide structured insights in JSON format with these fields:
        - contentStyle: description of their content style and tone
        - audienceProfile: inferred audience demographics and interests
        - engagementQuality: assessment of their engagement (low/medium/high + reasoning)
        - brandFitScore: score from 1-10 for solar/tech brand partnership potential
        - recommendations: array of actionable collaboration suggestions
        - riskFactors: array of potential risks or concerns`,
      },
      {
        role: "user",
        content: `Analyze this KOL:
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

/**
 * Generate a personalized outreach email
 */
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
        content: `You are a professional outreach email writer for international marketing campaigns.
        Write a personalized KOL collaboration email in ${params.language}.
        The email should be professional yet warm, reference specific details about the KOL's content,
        and clearly present the collaboration proposal.
        
        Cooperation types:
        - gift: We send free products as a gift, no payment required
        - paid: We pay a fixed fee per video/post
        - commission: Commission-based partnership
        
        Keep the tone ${params.tone}. Include a clear CTA.`,
      },
      {
        role: "user",
        content: `Generate an outreach email for:
        KOL: ${params.kolName}
        KOL Profile: ${params.kolProfile}
        Cooperation Type: ${params.cooperationType}
        Our Brand: ${params.brandInfo}`,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}
