import { brandConfig } from "./brand.config";

type ChannelKey = "email" | "whatsapp" | "instagram";
type LangKey = "English" | "Portuguese" | "Spanish" | "Chinese";

interface TemplateVars {
  contactName: string;
  greeting: string;
  niche: string;
  region: string;
  platform: string;
  brandName: string;
  website: string;
  productDescription: string;
  senderName: string;
  senderTitle: string;
  senderPhone: string;
  senderEmail: string;
}

export function buildTemplateVars(
  kolName: string,
  contactPerson: string | null,
  niche: string,
  region: string,
  platform: string,
  language: string
): TemplateVars {
  const lang = language as LangKey;
  return {
    contactName: kolName,
    greeting: contactPerson
      ? contactPerson.split(",")[0].trim().split(" ").pop()!
      : kolName,
    niche: niche || "your industry",
    region: region || "your region",
    platform: platform || "social media",
    brandName: brandConfig.brand.companyName,
    website: brandConfig.brand.website,
    productDescription:
      brandConfig.brand.productDescription[lang] ||
      brandConfig.brand.productDescription.English,
    senderName: brandConfig.sender.name,
    senderTitle: brandConfig.sender.title,
    senderPhone: brandConfig.sender.phone,
    senderEmail: brandConfig.sender.email,
  };
}

function fill(template: string, vars: TemplateVars): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key as keyof TemplateVars];
    return v !== undefined ? String(v) : `{${key}}`;
  });
}

export function generateEmailContent(
  kol: { name: string; niche: string | null; region: string | null; platform: string; type: string; contactPerson: string | null },
  language: string,
  _cooperationType: string,
  channel: string
): string {
  const vars = buildTemplateVars(
    kol.name,
    kol.contactPerson,
    kol.niche || "",
    kol.region || "",
    kol.platform,
    language
  );
  const isAssociation = kol.type === "Association";
  const lang = (language as LangKey) || "English";
  const ch = (channel as ChannelKey) || "email";

  const t = templates[lang]?.[ch] || templates.English.email;
  const tpl = isAssociation && templates[lang]?.email_association
    ? templates[lang].email_association
    : t;

  return fill(tpl, vars);
}

