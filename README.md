# Dopamine Detox Planner

A web application that generates personalized dopamine detox plans using OpenAI and converts them to downloadable PDFs.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Create personalized dopamine detox plans based on your inputs
- AI-generated content using OpenAI's GPT models
- Download your plan as a PDF
- Light and dark mode support (follows system theme)
- Responsive design for all devices

## Setup

### Prerequisites

- Node.js 18.x or later
- OpenAI API key (for AI-generated content)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note:** If you don't provide an OpenAI API key, the application will fall back to a pre-defined template for the detox plan.

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
