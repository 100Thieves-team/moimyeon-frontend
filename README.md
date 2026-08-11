This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Client

Create a local environment file before using the generated API client:

```bash
cp .env.example .env.local
```

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
