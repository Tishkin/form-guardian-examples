# Form Guardian Examples

This repository contains examples demonstrating how to use `form-guardian` library with different frameworks and form libraries.

## Examples

- **React** - React examples with Vite (React Hook Form, Formik, and plain React forms)
- **Next.js** - Next.js with SSR examples
- **Vanilla JS** - Pure JavaScript examples using the DOM package
- **Vue** - Vue.js examples
- **Svelte** - Svelte examples
- **Angular** - Angular examples

## Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## Installation

Install dependencies for all examples:

```bash
pnpm install
```

Or install dependencies for a specific example:

```bash
cd examples/react
pnpm install
```

## Running Examples

Each example can be run independently from the root:

```bash
# React (port 3001)
pnpm dev:react

# Next.js (port 3005)
pnpm dev:nextjs

# Vanilla JS (port 3004)
pnpm dev:vanilla

# Vue (port 3002)
pnpm dev:vue

# Svelte (port 3003)
pnpm dev:svelte

# Angular (port 4200)
pnpm dev:angular

# All examples at once (runs all 6 examples in parallel)
pnpm dev:all
```

Or run from the example directory:

```bash
cd examples/react
pnpm dev
```

## Building Examples

```bash
# Build all examples
pnpm build:all

# Build specific example
pnpm build:react
pnpm build:nextjs
pnpm build:vanilla
pnpm build:vue
pnpm build:svelte
pnpm build:angular
```

## Project Structure

```
form-guardian-examples/
├── examples/
│   ├── react/              # React examples with Vite
│   │   ├── src/
│   │   │   ├── examples/   # React Hook Form, Formik, Plain Form
│   │   │   └── App.tsx
│   │   └── package.json
│   ├── nextjs/             # Next.js examples
│   │   ├── app/            # Next.js App Router
│   │   ├── components/      # Example components
│   │   └── package.json
│   ├── vanilla/            # Vanilla JS examples
│   │   ├── main.js         # Main application file
│   │   └── package.json
│   ├── vue/                # Vue.js examples
│   │   ├── src/
│   │   │   └── App.vue
│   │   └── package.json
│   ├── svelte/             # Svelte examples
│   │   ├── src/
│   │   │   └── App.svelte
│   │   └── package.json
│   └── angular/            # Angular examples
│       ├── src/
│       │   └── app/
│       └── package.json
├── package.json
└── pnpm-workspace.yaml
```

## Features Demonstrated

Each example demonstrates:

- **Form autosave** - Automatic saving of form data as user types
- **Draft restoration** - Automatic or manual restoration of saved drafts
- **Draft management** - Clear drafts, check draft status
- **Blacklist/Whitelist** - Exclude or include specific fields from autosave
- **TTL support** - Time-to-live for drafts (optional)
- **Batch saving** - Save changes in batches (optional)

## Libraries Used

- `@form-guardian/core` - Core library (used internally)
- `@form-guardian/dom` - DOM-based autosave (for Vanilla JS, Vue, Svelte, Angular)
- `@form-guardian/react` - React hooks (for React examples)

## Notes

- All examples use IndexedDB for storage, which is only available in the browser
- For Next.js, make sure to use `'use client'` directive for components using form-guardian
- Each example is independent and can be run separately
- Examples use fixed ports to avoid conflicts:
- React: 3001
- Next.js: 3005
- Vanilla JS: 3004
- Vue: 3002
- Svelte: 3003
- Angular: 4200
- When running `dev:all`, all examples start in parallel without opening browsers automatically
