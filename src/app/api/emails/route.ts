import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

// GET emails
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kolId = searchParams.get("kolId");
    const status = searchParams.get("status");
    const where: any = {};
    if (kolId) where.kolId = kolId;
    if (status) where.status = status;
    const emails = await prisma.email.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { kol: true },
    });
    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

// PATCH email status (e.g., mark as Sent)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const updated = await prisma.email.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update email status" },
      { status: 500 }
    );
  }
}

function buildEmailPrompt(name: string, platform: string, followers: number, niche: string, region: string, profile: string, brandInfo: string, coopLabel: string, tone: string, language: string) {
  return `You are a professional international marketing specialist writing a KOL outreach email. Write a COMPLETE, well-structured email in ${language || 'English'}. Do NOT truncate or cut off mid-sentence.

KOL Information:
- Name: ${name}
- Platform: ${platform}
- Followers: ${followers}
- Niche: ${niche || 'Solar Energy'}
- Region: ${region || 'Not specified'}
- Profile Notes: ${profile || 'N/A'}

Brand Information: ${brandInfo || 'Ktech Solar - solar inverter manufacturer'}

Cooperation Type: ${coopLabel}

Tone: ${tone || 'Professional yet warm'}

EMAIL STRUCTURE (follow all sections in order):

1. SUBJECT LINE: The VERY FIRST line must be "Subject: " followed by a personalized, sincere subject line that feels authentic and specific to THIS KOL. Do NOT use generic subjects like "Partnership Opportunity" or "Collaboration". Instead, reference something specific about them — their content, their region, or a genuine compliment. Examples:
   - Portuguese: "Subject: Seus vídeos sobre instalação solar me impressionaram — proposta de parceria"
   - Spanish: "Subject: Me encantó tu contenido sobre energía solar — propuesta de colaboración"
   - English: "Subject: Loved your recent solar installation video — collaboration idea for ${name}"
   Make the subject feel like it was written specifically for them, not a template.

2. GREETING: Address the KOL by name warmly.

3. OPENING (2-3 sentences): Mention that you recently discovered their channel/content and were genuinely impressed. Reference their content style naturally. Make it feel personal and authentic, not generic.

4. BRAND INTRODUCTION (3-4 sentences): Introduce Ktech Solar as a Chinese manufacturer of solar inverters and photovoltaic energy systems. Mention key product features: hybrid and off-grid inverters, integrated MPPT, IP65 protection, LiFePO4 battery compatibility. Mention the website: https://www.ktechsolar.com/

5. WHY THEM (2-3 sentences): Explain specifically why this KOL is a great fit — reference their platform, content style, audience, and region. Show that you've done your research.

6. COLLABORATION PROPOSAL (3-4 sentences): Clearly explain what we offer based on the cooperation type:
   - If Gift: We send free inverters/equipment for them to test and use in their projects, no payment required.
   - If Paid: Equipment for content creation + payment per video/post.
   - If Commission: Revenue sharing partnership.
   - If Pending: Open to discussion.
   Also mention: special installer pricing, direct technical support from our engineering team.

7. WHAT WE ASK (2-3 sentences): 1 post or Reel showing the equipment in a real installation or technical review. 1 mention in Stories (optional).

8. CALL TO ACTION (2 sentences): Suggest connecting via WhatsApp or Google Meet. Ask for their preferred time.

9. CLOSING: Warm professional sign-off. Use: "Abraço," for Portuguese, "Saludos," for Spanish, "Best regards," for English.
   Sign as: Eaea, Overseas Media Relations Specialist, Ktech Solar
   Include: WhatsApp: +86-18914111136 | Email: eaea@ktechenergy.com

CRITICAL: Write the COMPLETE email. Do not stop mid-sentence. Every section above must be included. The email should be approximately 250-400 words. Write entirely in ${language || 'English'} with proper special characters (ç, ã, õ, é, í, ó, ú, ñ, etc.).`;
}

// Model for short messages (WhatsApp/Instagram) — use non-reasoning instruction-tuned model
const SHORT_MSG_MODEL = 'google/gemma-4-26b-a4b-it:free';

// System message for short-message channels — extremely strict output-only mode
const SHORT_MSG_SYSTEM = `You are a text generator. You generate ONLY the final message text. You NEVER output anything except the message itself. No thinking. No reasoning. No word count. No explanation. No notes. No drafts. No preamble. No commentary. Just the message. If you output anything other than the message itself, it is WRONG.`;

