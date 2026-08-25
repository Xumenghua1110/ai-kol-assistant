export const brandConfig = {
  project: {
    name: "AI Outreach Hub",
    tagline: "From Contact to Connection — Powered by AI",
    description: "AI-powered multilingual outreach platform for global BD teams",
    repo: "https://github.com/your-org/outreach-hub",
  },

  brand: {
    companyName: "Your Company",
    website: "https://yourcompany.com",
    productDescription: {
      English: "Your company/product description in English. Customize this in src/config/brand.config.ts",
      Portuguese: "Descrição da sua empresa/produto em português. Personalize em src/config/brand.config.ts",
      Spanish: "Descripción de tu empresa/producto en español. Personaliza en src/config/brand.config.ts",
      Chinese: "你的公司/产品中文描述。请在 src/config/brand.config.ts 中自定义。",
    },
  },

  sender: {
    name: "Your Name",
    email: "you@yourcompany.com",
    title: "Business Development Manager",
    phone: "+1-234-567-8900",
  },

  contactTypes: ["KOL", "Association", "Media", "Distributor", "Installer", "Other"] as const,
  channels: ["email", "whatsapp", "instagram"] as const,
  languages: ["English", "Portuguese", "Spanish", "Chinese"] as const,
};
