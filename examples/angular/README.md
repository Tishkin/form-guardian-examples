# Angular Example

This example demonstrates how to use `@form-guardian/dom` with Angular.

## Features

- Form autosave with debouncing
- Automatic draft restoration
- Manual restore and clear functionality
- Draft status display

## Running

```bash
pnpm install
pnpm start
```

The example will open at `http://localhost:4200`

## Note

Make sure to initialize the autosave after the view is initialized. The example uses `setTimeout` to ensure the form element is available in the DOM.