const templates: Record<string, Record<string, string>> = {
  English: {
    email_association: `Subject: Partnership Inquiry — {brandName} x {contactName}

Dear {greeting},

I hope this message finds you well. I'm {senderName}, {senderTitle} at {brandName}.

{productDescription}

We are actively expanding our presence in {region} and are very interested in exploring collaboration opportunities with {contactName}. We believe a partnership could bring mutual value — from product demonstrations at your events to joint educational content for your members.

Would you be available for a brief introductory call?

Best regards,
{senderName} | {senderTitle}
{brandName}
WhatsApp: {senderPhone}
Email: {senderEmail}
{website}`,

    email: `Subject: Collaboration Opportunity — {brandName} x {contactName}

Hi {greeting},

I've been following your {platform} content and really impressed by your {niche} coverage. Your authentic approach in {region} is exactly what we look for in a partner.

I'm {senderName} from {brandName}. {productDescription}

We'd love to explore a collaboration with you. No scripts, no constraints — just an authentic partnership.

Would you be open to a quick chat?

Best regards,
{senderName} | {brandName}
WhatsApp: {senderPhone}
{website}`,

    whatsapp: `Hi {greeting}! \n\nI'm {senderName} from {brandName}. Love your {niche} content on {platform}!\n\n{productDescription}\n\nWould love to explore a collaboration. Interested in a quick chat?`,

    instagram: `Hey {greeting}! Love your {niche} content 🔆 We'd love to collab — DM open for details!`,
  },

  Portuguese: {
    email_association: `Assunto: Proposta de Parceria — {brandName} x {contactName}

Prezado(a) {greeting},

Espero que esta mensagem o(a) encontre bem. Sou {senderName}, {senderTitle} da {brandName}.

{productDescription}

Estamos expandindo ativamente nossa presença no(a) {region} e temos grande interesse em explorar oportunidades de colaboração com {contactName}. Acreditamos que uma parceria pode trazer valor mútuo.

Você estaria disponível para uma breve conversa introdutória?

Abraços,
{senderName} | {senderTitle}
{brandName}
WhatsApp: {senderPhone}
Email: {senderEmail}
{website}`,

    email: `Assunto: Proposta de Parceria — {brandName} x {contactName}

Olá {greeting},

Acompanho seu conteúdo no {platform} e fico impressionado com sua cobertura sobre {niche}. Sua abordagem autêntica na {region} é exatamente o que procuramos em um parceiro.

Sou {senderName} da {brandName}. {productDescription}

Gostaríamos de explorar uma colaboração com você. Toparia um bate-papo rápido?

Abraços,
{senderName} | {brandName}
WhatsApp: {senderPhone}
{website}`,

    whatsapp: `Oi {greeting}! \n\nSou {senderName} da {brandName}. Adoro seu conteúdo sobre {niche} no {platform}!\n\n{productDescription}\n\nBora conversar? 🌞`,

    instagram: `Oi {greeting}! Adorei seu conteúdo 🔆 Queremos colaborar — DM aberto!`,
  },

  Spanish: {
    email_association: `Asunto: Propuesta de Colaboración — {brandName} x {contactName}

Estimado(a) {greeting},

Espero que este mensaje le encuentre bien. Soy {senderName}, {senderTitle} de {brandName}.

{productDescription}

Estamos expandiendo activamente nuestra presencia en {region} y estamos muy interesados en explorar oportunidades de colaboración con {contactName}.

¿Estaría disponible para una breve llamada introductoria?

Saludos cordiales,
{senderName} | {senderTitle}
{brandName}
WhatsApp: {senderPhone}
Email: {senderEmail}
{website}`,

    email: `Asunto: Propuesta de Colaboración — {brandName} x {contactName}

Hola {greeting},

He seguido tu contenido en {platform} y me impresiona mucho tu cobertura sobre {niche}. Tu enfoque auténtico en {region} es exactamente lo que buscamos en un socio.

Soy {senderName} de {brandName}. {productDescription}

¿Te gustaría charlar brevemente sobre una colaboración?

Saludos,
{senderName} | {brandName}
WhatsApp: {senderPhone}
{website}`,

    whatsapp: `¡Hola {greeting}! \n\nSoy {senderName} de {brandName}. ¡Me encanta tu contenido sobre {niche} en {platform}!\n\n{productDescription}\n\n¿Charlamos? 🌞`,

    instagram: `¡Hola {greeting}! Me encantó tu contenido 🔆 ¡Queremos colaborar — DM abierto!`,
  },

  Chinese: {
    email_association: `主题：合作洽谈 — {brandName} x {contactName}

尊敬的{greeting}：

您好！我是{brandName}的{senderName}，{senderTitle}。

{productDescription}

我们正在积极拓展{region}市场，非常有兴趣与{contactName}探讨合作机会。我们相信合作可以带来双赢。

您方便安排一次简短的介绍通话吗？

此致，
{senderName} | {senderTitle}
{brandName}
WhatsApp: {senderPhone}
Email: {senderEmail}
{website}`,

    email: `主题：合作邀约 — {brandName} x {contactName}

{greeting}你好，

我一直在关注你们的{platform}内容，对你们的{niche}报道印象深刻。你们在{region}的真实态度正是我们寻找合作伙伴的标准。

我是{brandName}的{senderName}。{productDescription}

方便简单聊聊合作吗？

此致，
{senderName} | {brandName}
WhatsApp: {senderPhone}
{website}`,

    whatsapp: `你好{greeting}！👋\n\n我是{brandName}的{senderName}，很喜欢你在{platform}上的{niche}内容！\n\n{productDescription}\n\n有兴趣聊聊吗？🌞`,

    instagram: `嗨{greeting}！喜欢你的内容 🔆 想合作——DM详聊！`,
  },
};
