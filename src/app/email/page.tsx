"use client";
import { useEffect, useState, useRef } from "react";
import { Sparkles, Send, Copy, Check, Mail, X, Globe, ExternalLink, MessageCircle, Camera, Phone, ChevronDown, Users, CheckSquare, Square, Zap } from "lucide-react";
import { demoKols, type KOL } from "@/lib/demoData";

const STORAGE_KEY = "kol_contacts";

function loadAllContacts(): KOL[] {
  if (typeof window === "undefined") return demoKols;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const stored: KOL[] = data ? JSON.parse(data) : [];
    const storedIds = new Set(stored.map((c) => c.id));
    const newDemos = demoKols.filter((k) => !storedIds.has(k.id));
    return [...stored, ...newDemos];
  } catch { return demoKols; }
}

const languageMap: Record<string, string> = {
  "葡语": "Portuguese", "西语": "Spanish", "英语": "English", "中文": "Chinese",
};

const brandInfoByLang: Record<string, string> = {
  English: `Ktech Solar is a Chinese manufacturer of solar inverters and photovoltaic energy systems. We specialize in hybrid and off-grid inverters with integrated MPPT, IP65 protection, and LiFePO4 battery compatibility. We are looking for authentic partners in the solar installation space who combine quality technical work with a genuine digital presence. Our website: https://www.ktechsolar.com/`,
  Portuguese: `A Ktech Solar é uma fabricante chinesa de inversores solares e sistemas de energia fotovoltaica. Somos especializados em inversores híbridos e off-grid com MPPT integrado, proteção IP65 e compatibilidade com baterias LiFePO4. Buscamos parceiros autênticos no segmento de instalação solar que combinem trabalho técnico de qualidade com uma presença digital genuína. Nosso site: https://www.ktechsolar.com/`,
  Spanish: `Ktech Solar es un fabricante chino de inversores solares y sistemas de energía fotovoltaica. Nos especializamos en inversores híbridos y off-grid con MPPT integrado, protección IP65 y compatibilidad con baterías LiFePO4. Buscamos socios auténticos en el sector de instalación solar que combinen un trabajo técnico de calidad con una presencia digital genuina. Nuestro sitio web: https://www.ktechsolar.com/`,
  Chinese: `Ktech Solar是一家中国太阳能逆变器和光伏发电系统制造商。我们专注于集成MPPT、IP65防护、兼容LiFePO4电池的混合和离网逆变器。我们正在寻找太阳能安装领域的真正合作伙伴，将优质技术工作与真实的数字化影响力相结合。我们的网站：https://www.ktechsolar.com/`,
};

const toneByLang: Record<string, string> = {
  English: "Professional yet warm", Portuguese: "Profissional mas acolhedor",
  Spanish: "Profesional pero cálido", Chinese: "专业且亲切",
};

const channelLabels: Record<string, string> = { email: "Email", whatsapp: "WhatsApp", instagram: "Instagram DM" };
const defaultSender = "eaea@ktechenergy.com";

function getKolContacts(kol: KOL) {
  const contacts: { type: string; value: string; label: string }[] = [];
  const ci = kol.contactInfo;
  if (ci?.emails?.length > 0) ci.emails.forEach((e) => contacts.push({ type: "email", value: e, label: e }));
  if (ci?.phones?.length > 0) ci.phones.forEach((p) => contacts.push({ type: "whatsapp", value: p.replace(/[\s\-()]/g, ""), label: p }));
  if (ci?.instagrams?.length > 0) ci.instagrams.forEach((ig) => contacts.push({ type: "instagram", value: ig, label: `@${ig}` }));
  return contacts;
}

const ContactIcon = ({ type }: { type: string }) => {
  if (type === "email") return <Mail className="w-3.5 h-3.5" />;
  if (type === "whatsapp") return <Phone className="w-3.5 h-3.5" />;
  if (type === "instagram") return <Camera className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
};

const contactColor = (type: string) => {
  if (type === "email") return "bg-blue-100 text-blue-600";
  if (type === "whatsapp") return "bg-green-100 text-green-600";
  if (type === "instagram") return "bg-pink-100 text-pink-600";
  return "bg-gray-100 text-gray-600";
};

