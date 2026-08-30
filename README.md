This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, copy the local environment file and run the development server:

```bash
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Client

The generated client calls the published development API directly. To authenticate locally, call `POST /v1/auth/dev-sessions` with an existing dev member UUID, then set the returned `data.accessToken` in `.env.local`:

```bash
NEXT_PUBLIC_DEV_ACCESS_TOKEN=eyJ...
```

Restart `pnpm dev` after changing the environment variable. In development, generated browser and server clients attach the token as an `Authorization: Bearer` header only when calling `https://api.dev.moimyeon.plady.io`.

`NEXT_PUBLIC_` values are embedded in the browser bundle. Use this variable only with a development access token, never configure it in production, and never commit the token value or write it to `.env.example`.

Generate the typed Next.js Fetch client and SDK from the published development OpenAPI schema:

```bash
pnpm generate:api
```

Generated files are written to `src/api/generated` and committed to Git. Do not edit them directly; update the OpenAPI schema and regenerate instead.

## Testing

Install the Chromium binary once after installing dependencies:

```bash
pnpm exec playwright install chromium
```

Run the Node unit tests and Chromium component tests together, or run either project separately:

```bash
pnpm test
pnpm test:unit
pnpm test:browser
```

To debug the browser tests in the Vitest Browser Mode UI, run either color-scheme project:

```bash
pnpm test:browser:ui
pnpm test:browser:ui:dark
```

CI environments should install Chromium and its operating-system dependencies with `pnpm exec playwright install --with-deps chromium` before running the tests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