function buildWhatsAppMessages(name: string, platform: string, followers: number, niche: string, region: string, profile: string, brandInfo: string, coopLabel: string, language: string) {
  // Extract first name if name contains parentheses, e.g. "Energia Solar Master (Glauder)" → "Glauder"
  const nameMatch = name.match(/\(([^)]+)\)/);
  const greetName = nameMatch ? nameMatch[1] : name.split(/\s+/)[0];

  const signOff = language === 'Portuguese' ? 'Abraço!' : language === 'Spanish' ? 'Saludos!' : 'Cheers!';

  const langNative = language === 'Portuguese' ? 'Português' : language === 'Spanish' ? 'Español' : 'English';

  const userPrompt = `Generate a WhatsApp message in ${language} (${langNative}). The message must be written ENTIRELY in ${language}.

Recipient: ${greetName}
Their platform: ${platform}
Their region: ${region || 'Latin America'}

The message must have exactly this structure (with blank lines between sections):

Line 1: Oi, ${greetName}! 👋

Line 2: Vi seu conteúdo sobre energia solar e fiquei impressionado com a clareza.

Line 3: (empty)

Line 4: A Ktech Solar é uma fabricante chinesa de inversores solares e sistemas fotovoltaicos, especializada em inversores híbridos e off‑grid com MPPT integrado, proteção IP65 e compatibilidade com baterias LiFePO4.

Line 5: (empty)

Line 6: Gostaríamos de propor uma parceria com duas modalidades à sua escolha:

Line 7: Opção A: Enviamos o equipamento de presente, sem compromisso de pagamento.

Line 8: Opção B: Pagamos por cada vídeo ou post produzido com o nosso inversor.

Line 9: (empty)

Line 10: Em ambos os casos, pedimos apenas um feedback sincero e, se gostar, um vídeo mostrando o produto em ação.

Line 11: (empty)

Line 12: Topa receber mais detalhes pelo WhatsApp? 😊

Line 13: (empty)

Line 14: ${signOff}

Line 15: Eaea from Ktech Solar

Line 16: WhatsApp: +86-18914111136

IMPORTANT: Output ONLY the final message text above. Do NOT add any thinking, reasoning, word count, explanation, or any other text. The message must be in ${language} (${langNative}). Start directly with "Oi, ${greetName}!" and end with the WhatsApp number.`;

  return [
    { role: 'system' as const, content: SHORT_MSG_SYSTEM },
    { role: 'user' as const, content: userPrompt },
  ];
}

function buildInstagramMessages(name: string, platform: string, followers: number, niche: string, region: string, profile: string, brandInfo: string, coopLabel: string, language: string) {
  const nameMatch = name.match(/\(([^)]+)\)/);
  const greetName = nameMatch ? nameMatch[1] : name.split(/\s+/)[0];

  const langNative = language === 'Portuguese' ? 'Português' : language === 'Spanish' ? 'Español' : 'English';

  const userPrompt = `Generate an Instagram DM in ${language} (${langNative}). Output ONLY the message text.

Recipient: ${greetName}
Platform: ${platform}
Region: ${region || 'Latin America'}

Structure (with blank lines between sections):

Line 1: Oi, ${greetName}! 👋🌞

Line 2: Adorei seu conteúdo sobre energia solar!

Line 3: (empty)

Line 4: Sou da Ktech Solar, fabricante chinesa de inversores solares. Adoraríamos enviar um equipamento para você testar!

Line 5: (empty)

Line 6: Quer receber mais detalhes? 😊

Line 7: (empty)

Line 8: Eaea from Ktech Solar 🌞

IMPORTANT: Output ONLY the message. No thinking, no reasoning, no word count, no explanation. Start with "Oi, ${greetName}!" and end with "Eaea from Ktech Solar 🌞". Write entirely in ${language}.`;

  return [
    { role: 'system' as const, content: SHORT_MSG_SYSTEM },
    { role: 'user' as const, content: userPrompt },
  ];
}

