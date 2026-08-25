# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] — 2026-08-25

### Changed

- **Renamed project** from "AI KOL Outreach Assistant" to "AI Outreach Hub" for general-purpose use.
- **Route restructuring**: `/kols` → `/contacts`, `/email` → `/outreach`.
- **Brand generalization**: all hardcoded company/product info moved to `src/config/brand.config.ts`.
- **Template system**: message templates extracted to `src/config/templates.config.ts` with `{variable}` syntax.
- **AI prompts**: centralized in `src/config/prompts.config.ts`, removed industry-specific references.
- **Demo data**: replaced 19 solar-industry contacts with cross-industry examples (tech, fashion, education, travel, etc.).

### Removed

- All hardcoded references to specific companies, phone numbers, and personal information.
- Industry-specific fallback text ("solar energy", "Ktech Solar", etc.).

### Added

- Multi-language template support with variable substitution.
- Association-specific email templates.
- `.env.production` to `.gitignore`.

## [0.1.1] — 2026-08-24

### Fixed

- Dashboard and Sent page data synchronization.
- Message channel classification using explicit `channel` field.

## [0.1.0] — 2026-08-18

### Added

- Initial MVP release.
- Contact management with import from CSV/Excel.
- AI profile analysis via GPT-4o.
- Multilingual outreach message generator (Email, WhatsApp, Instagram).
- Batch message generation.
- Campaign tracker with pipeline stats.
- GitHub Pages deployment workflow.
