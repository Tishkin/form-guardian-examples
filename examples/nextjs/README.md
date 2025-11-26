# Next.js Example

This example demonstrates how to use `form-guardian` with Next.js and SSR.

## Examples Included

- **React Hook Form** - Integration with React Hook Form
- **Formik** - Integration with Formik
- **Plain Form** - Plain React form with `useFormAutosave` hook

## Running

```bash
pnpm install
pnpm dev
```

The example will open at `http://localhost:3000`

## Note

Since `form-guardian` uses IndexedDB which is only available in the browser, make sure to use the `'use client'` directive for components that use form-guardian hooks.