// Clean up AI output: strip thinking/reasoning and extract only the actual message
function cleanShortMessageOutput(raw: string, channel: string): string {
  let content = raw;

  // Step 1: Remove  tags (some models wrap thinking in these)
  content = content.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Step 2: Remove common preamble patterns
  content = content.replace(/^(Here is|Below is|This is|Sure!|Okay!|Alright!|Of course!|Certainly!|Absolutely!|No problem!|I'd be happy to)[\s\S]*?\n\n/gim, '');

  // Step 3: Find the actual message by looking for greeting patterns
  // The message should start with a greeting like "Oi,", "Hola,", "Hey,", "Hi,", "Olá,", etc.
  const greetingPatterns = [
    /(?:^|\n)\s*((?:Oi|Hola|Hey|Hi|Olá|Hello|Bună|Ciao|Salut|Buenos|Buenas|Ei|Yo)[\s\S]*)/i,
  ];

  let bestMatch = '';
  let bestIndex = Infinity;

  for (const pattern of greetingPatterns) {
    const match = content.match(pattern);
    if (match && match.index !== undefined && match.index < bestIndex) {
      bestIndex = match.index;
      bestMatch = match[1].trim();
    }
  }

  if (bestMatch && bestIndex < content.length * 0.6) {
    // The greeting was found and it's not too far into the text (meaning there's a lot of preamble)
    content = bestMatch;
  }

  // Step 4: Remove trailing thinking/analysis
  // Cut off at common post-message patterns
  const trailingPatterns = [
    /\n(?:Word count|Words:|Total words|Word total|Count:|Total:|Nota:|Note:|Observação|Observations|Summary|Resumo|Análise|Analysis|---)/i,
    /\n(?:This message|The message|Above|Espero que|Es message|Ce message|Dieses Nachricht)/i,
    /\n\d+ words/i,
  ];

  for (const pattern of trailingPatterns) {
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      content = content.substring(0, match.index).trim();
    }
  }

  // Step 5: Final cleanup — remove any remaining leading/trailing whitespace and extra newlines
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  return content;
}

// POST generate message (calls OpenAI)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      kolId,
      kolName,
      kolProfile,
      language,
      cooperationType,
      tone,
      brandInfo,
      channel,
    } = body;

    // Look up KOL from database if kolId provided
    let kolData: any = null;
    if (kolId) {
      try {
        kolData = await prisma.kOL.findUnique({ where: { id: kolId } });
      } catch {
        // KOL not found in DB, use provided data
      }
    }

    const name = kolData?.name || kolName || "KOL";
    const profile = kolData?.notes || kolProfile || "";
    const platform = kolData?.platform || "";
    const followers = kolData?.followers || 0;
    const region = kolData?.region || "";
    const niche = kolData?.niche || "";

    const coopMap: Record<string, string> = {
      'gift': 'Gift (free products for testing/use)',
      'paid': 'Paid collaboration (equipment return + payment per video)',
      'commission': 'Commission-based',
      'pending': 'To be discussed / Pending',
    };
    const coopLabel = coopMap[cooperationType] || cooperationType || 'Gift (free products for testing/use)';

    const msgChannel = channel || 'email';
    let messages: { role: string; content: string }[];
    let useShortMsgModel = false;

    if (msgChannel === 'whatsapp') {
      messages = buildWhatsAppMessages(name, platform, followers, niche, region, profile, brandInfo, coopLabel, language);
      useShortMsgModel = true;
    } else if (msgChannel === 'instagram') {
      messages = buildInstagramMessages(name, platform, followers, niche, region, profile, brandInfo, coopLabel, language);
      useShortMsgModel = true;
    } else {
      const emailPrompt = buildEmailPrompt(name, platform, followers, niche, region, profile, brandInfo, coopLabel, tone, language);
      messages = [{ role: 'user', content: emailPrompt }];
    }

    // Use non-reasoning model for WhatsApp/Instagram to avoid thinking output
    const model = useShortMsgModel
      ? SHORT_MSG_MODEL
      : (process.env.OPENAI_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free');

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: msgChannel === 'email' ? 0.7 : 0.2,
      max_tokens: msgChannel === 'email' ? 2000 : 500,
    });

    let content = completion.choices[0]?.message?.content || '';

    // Post-process: clean up short message output
    if (msgChannel !== 'email') {
      content = cleanShortMessageOutput(content, msgChannel);
    }

    // Extract subject (for email only)
    const subjectMatch = content.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Collaboration Opportunity';
    const msgBody = msgChannel === 'email' ? content.replace(/Subject:\s*.+\n\n?/i, '') : content;

    // Always save to database — find a valid kolId even if not provided
    let savedEmail = null;
    let validKolId = kolId || null;

    // If no kolId provided, use the first KOL in the database as fallback
    if (!validKolId) {
      try {
        const firstKol = await prisma.kOL.findFirst({ select: { id: true } });
        if (firstKol) validKolId = firstKol.id;
      } catch { /* no KOLs in DB */ }
    }

    if (validKolId) {
      try {
        savedEmail = await prisma.email.create({
          data: {
            kolId: validKolId,
            subject,
            body: msgBody,
            language: language || "English",
            cooperationType: cooperationType || "gift",
            tone: tone || "Professional yet warm",
            channel: msgChannel,
            status: "Draft",
          },
        });
      } catch (dbError) {
        console.warn("Failed to save to database:", dbError);
      }
    }

    return NextResponse.json({
      ...(savedEmail || {}),
      id: savedEmail?.id || `temp-${Date.now()}`,
      subject,
      body: msgBody,
      content,
      language: language || "English",
      cooperationType: cooperationType || "gift",
      channel: msgChannel,
      status: "Draft",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate" },
      { status: 500 }
    );
  }
}
