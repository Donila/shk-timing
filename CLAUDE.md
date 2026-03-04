# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve       # Dev server with hot reload
npm run build       # Production build
npm run lint        # ESLint
npm run test:unit   # Unit tests (Mocha + Chai)
npm run test:e2e    # E2E tests (Cypress)
```

All scripts use `NODE_OPTIONS=--openssl-legacy-provider` (required by the older Vue CLI version).

## Architecture

Vue.js 2 SPA — a military attack timing calculator for a strategy game. Users configure multiple armies with travel times and speeds; the app calculates when to launch each army so they all arrive simultaneously.

**Stack:** Vue 2.6 + Vue Router + Vue i18n (EN/DE/PL/RU) + Vuetify 1.x + Moment.js

### Key files

- `src/store.js` — custom (non-Vuex) reactive store; manages the armies array and attack state
- `src/router.js` — three routes: `/`, `/attack/:atk` (URL-encoded config), `/about`
- `src/helpers/attack.js` — attack data model
- `src/helpers/army.js` — army model; speed multipliers (1–6×)
- `src/helpers/time.js` — core timing formula: `fullTime = Math.floor(army.time / army.speed) + army.delay`
- `src/helpers/urlConverter.js` — serializes/deserializes attack configs into URL params for sharing
- `src/helpers/discordBotArmiesParser.js` — parses army data pasted from Discord bot output
- `src/components/Main.vue` — primary UI for building an attack
- `src/components/ArmiesTable.vue` — editable table of armies
- `src/components/TimeX.vue` — displays calculated launch times
- `src/plugins/i18n.js` — i18n setup

### URL sharing

`/attack/:atk` routes hold a serialized attack configuration. `urlConverter.js` encodes/decodes army arrays to/from this param so users can share links.
