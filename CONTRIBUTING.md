# Contributing to AI Outreach Hub

Thanks for your interest in contributing! Here's how you can help.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](../../issues) to avoid duplicates.
2. Open a new issue with the **Bug Report** template.
3. Include steps to reproduce, expected behavior, and actual behavior.

### Suggesting Features

1. Open an issue with the **Feature Request** template.
2. Describe the problem you're trying to solve and your proposed solution.
3. Label it as `enhancement`.

### Pull Requests

1. Fork the repo and create a branch from `main`.
2. Follow the existing code style (TypeScript, Tailwind CSS conventions).
3. Test your changes locally with `npm run build`.
4. Open a PR with a clear description of what changed and why.
5. Keep PRs focused — one feature or fix per PR.

## Development Setup

```bash
git clone https://github.com/Xumenghua1110/ai-outreach-hub.git
cd ai-outreach-hub
npm install
cp .env.local.example .env.local
# Add your OPENAI_API_KEY to .env.local
npx prisma generate
npx prisma db push
npm run dev
```

## Code Conventions

- **TypeScript** — all new code must be typed.
- **Components** — functional components with hooks, no class components.
- **Styling** — Tailwind CSS utility classes. Use CSS variables from `globals.css` for theming.
- **Configuration** — brand-specific content goes in `src/config/`, never hardcoded in components.
- **Templates** — use `{variable}` syntax for template strings.

## Adding a New Language

1. Add the language to `languages` array in `src/config/brand.config.ts`.
2. Add translations in `src/config/templates.config.ts` for all channels (email, whatsapp, instagram).
3. Add the language option to the `<select>` in `src/app/outreach/page.tsx`.

## Adding a New Contact Type

1. Add the type to `contactTypes` array in `src/config/brand.config.ts`.
2. Add an icon mapping in the contacts list component.

## Questions?

Open a [discussion](../../discussions) or reach out via issues.
