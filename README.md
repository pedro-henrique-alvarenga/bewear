# BEWEAR

This repository is an **Ecommerce application** built with **[Next.js](https://nextjs.org/)** and **[PostgreSQL](https://www.postgresql.org/)**, following best practices for modern architecture, performance, and scalability.

The app provides full functionality for authentication, product catalog, addresses management, shopping cart, and payment integration with **[Stripe](https://stripe.com/)**.

🌍 The application is deployed at: **[https://bewear-sepia.vercel.app](https://bewear-sepia.vercel.app)**

> **Note:** This application was developed following mobile-first principles. A responsive version for desktop browsers has not yet been created.

---

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/) – React framework for modern web apps
- [ESLint](https://eslint.org/) – Code linting
- [Prettier](https://prettier.io/) – Code formatting
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) – Pre-built React components
- [Drizzle ORM](https://orm.drizzle.team/) – Type-safe ORM for databases
- [Neon PostgreSQL](https://neon.com/) – Cloud-hosted PostgreSQL database
- [React Hook Form](https://react-hook-form.com/) – Form management
- [Zod](https://zod.dev/) – Schema validation
- [Better Auth](https://better-auth.com/) – Authentication with email and Google
- [TanStack React Query](https://tanstack.com/query/latest) – Data fetching & mutations
- [Stripe](https://stripe.com/docs) – Payment processing
- [Vercel](https://vercel.com/) – Deployment platform

---

## 📖 Summary

This project implements a **full-featured Ecommerce platform** with:

- Product catalog
- Dynamic shopping cart
- Shipping addresses management
- Authentication via email and Google
- Secure payments with Stripe
- Admin dashboard for management

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database (local, via [Docker](https://www.docker.com/), or via [Neon](https://neon.com/))
- [Stripe](https://stripe.com/) account for payments
- [Google Cloud Platform](https://cloud.google.com/) account to configure OAuth (Google login)

### Setup

```bash
# Clone the repository
git clone https://github.com/pedro-henrique-alvarenga/bewear.git
cd bewear

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# edit the .env file with your credentials (Stripe, NeonDB, Google OAuth, etc.)

# Run database migrations
npm run drizzle-kit push

# Start the development server
npm run dev
```

The app will be running at:
👉 `http://localhost:3000`

### `.env` example

```bash
# Base app URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database (NeonDB or local)
DATABASE_URL=""

# Better Auth
BETTER_AUTH_SECRET=""

# Google OAuth (Google login)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe - payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```