function generateEmailContent(kol: KOL, language: string, cooperationType: string, channel: string): string {
  const kolName = kol.name;
  const niche = kol.niche || "solar energy";
  const region = kol.region || "your region";
  const platform = kol.platform || "Website";
  const type = kol.type;
  const contactPerson = kol.contactPerson;

  const greeting = contactPerson ? contactPerson.split(",")[0].trim().split(" ").pop() : kolName;

  const templates: Record<string, Record<string, string>> = {
    English: {
      email: type === "Association"
        ? `Subject: Partnership Inquiry — Ktech Solar x ${kolName}

Dear ${greeting},

I hope this message finds you well. I'm Eaea, Overseas Media Relations Specialist at Ktech Solar.

Ktech Solar is a Chinese manufacturer specializing in hybrid and off-grid solar inverters with integrated MPPT, IP65 protection, and LiFePO4 battery compatibility. We are actively expanding our presence in ${region} and are very interested in exploring collaboration opportunities with ${kolName}.

We believe a partnership could bring mutual value — from product demonstrations at your events to joint educational content for your members. We'd love to learn more about your upcoming initiatives and discuss how Ktech Solar can contribute.

Would you be available for a brief introductory call?

Best regards,
Eaea | Overseas Media Relations Specialist
Ktech Solar
WhatsApp: +86-18914111136
Email: eaea@ktechenergy.com
https://www.ktechsolar.com/`
        : `Subject: Collaboration Opportunity — Ktech Solar x ${kolName}

Hi ${greeting},

I've been following your ${platform} content and really impressed by your ${niche} coverage. Your authentic approach to ${niche.toLowerCase()} in ${region} is exactly what we look for in a partner.

I'm Eaea from Ktech Solar — we manufacture hybrid and off-grid solar inverters with integrated MPPT and IP65 protection. We're expanding our presence in ${region} and believe your audience would genuinely benefit from our products.

We'd love to send you our latest hybrid inverter for an honest review. No scripts, no constraints — just your authentic take.

Would you be open to a quick chat about collaboration?

Best regards,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
      whatsapp: `Hi ${greeting}! \n\nI'm Eaea from Ktech Solar. Love your ${niche} content on ${platform}!\n\nWe make hybrid solar inverters and think your audience in ${region} would really benefit. Would love to send you one for an honest review — no strings attached.\n\nInterested in a quick chat? `,
      instagram: `Hey ${greeting}! Love your solar content 🔆 We'd love to collab — DM open for details!`,
    },
    Portuguese: {
      email: type === "Association"
        ? `Assunto: Proposta de Parceria — Ktech Solar x ${kolName}

Prezado(a) ${greeting},

Espero que esta mensagem o(a) encontre bem. Sou Eaea, Especialista em Relações com Mídia Internacional da Ktech Solar.

A Ktech Solar é uma fabricante chinesa especializada em inversores solares híbridos e off-grid com MPPT integrado, proteção IP65 e compatibilidade com baterias LiFePO4. Estamos expandindo ativamente nossa presença no(a) ${region} e temos grande interesse em explorar oportunidades de colaboração com ${kolName}.

Acreditamos que uma parceria pode trazer valor mútuo — desde demonstrações de produtos em seus eventos até conteúdo educacional conjunto para seus membros. Gostaríamos de saber mais sobre suas próximas iniciativas e discutir como a Ktech Solar pode contribuir.

Você estaria disponível para uma breve conversa introdutória?

Abraços,
Eaea | Especialista em Relações com Mídia Internacional
Ktech Solar
WhatsApp: +86-18914111136
Email: eaea@ktechenergy.com
https://www.ktechsolar.com/`
        : `Assunto: Proposta de Parceria — Ktech Solar x ${kolName}

Olá ${greeting},

Acompanho seu conteúdo no ${platform} e fico impressionado com sua cobertura sobre ${niche}. Sua abordagem autêntica para ${niche.toLowerCase()} na ${region} é exatamente o que procuramos em um parceiro.

Sou Eaea da Ktech Solar — fabricamos inversores solares híbridos e off-grid com MPPT integrado e proteção IP65. Estamos expandindo nossa presença na ${region} e acreditamos que seu público se beneficiaria genuinamente dos nossos produtos.

Gostaríamos de enviar nosso mais recente inversor híbrido para uma avaliação honesta. Sem scripts, sem restrições — apenas sua opinião autêntica.

Toparia um bate-papo rápido sobre colaboração?

Abraços,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
      whatsapp: `Oi ${greeting}! \n\nSou Eaea da Ktech Solar. Adoro seu conteúdo sobre ${niche} no ${platform}!\n\nFabricamos inversores solares híbridos e achamos que seu público na ${region} ia gostar. Queríamos te enviar um para avaliação — sem compromisso.\n\nBora conversar? 🌞`,
      instagram: `Oi ${greeting}! Adorei seu conteúdo solar 🔆 Queremos colaborar — DM aberto!`,
    },
    Spanish: {
      email: type === "Association"
        ? `Asunto: Propuesta de Colaboración — Ktech Solar x ${kolName}

Estimado(a) ${greeting},

Espero que este mensaje le encuentre bien. Soy Eaea, Especialista en Relaciones con Medios Internacionales de Ktech Solar.

Ktech Solar es un fabricante chino especializado en inversores solares híbridos y off-grid con MPPT integrado, protección IP65 y compatibilidad con baterías LiFePO4. Estamos expandiendo activamente nuestra presencia en ${region} y estamos muy interesados en explorar oportunidades de colaboración con ${kolName}.

Creemos que una asociación podría traer valor mutuo — desde demostraciones de productos en sus eventos hasta contenido educativo conjunto para sus miembros. Nos encantaría conocer más sobre sus próximas iniciativas y discutir cómo Ktech Solar puede contribuir.

¿Estaría disponible para una breve llamada introductoria?

Saludos cordiales,
Eaea | Especialista en Relaciones con Medios Internacionales
Ktech Solar
WhatsApp: +86-18914111136
Email: eaea@ktechenergy.com
https://www.ktechsolar.com/`
        : `Asunto: Propuesta de Colaboración — Ktech Solar x ${kolName}

Hola ${greeting},

He seguido tu contenido en ${platform} y me impresiona mucho tu cobertura sobre ${niche}. Tu enfoque auténtico de ${niche.toLowerCase()} en ${region} es exactamente lo que buscamos en un socio.

Soy Eaea de Ktech Solar — fabricamos inversores solares híbridos y off-grid con MPPT integrado y protección IP65. Estamos expandiendo nuestra presencia en ${region} y creemos que tu audiencia se beneficiaría genuinamente de nuestros productos.

Nos encantaría enviarte nuestro último inversor híbrido para una revisión honesta. Sin guiones, sin restricciones — solo tu opinión auténtica.

¿Te gustaría charlar brevemente sobre una colaboración?

Saludos,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
      whatsapp: `¡Hola ${greeting}! \n\nSoy Eaea de Ktech Solar. ¡Me encanta tu contenido sobre ${niche} en ${platform}!\n\nFabricamos inversores solares híbridos y creemos que tu audiencia en ${region} lo disfrutaría. Nos gustaría enviarte uno para una revisión honesta — sin compromiso.\n\n¿Charlamos? 🌞`,
      instagram: `¡Hola ${greeting}! Me encantó tu contenido solar 🔆 ¡Queremos colaborar — DM abierto!`,
    },
    Chinese: {
      email: type === "Association"
        ? `主题：合作洽谈 — Ktech Solar x ${kolName}

尊敬的${greeting}：

您好！我是Ktech Solar海外媒体关系专员Eaea。

Ktech Solar是一家中国太阳能逆变器和光伏发电系统制造商，专注于集成MPPT、IP65防护、兼容LiFePO4电池的混合和离网逆变器。我们正在积极拓展${region}市场，非常有兴趣与${kolName}探讨合作机会。

我们相信合作可以带来双赢——从在您的活动中进行产品展示，到为您的会员提供联合教育内容。我们希望了解更多贵方的近期计划，并探讨Ktech Solar如何贡献力量。

您方便安排一次简短的介绍通话吗？

此致，
Eaea | 海外媒体关系专员
Ktech Solar
WhatsApp: +86-18914111136
Email: eaea@ktechenergy.com
https://www.ktechsolar.com/`
        : `主题：合作邀约 — Ktech Solar x ${kolName}

${greeting}你好，

我一直在关注你们的${platform}内容，对你们的${niche}报道印象深刻。你们在${region}对${niche.toLowerCase()}的真实态度正是我们寻找合作伙伴的标准。

我是Ktech Solar的Eaea——我们生产带集成MPPT和IP65防护的混合和离网太阳能逆变器。我们正在拓展${region}市场，相信你们的受众会真正受益于我们的产品。

我们想寄给你们最新的混合逆变器进行真实评测。没有脚本，没有约束——只需要你们的真实反馈。

方便简单聊聊合作吗？

此致，
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
      whatsapp: `你好${greeting}！👋\n\n我是Ktech Solar的Eaea，很喜欢你在${platform}上的${niche}内容！\n\n我们做混合太阳能逆变器，觉得${region}的受众会感兴趣。想寄一台给你做真实评测——无任何附加条件。\n\n有兴趣聊聊吗？🌞`,
      instagram: `嗨${greeting}！喜欢你的太阳能内容 🔆 想合作——DM详聊！`,
    },
  };

  const langTemplates = templates[language] || templates["English"];
  return langTemplates[channel] || langTemplates["email"];
}

interface BatchResult {
  kolId: string;
  kolName: string;
  channel: string;
  content: string;
  to: string;
  language: string;
}

export default function EmailGenerator() {
  const [kols, setKols] = useState<KOL[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedKol, setSelectedKol] = useState("");
  const [language, setLanguage] = useState("English");
  const [cooperationType, setCooperationType] = useState("gift");
  const [brandInfo, setBrandInfo] = useState(brandInfoByLang["English"]);
  const [tone, setTone] = useState("Professional yet warm");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [ccEmails, setCcEmails] = useState("");
  const [senderEmail, setSenderEmail] = useState(defaultSender);
  const [generationError, setGenerationError] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [showKolDropdown, setShowKolDropdown] = useState(false);
  const [kolSearch, setKolSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Batch state
  const [batchSelected, setBatchSelected] = useState<Set<string>>(new Set());
  const [batchChannel, setBatchChannel] = useState("email");
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchFilter, setBatchFilter] = useState("");

  useEffect(() => { setKols(loadAllContacts()); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowKolDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (brandInfoByLang[newLang]) setBrandInfo(brandInfoByLang[newLang]);
    if (toneByLang[newLang]) setTone(toneByLang[newLang]);
  };

  const handleKolSelect = (kolId: string) => {
    setSelectedKol(kolId);
    setSelectedChannel("");
    setShowKolDropdown(false);
    setKolSearch("");
    if (!kolId) return;
    const kol = kols.find((k) => k.id === kolId);
    if (kol && kol.language) {
      const mappedLang = languageMap[kol.language] || kol.language;
      const validLangs = ["English", "Portuguese", "Spanish", "Chinese"];
      if (validLangs.includes(mappedLang)) handleLanguageChange(mappedLang);
    }
    if (kol) {
      const contacts = getKolContacts(kol);
      if (contacts.length > 0) setSelectedChannel(contacts[0].type);
    }
  };

  const handleGenerate = async () => {
    if (!selectedKol) return;
    setGenerating(true);
    setGenerationError(false);
    setResult("");
    try {
      const kol = kols.find((k) => k.id === selectedKol);
      const channel = selectedChannel || "email";
      await new Promise((r) => setTimeout(r, 800));
      const content = generateEmailContent(kol!, language, cooperationType, channel);
      setResult(content);
      setGenerationError(false);
    } catch {
      setGenerationError(true);
      setResult("");
    }
    setGenerating(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const getSubjectFallback = (kolName: string) => {
    const fallbacks: Record<string, string> = {
      English: `Loved your solar content, ${kolName} — let's collaborate`,
      Portuguese: `Seus conteúdos sobre energia solar me impressionaram, ${kolName} — proposta de parceria`,
      Spanish: `Me encantó tu contenido sobre energía solar, ${kolName} — propuesta de colaboración`,
      Chinese: `很喜欢你的太阳能内容，${kolName}——合作邀约`,
    };
    return fallbacks[language] || fallbacks["English"];
  };

  const getEmailData = () => {
    const kol = kols.find((k) => k.id === selectedKol);
    const contacts = getKolContacts(kol || {} as KOL);
    const emailContacts = contacts.filter((c) => c.type === "email");
    const to = emailContacts.map((c) => c.value).join(",");
    const kolName = kol?.name || "KOL";
    const subjectLine = result.match(/Subject:\s*(.+)/i) || result.match(/Asunto:\s*(.+)/i) || result.match(/Assunto:\s*(.+)/i) || result.match(/主题：\s*(.+)/i);
    const subject = subjectLine ? subjectLine[1].trim() : getSubjectFallback(kolName);
    const bodyText = result.replace(/^(Subject|Asunto|Assunto|主题[：:])\s*.+\n?/i, "").trim();
    return { to, subject, body: bodyText, cc: ccEmails || "" };
  };

  const handleSendClick = () => {
    if (!result) { alert("Please generate content first."); return; }
    if (!selectedKol) { alert("Please select a KOL first."); return; }
    setShowSendModal(true);
  };

  const openFoxmail = () => {
    const { to, subject, body } = getEmailData();
    if (!to) { alert("No email address found for this KOL."); return; }
    const textarea = document.createElement("textarea");
    textarea.value = body;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(textarea);
    let mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}`;
    if (ccEmails) mailtoLink += `&cc=${encodeURIComponent(ccEmails)}`;
    const link = document.createElement("a");
    link.href = mailtoLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowSendModal(false);
  };

  const openWhatsApp = () => {
    const kol = kols.find((k) => k.id === selectedKol);
    const contacts = getKolContacts(kol || {} as KOL);
    const waContacts = contacts.filter((c) => c.type === "whatsapp");
    if (waContacts.length === 0) { alert("No WhatsApp number found."); return; }
    const phone = waContacts[0].value.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(result);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setShowSendModal(false);
  };

  const openInstagram = () => {
    const kol = kols.find((k) => k.id === selectedKol);
    const contacts = getKolContacts(kol || {} as KOL);
    const igContacts = contacts.filter((c) => c.type === "instagram");
    if (igContacts.length === 0) { alert("No Instagram handle found."); return; }
    const username = igContacts[0].value.replace(/^@/, "");
    navigator.clipboard.writeText(result).catch(() => {});
    window.open(`https://www.instagram.com/${username}/`, "_blank");
    setShowSendModal(false);
    setTimeout(() => { alert("Instagram profile opened. Message copied to clipboard — paste it (Ctrl+V) in the DM chat."); }, 1000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    setShowSendModal(false);
  };

  const getSelectedKol = () => kols.find((k) => k.id === selectedKol);
  const getSelectedKolContacts = () => getSelectedKol() ? getKolContacts(getSelectedKol()!) : [];
  const filteredKols = kols.filter((k) =>
    k.name.toLowerCase().includes(kolSearch.toLowerCase()) ||
    (k.platform || "").toLowerCase().includes(kolSearch.toLowerCase())
  );

  const selectedKolData = getSelectedKol();
  const selectedKolContacts = getSelectedKolContacts();

  // Batch functions
  const toggleBatchSelect = (id: string) => {
    const next = new Set(batchSelected);
    next.has(id) ? next.delete(id) : next.add(id);
    setBatchSelected(next);
  };

  const selectAllBatch = () => {
    const filtered = kols.filter((k) => {
      if (batchFilter === "has-email") return k.contactInfo?.emails?.length > 0;
      if (batchFilter === "has-whatsapp") return k.contactInfo?.phones?.length > 0;
      if (batchFilter === "has-instagram") return k.contactInfo?.instagrams?.length > 0;
      return true;
    });
    if (batchSelected.size === filtered.length) setBatchSelected(new Set());
    else setBatchSelected(new Set(filtered.map((k) => k.id)));
  };

  const handleBatchGenerate = async () => {
    if (batchSelected.size === 0) return;
    setBatchGenerating(true);
    setBatchResults([]);
    await new Promise((r) => setTimeout(r, 500));

    const results: BatchResult[] = [];
    for (const kolId of batchSelected) {
      const kol = kols.find((k) => k.id === kolId);
      if (!kol) continue;
      const contacts = getKolContacts(kol);
      const channel = batchChannel;
      const contactForChannel = contacts.find((c) => c.type === channel);
      if (!contactForChannel && channel !== "email") continue;

      const content = generateEmailContent(kol, kol.language || language, cooperationType, channel);
      const toEmails = contacts.filter((c) => c.type === "email").map((c) => c.value).join(", ");
      results.push({
        kolId: kol.id,
        kolName: kol.name,
        channel,
        content,
        to: channel === "email" ? toEmails : contactForChannel?.label || "",
        language: kol.language || language,
      });
    }

    setBatchResults(results);
    setBatchGenerating(false);
  };

  const copyBatchResult = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const sendBatchEmail = (r: BatchResult) => {
    const subjectLine = r.content.match(/^(Subject|Asunto|Assunto|主题[：:])\s*(.+)/i);
    const subject = subjectLine ? subjectLine[2].trim() : `Collaboration — Ktech Solar x ${r.kolName}`;
    const body = r.content.replace(/^(Subject|Asunto|Assunto|主题[：:])\s*.+\n?/i, "").trim();
    const textarea = document.createElement("textarea");
    textarea.value = body;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(textarea);
    const mailtoLink = `mailto:${r.to}?subject=${encodeURIComponent(subject)}`;
    const link = document.createElement("a");
    link.href = mailtoLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const batchFilteredKols = kols.filter((k) => {
    if (batchFilter === "has-email") return k.contactInfo?.emails?.length > 0;
    if (batchFilter === "has-whatsapp") return k.contactInfo?.phones?.length > 0;
    if (batchFilter === "has-instagram") return k.contactInfo?.instagrams?.length > 0;
    return true;
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outreach Generator</h1>
            <p className="text-[var(--muted)] mt-1">Generate personalized outreach messages for any channel</p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setBatchMode(false)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!batchMode ? "bg-white shadow-sm text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
              Single
            </button>
            <button onClick={() => setBatchMode(true)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${batchMode ? "bg-white shadow-sm text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
              <Zap className="w-3.5 h-3.5 inline mr-1" />Batch
            </button>
          </div>
        </div>
      </div>

      {/* ===== SINGLE MODE ===== */}
      {!batchMode && (
        <>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Select Contact *</label>
                <div className="relative" ref={dropdownRef}>
                  <button type="button" onClick={() => setShowKolDropdown(!showKolDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    {selectedKolData ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{selectedKolData.name}</span>
                        <span className="text-[var(--muted)]">({selectedKolData.platform})</span>
                        {selectedKolContacts.map((c, i) => (
                          <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${contactColor(c.type)}`} title={c.label}>
                            <ContactIcon type={c.type} />
                          </span>
                        ))}
                        {selectedKolContacts.length === 0 && <span className="text-xs text-red-400">No contacts</span>}
                      </div>
                    ) : <span className="text-[var(--muted)]">Choose a contact...</span>}
                    <ChevronDown className="w-4 h-4 text-[var(--muted)] flex-shrink-0" />
                  </button>
                  {showKolDropdown && (
                    <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <input type="text" placeholder="Search..." value={kolSearch} onChange={(e) => setKolSearch(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400" autoFocus />
                      </div>
                      <div className="overflow-y-auto max-h-56">
                        {filteredKols.length === 0 ? <div className="p-3 text-sm text-gray-400 text-center">No contacts found</div> : filteredKols.map((k) => {
                          const contacts = getKolContacts(k);
                          return (
                            <button key={k.id} onClick={() => handleKolSelect(k.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-blue-50 transition-colors ${selectedKol === k.id ? "bg-blue-50" : ""}`}>
                              <span className="font-medium text-gray-900 flex-shrink-0">{k.name}</span>
                              <span className="text-gray-400 text-xs flex-shrink-0">({k.platform})</span>
                              <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                                {contacts.map((c, i) => (
                                  <span key={i} className={`inline-flex items-center p-1 rounded ${contactColor(c.type)}`} title={`${c.type}: ${c.label}`}>
                                    <ContactIcon type={c.type} />
                                  </span>
                                ))}
                                {contacts.length === 0 && <span className="text-xs text-red-300">No contacts</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedKolData && selectedKolContacts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Contact Channel</label>
                  <div className="flex gap-2 flex-wrap">
                    {selectedKolContacts.map((c, i) => {
                      const isSelected = selectedChannel === c.type;
                      return (
                        <button key={i} onClick={() => { setSelectedChannel(c.type); setResult(""); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${isSelected ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                          <ContactIcon type={c.type} />
                          <span>{channelLabels[c.type] || c.type}</span>
                          <span className="text-xs opacity-60">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedKolData && selectedKolContacts.length === 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">This contact has no contact info.</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Language</label>
                  <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    <option>English</option><option>Portuguese</option><option>Spanish</option><option>Chinese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Cooperation Type</label>
                  <select value={cooperationType} onChange={(e) => setCooperationType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    <option value="gift">Gift (free products)</option><option value="paid">Paid collaboration</option>
                    <option value="commission">Commission-based</option><option value="pending">Pending / To be discussed</option>
                  </select>
                </div>
              </div>

              {selectedChannel === "email" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">From (Sender)</label>
                    <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">CC (optional)</label>
                    <input type="text" value={ccEmails} onChange={(e) => setCcEmails(e.target.value)} placeholder="colleague@company.com"
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5">Brand Info</label>
                <textarea value={brandInfo} onChange={(e) => setBrandInfo(e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tone</label>
                <input type="text" value={tone} onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>

              <button onClick={handleGenerate} disabled={generating || !selectedKol || selectedKolContacts.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors">
                {generating ? <><Sparkles className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate {selectedChannel === "whatsapp" ? "WhatsApp" : selectedChannel === "instagram" ? "Instagram DM" : "Email"}</>}
              </button>
            </div>
          </div>

          {result && !generationError && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated {selectedChannel === "whatsapp" ? "WhatsApp Message" : selectedChannel === "instagram" ? "Instagram DM" : "Email"}</h2>
                <div className="flex items-center gap-3">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                    {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                  </button>
                  <button onClick={handleSendClick} className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                    <Send className="w-4 h-4" /> Send via {channelLabels[selectedChannel] || "Email"}
                  </button>
                </div>
              </div>
              {selectedChannel === "email" && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-900 mb-1">To: <span className="font-normal">{getEmailData().to || "No email"}</span></p>
                  {ccEmails && <p className="text-blue-700">CC: {ccEmails}</p>}
                  <p className="text-blue-700">From: {senderEmail}</p>
                </div>
              )}
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{result}</pre>
            </div>
          )}

          {generationError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-medium mb-3">Failed to generate</p>
              <button onClick={handleGenerate} disabled={generating}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                {generating ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          {showSendModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">Send via {channelLabels[selectedChannel] || "Email"}</h2>
                  <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                {selectedChannel === "email" && (
                  <div className="space-y-3">
                    <button onClick={openFoxmail} className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition-colors text-left bg-blue-50/50">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-white" /></div>
                      <div><p className="font-medium text-gray-900">Foxmail</p><p className="text-xs text-gray-500">Open in Foxmail client</p></div>
                      <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Default</span>
                    </button>
                    <button onClick={handleCopyBody} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"><Copy className="w-5 h-5 text-amber-600" /></div>
                      <div><p className="font-medium text-gray-900">Copy to Clipboard</p><p className="text-xs text-gray-500">Copy content, paste manually</p></div>
                    </button>
                  </div>
                )}
                {selectedChannel === "whatsapp" && (
                  <div className="space-y-3">
                    <button onClick={openWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 border-2 border-green-400 rounded-lg hover:bg-green-50 transition-colors text-left bg-green-50/50">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5 text-white" /></div>
                      <div><p className="font-medium text-gray-900">Open WhatsApp</p><p className="text-xs text-gray-500">Send via WhatsApp Web/App</p></div>
                      <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Go</span>
                    </button>
                    <button onClick={handleCopyBody} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"><Copy className="w-5 h-5 text-amber-600" /></div>
                      <div><p className="font-medium text-gray-900">Copy to Clipboard</p><p className="text-xs text-gray-500">Copy message, paste manually</p></div>
                    </button>
                  </div>
                )}
                {selectedChannel === "instagram" && (
                  <div className="space-y-3">
                    <button onClick={openInstagram} className="w-full flex items-center gap-3 px-4 py-3 border-2 border-pink-400 rounded-lg hover:bg-pink-50 transition-colors text-left bg-pink-50/50">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0"><Camera className="w-5 h-5 text-white" /></div>
                      <div><p className="font-medium text-gray-900">Open Instagram</p><p className="text-xs text-gray-500">Open profile, message copied to clipboard</p></div>
                      <span className="ml-auto text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">Go</span>
                    </button>
                    <button onClick={handleCopyBody} className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"><Copy className="w-5 h-5 text-amber-600" /></div>
                      <div><p className="font-medium text-gray-900">Copy to Clipboard</p><p className="text-xs text-gray-500">Copy message, paste manually</p></div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== BATCH MODE ===== */}
      {batchMode && (
        <div className="space-y-6">
          {/* Batch Settings */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-[var(--primary)]" /> Batch Generate</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Channel</label>
                <select value={batchChannel} onChange={(e) => setBatchChannel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram DM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Cooperation Type</label>
                <select value={cooperationType} onChange={(e) => setCooperationType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="gift">Gift (free products)</option><option value="paid">Paid collaboration</option>
                  <option value="commission">Commission-based</option><option value="pending">Pending / To be discussed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Filter by contact</label>
                <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="">All contacts</option>
                  <option value="has-email">Has email</option>
                  <option value="has-whatsapp">Has WhatsApp</option>
                  <option value="has-instagram">Has Instagram</option>
                </select>
              </div>
            </div>

            {/* Contact list with checkboxes */}
            <div className="border border-[var(--card-border)] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-[var(--card-border)]">
                <button onClick={selectAllBatch} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                  {batchSelected.size === batchFilteredKols.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>
                <span className="text-sm text-[var(--muted)]">{batchSelected.size} / {batchFilteredKols.length} selected</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {batchFilteredKols.map((kol) => {
                  const contacts = getKolContacts(kol);
                  const hasChannel = batchChannel === "email" ? contacts.some((c) => c.type === "email") : contacts.some((c) => c.type === batchChannel);
                  const isSelected = batchSelected.has(kol.id);
                  return (
                    <div key={kol.id} className={`flex items-center gap-3 px-4 py-2.5 border-b border-[var(--card-border)]/50 ${isSelected ? "bg-[var(--primary)]/5" : "hover:bg-gray-50"} ${!hasChannel ? "opacity-40" : ""}`}>
                      <button onClick={() => hasChannel && toggleBatchSelect(kol.id)} disabled={!hasChannel}
                        className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors shrink-0">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--primary)]" /> : <Square className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{kol.name}</span>
                        <span className="text-xs text-[var(--muted)] ml-2">{kol.type} · {kol.region || "No region"}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {contacts.map((c, i) => (
                          <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${contactColor(c.type)} ${c.type === batchChannel ? "ring-2 ring-[var(--primary)]/30" : ""}`} title={c.label}>
                            <ContactIcon type={c.type} /> {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={handleBatchGenerate} disabled={batchGenerating || batchSelected.size === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors">
              {batchGenerating ? <><Sparkles className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate {batchSelected.size} Messages</>}
            </button>
          </div>

          {/* Batch Results */}
          {batchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Generated Messages ({batchResults.length})</h2>
              {batchResults.map((r, idx) => (
                <div key={idx} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium">{r.kolName}</span>
                      <span className="text-xs text-[var(--muted)] ml-2">{r.language} · {channelLabels[r.channel]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyBatchResult(r.content)} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      {r.channel === "email" && r.to && (
                        <button onClick={() => sendBatchEmail(r)} className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 flex items-center gap-1">
                          <Send className="w-3 h-3" /> Send
                        </button>
                      )}
                    </div>
                  </div>
                  {r.channel === "email" && r.to && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                      <span className="font-medium text-blue-900">To: </span><span className="text-blue-700">{r.to}</span>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-[var(--muted)]">{r.content}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
