"use client";
import { useEffect, useState, useRef } from "react";
import { Sparkles, Send, Copy, Check, Mail, X, Globe, ExternalLink, MessageCircle, Camera, Phone, ChevronDown } from "lucide-react";
import { demoKols } from "@/lib/demoData";

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
  English: "Professional yet warm",
  Portuguese: "Profissional mas acolhedor",
  Spanish: "Profesional pero cálido",
  Chinese: "专业且亲切",
};

const channelLabels: Record<string, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  instagram: "Instagram DM",
};

const defaultSender = "eaea@ktechenergy.com";
const myWhatsApp = "8618914111136";
const myInstagram = "ktechsolar";

function getKolContacts(kol: any) {
  const contacts: { type: string; value: string; label: string }[] = [];
  const ci = kol.contactInfo;
  if (ci?.emails?.length > 0) {
    ci.emails.forEach((e: string) => contacts.push({ type: "email", value: e, label: e }));
  }
  if (ci?.phones?.length > 0) {
    ci.phones.forEach((p: string) => contacts.push({ type: "whatsapp", value: p.replace(/[\s\-()]/g, ""), label: p }));
  }
  if (ci?.instagrams?.length > 0) {
    ci.instagrams.forEach((ig: string) => contacts.push({ type: "instagram", value: ig, label: `@${ig}` }));
  }
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

export default function EmailGenerator() {
  const [kols] = useState<any[]>(demoKols);
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
  const [generatedEmailId, setGeneratedEmailId] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowKolDropdown(false);
      }
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
    const kol = kols.find(k => k.id === kolId);
    if (kol && kol.language) {
      const mappedLang = languageMap[kol.language] || kol.language;
      const validLangs = ["English", "Portuguese", "Spanish", "Chinese"];
      if (validLangs.includes(mappedLang)) handleLanguageChange(mappedLang);
    }
    // Auto-select first available channel
    if (kol) {
      const contacts = getKolContacts(kol);
      if (contacts.length > 0) setSelectedChannel(contacts[0].type);
    }
  };

  const generateStaticContent = (kol: any, channel: string) => {
    const kolName = kol?.name || "Creator";
    const niche = kol?.niche || "solar energy";
    const region = kol?.region || "your region";
    const platform = kol?.platform || "YouTube";

    const templates: Record<string, Record<string, string>> = {
      English: {
        email: `Subject: Collaboration Opportunity — Ktech Solar x ${kolName}

Hi ${kolName} team,

I've been following your ${platform} channel and really impressed by your ${niche} content. Your authentic approach to ${niche.toLowerCase()} in ${region} is exactly what we look for in a partner.

I'm Eaea from Ktech Solar — we manufacture hybrid and off-grid solar inverters with integrated MPPT and IP65 protection. We're expanding our presence in ${region} and believe your audience would genuinely benefit from our products.

We'd love to send you our latest hybrid inverter for an honest review. No scripts, no constraints — just your authentic take.

Would you be open to a quick chat about collaboration?

Best regards,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
        whatsapp: `Hi ${kolName}! 👋

I'm Eaea from Ktech Solar. Love your ${niche} content on ${platform}!

We make hybrid solar inverters and think your audience in ${region} would really benefit. Would love to send you one for an honest review — no strings attached.

Interested in a quick chat? 🌞`,
        instagram: `Hey ${kolName}! Love your solar content 🔆 We'd love to collab — DM open for details!`,
      },
      Portuguese: {
        email: `Assunto: Proposta de Parceria — Ktech Solar x ${kolName}

Olá equipe ${kolName},

Acompanho seu canal no ${platform} e fico impressionado com seu conteúdo sobre ${niche}. Sua abordagem autêntica para ${niche.toLowerCase()} na ${region} é exatamente o que procuramos em um parceiro.

Sou Eaea da Ktech Solar — fabricamos inversores solares híbridos e off-grid com MPPT integrado e proteção IP65. Estamos expandindo nossa presença na ${region} e acreditamos que seu público se beneficiaria genuinamente dos nossos produtos.

Gostaríamos de enviar nosso mais recente inversor híbrido para uma avaliação honesta. Sem scripts, sem restrições — apenas sua opinião autêntica.

Toparia um bate-papo rápido sobre colaboração?

Abraços,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
        whatsapp: `Oi ${kolName}! 👋

Sou Eaea da Ktech Solar. Adoro seu conteúdo sobre ${niche} no ${platform}!

Fabricamos inversores solares híbridos e achamos que seu público na ${region} ia gostar. Queríamos te enviar um para avaliação — sem compromisso.

Bora conversar? 🌞`,
        instagram: `Oi ${kolName}! Adorei seu conteúdo solar 🔆 Queremos colaborar — DM aberto!`,
      },
      Spanish: {
        email: `Asunto: Propuesta de Colaboración — Ktech Solar x ${kolName}

Hola equipo de ${kolName},

He seguido tu canal en ${platform} y me impresiona mucho tu contenido sobre ${niche}. Tu enfoque auténtico de ${niche.toLowerCase()} en ${region} es exactamente lo que buscamos en un socio.

Soy Eaea de Ktech Solar — fabricamos inversores solares híbridos y off-grid con MPPT integrado y protección IP65. Estamos expandiendo nuestra presencia en ${region} y creemos que tu audiencia se beneficiaría genuinamente de nuestros productos.

Nos encantaría enviarte nuestro último inversor híbrido para una revisión honesta. Sin guiones, sin restricciones — solo tu opinión auténtica.

¿Te gustaría charlar brevemente sobre una colaboración?

Saludos,
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
        whatsapp: `¡Hola ${kolName}! 👋

Soy Eaea de Ktech Solar. ¡Me encanta tu contenido sobre ${niche} en ${platform}!

Fabricamos inversores solares híbridos y creemos que tu audiencia en ${region} lo disfrutaría. Nos gustaría enviarte uno para una revisión honesta — sin compromiso.

¿Charlamos? 🌞`,
        instagram: `¡Hola ${kolName}! Me encantó tu contenido solar 🔆 ¡Queremos colaborar — DM abierto!`,
      },
      Chinese: {
        email: `主题：合作邀约 — Ktech Solar x ${kolName}

${kolName}团队你们好，

我一直在关注你们的${platform}频道，对你们的${niche}内容印象深刻。你们在${region}对${niche.toLowerCase()}的真实态度正是我们寻找合作伙伴的标准。

我是Ktech Solar的Eaea——我们生产带集成MPPT和IP65防护的混合和离网太阳能逆变器。我们正在拓展${region}市场，相信你们的受众会真正受益于我们的产品。

我们想寄给你们最新的混合逆变器进行真实评测。没有脚本，没有约束——只需要你们的真实反馈。

方便简单聊聊合作吗？

此致，
Eaea | Ktech Solar
WhatsApp: +86-18914111136
https://www.ktechsolar.com/`,
        whatsapp: `你好${kolName}！👋

我是Ktech Solar的Eaea，很喜欢你在${platform}上的${niche}内容！

我们做混合太阳能逆变器，觉得${region}的受众会感兴趣。想寄一台给你做真实评测——无任何附加条件。

有兴趣聊聊吗？🌞`,
        instagram: `嗨${kolName}！喜欢你的太阳能内容 🔆 想合作——DM详聊！`,
      },
    };

    const langTemplates = templates[language] || templates["English"];
    return langTemplates[channel] || langTemplates["email"];
  };

  const handleGenerate = async () => {
    if (!selectedKol) return;
    setGenerating(true);
    setGenerationError(false);
    setResult("");
    try {
      const kol = kols.find(k => k.id === selectedKol);
      const channel = selectedChannel || "email";
      await new Promise(r => setTimeout(r, 800));
      const content = generateStaticContent(kol, channel);
      setResult(content);
      setGeneratedEmailId("demo-" + Date.now());
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
    const kol = kols.find(k => k.id === selectedKol);
    const contacts = getKolContacts(kol || {});
    const emailContacts = contacts.filter(c => c.type === "email");
    const to = emailContacts.map(c => c.value).join(",");
    const kolName = kol?.name || "KOL";
    const subjectLine = result.match(/Subject:\s*(.+)/i);
    const subject = subjectLine ? subjectLine[1].trim() : getSubjectFallback(kolName);
    const bodyText = result.replace(/Subject:\s*.+\n?/i, "").trim();
    return { to, subject, body: bodyText, cc: ccEmails || "" };
  };

  const handleSendClick = () => {
    if (!result) { alert("Please generate content first."); return; }
    if (!selectedKol) { alert("Please select a KOL first."); return; }
    setShowSendModal(true);
  };

  // --- Send via different channels ---
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
    const kol = kols.find(k => k.id === selectedKol);
    const contacts = getKolContacts(kol || {});
    const waContacts = contacts.filter(c => c.type === "whatsapp");
    if (waContacts.length === 0) { alert("No WhatsApp number found for this KOL."); return; }
    const phone = waContacts[0].value.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(result);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setShowSendModal(false);
  };

  const openInstagram = () => {
    const kol = kols.find(k => k.id === selectedKol);
    const contacts = getKolContacts(kol || {});
    const igContacts = contacts.filter(c => c.type === "instagram");
    if (igContacts.length === 0) { alert("No Instagram handle found for this KOL."); return; }
    const username = igContacts[0].value.replace(/^@/, "");
    // Copy message to clipboard since Instagram DM doesn't support pre-fill via URL
    navigator.clipboard.writeText(result).catch(() => {});
    window.open(`https://www.instagram.com/${username}/`, "_blank");
    setShowSendModal(false);
    setTimeout(() => {
      alert("Instagram profile opened. Message copied to clipboard — paste it (Ctrl+V) in the DM chat.");
    }, 1000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    setShowSendModal(false);
  };

  const getSelectedKol = () => kols.find(k => k.id === selectedKol);
  const getSelectedKolContacts = () => getSelectedKol() ? getKolContacts(getSelectedKol()) : [];

  // Filter KOLs for search
  const filteredKols = kols.filter(k =>
    k.name.toLowerCase().includes(kolSearch.toLowerCase()) ||
    (k.platform || "").toLowerCase().includes(kolSearch.toLowerCase())
  );

  const selectedKolData = getSelectedKol();
  const selectedKolContacts = getSelectedKolContacts();

  const generateButtonLabel = () => {
    if (selectedChannel === "whatsapp") return "Generate WhatsApp Message";
    if (selectedChannel === "instagram") return "Generate Instagram DM";
    return "Generate Email";
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Outreach Generator</h1>
        <p className="text-[var(--muted)] mt-1">Generate personalized outreach messages for any channel</p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <div className="space-y-4">
          {/* Custom KOL Selector with contact icons */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Select KOL *</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowKolDropdown(!showKolDropdown)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50"
              >
                {selectedKolData ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{selectedKolData.name}</span>
                    <span className="text-[var(--muted)]">({selectedKolData.platform})</span>
                    {selectedKolContacts.map((c, i) => (
                      <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ${contactColor(c.type)}`} title={c.label}>
                        <ContactIcon type={c.type} />
                      </span>
                    ))}
                    {selectedKolContacts.length === 0 && (
                      <span className="text-xs text-red-400">No contacts</span>
                    )}
                  </div>
                ) : (
                  <span className="text-[var(--muted)]">Choose a KOL...</span>
                )}
                <ChevronDown className="w-4 h-4 text-[var(--muted)] flex-shrink-0" />
              </button>

              {showKolDropdown && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search KOL..."
                      value={kolSearch}
                      onChange={(e) => setKolSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-56">
                    {filteredKols.length === 0 ? (
                      <div className="p-3 text-sm text-gray-400 text-center">No KOLs found</div>
                    ) : (
                      filteredKols.map(k => {
                        const contacts = getKolContacts(k);
                        return (
                          <button
                            key={k.id}
                            onClick={() => handleKolSelect(k.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-blue-50 transition-colors ${selectedKol === k.id ? "bg-blue-50" : ""}`}
                          >
                            <span className="font-medium text-gray-900 flex-shrink-0">{k.name}</span>
                            <span className="text-gray-400 text-xs flex-shrink-0">({k.platform})</span>
                            <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                              {contacts.map((c, i) => (
                                <span key={i} className={`inline-flex items-center p-1 rounded ${contactColor(c.type)}`} title={`${c.type}: ${c.label}`}>
                                  <ContactIcon type={c.type} />
                                </span>
                              ))}
                              {contacts.length === 0 && (
                                <span className="text-xs text-red-300">No contacts</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Channel Selector */}
          {selectedKolData && selectedKolContacts.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Contact Channel</label>
              <div className="flex gap-2 flex-wrap">
                {selectedKolContacts.map((c, i) => {
                  const isSelected = selectedChannel === c.type;
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedChannel(c.type); setResult(""); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              This KOL has no contact info. Go to KOL Discovery to add email, WhatsApp, or Instagram.
            </div>
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
                <option value="gift">Gift (free products)</option>
                <option value="paid">Paid collaboration</option>
                <option value="commission">Commission-based</option>
                <option value="pending">Pending / To be discussed</option>
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
            {generating ? <><Sparkles className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> {generateButtonLabel()}</>}
          </button>
        </div>
      </div>

      {/* Generated Result */}
      {result && !generationError && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Generated {selectedChannel === "whatsapp" ? "WhatsApp Message" : selectedChannel === "instagram" ? "Instagram DM" : "Email"}
            </h2>
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
          {selectedChannel === "whatsapp" && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <p className="font-medium text-green-900">Will send via WhatsApp to: {selectedKolContacts.filter(c => c.type === "whatsapp").map(c => c.label).join(", ")}</p>
            </div>
          )}
          {selectedChannel === "instagram" && (
            <div className="mb-3 p-3 bg-pink-50 border border-pink-200 rounded-lg text-sm">
              <p className="font-medium text-pink-900">Will send via Instagram DM to: {selectedKolContacts.filter(c => c.type === "instagram").map(c => c.label).join(", ")}</p>
              <p className="text-pink-700 mt-1 text-xs">Message will be copied to clipboard for pasting in DM</p>
            </div>
          )}
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{result}</pre>
          </div>
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

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Send via {channelLabels[selectedChannel] || "Email"}</h2>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            {selectedChannel === "email" && (
              <div className="space-y-3">
                <button onClick={openFoxmail}
                  className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition-colors text-left bg-blue-50/50">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Foxmail</p>
                    <p className="text-xs text-gray-500">Open in Foxmail client</p>
                  </div>
                  <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Default</span>
                </button>
                <button onClick={handleCopyBody}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Copy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Copy to Clipboard</p>
                    <p className="text-xs text-gray-500">Copy content, paste manually</p>
                  </div>
                </button>
              </div>
            )}

            {selectedChannel === "whatsapp" && (
              <div className="space-y-3">
                <button onClick={openWhatsApp}
                  className="w-full flex items-center gap-3 px-4 py-3 border-2 border-green-400 rounded-lg hover:bg-green-50 transition-colors text-left bg-green-50/50">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Open WhatsApp</p>
                    <p className="text-xs text-gray-500">Send message via WhatsApp Web/App</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Go</span>
                </button>
                <button onClick={handleCopyBody}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Copy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Copy to Clipboard</p>
                    <p className="text-xs text-gray-500">Copy message, paste manually</p>
                  </div>
                </button>
              </div>
            )}

            {selectedChannel === "instagram" && (
              <div className="space-y-3">
                <button onClick={openInstagram}
                  className="w-full flex items-center gap-3 px-4 py-3 border-2 border-pink-400 rounded-lg hover:bg-pink-50 transition-colors text-left bg-pink-50/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Open Instagram</p>
                    <p className="text-xs text-gray-500">Open profile, message copied to clipboard</p>
                  </div>
                  <span className="ml-auto text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">Go</span>
                </button>
                <button onClick={handleCopyBody}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors text-left">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Copy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Copy to Clipboard</p>
                    <p className="text-xs text-gray-500">Copy message, paste manually</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
