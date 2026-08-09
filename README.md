<div align="center">

# 🪙 StorEx — Wallet-as-a-Service for Crypto Trading

**Your brokerage. Your exchange. Your money.**

A full-stack, Solana-native Wallet-as-a-Service platform — sign in with Google, get a secure wallet instantly, watch your portfolio live, and swap tokens at the best on-chain rates. No seed phrases, no browser extensions, no friction.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![Jupiter](https://img.shields.io/badge/Jupiter-Swap_API-orange)](https://station.jup.ag/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

</div>

---

## ✨ Overview

**StorEx** is a Wallet-as-a-Service (WaaS) platform that gives every user a fully custodial Solana wallet the moment they sign in — no browser extensions, no seed phrases to lose, no onboarding friction. Under the hood it combines **NextAuth**, **Prisma + PostgreSQL**, **AES-256-GCM encryption**, and the **Solana** and **Jupiter Aggregator** APIs to deliver a real, working crypto brokerage experience: live balances, live pricing, and best-rate token swaps, all wrapped in a clean, modern UI.

It's built the way a production fintech product would be — typed end-to-end, validated at every boundary, and designed to grow into a full centralized exchange.

## 🚀 Features

| | Feature | Details |
|---|---|---|
| 🔐 | **One-tap Google Sign-In** | Secure OAuth authentication via NextAuth — no passwords to manage |
| 🪪 | **Instant Wallet Provisioning** | A real Solana keypair is generated automatically for every new user on first login |
| 🔒 | **Bank-grade Key Security** | Private keys are never stored in plaintext — encrypted at rest with **AES-256-GCM** (unique IV + auth tag per wallet) |
| 📊 | **Live Portfolio Dashboard** | Real-time on-chain balances for SOL and SPL tokens, fetched directly from the Solana RPC |
| 💹 | **Live Market Pricing** | USD pricing streamed in via the Jupiter Price API |
| 🔁 | **Best-Rate Token Swaps** | One-click swaps powered by the **Jupiter Aggregator v2** — quote, sign, and execute, all server-side |
| 🧾 | **End-to-End Type Safety** | Runtime request validation with **Zod** on every API route |
| 🇮🇳 | **Fiat-ready Architecture** | An INR wallet model is already baked into the data layer, paving the way for fiat on/off-ramps |
| 🎨 | **Sleek, Modern UI** | Built with Tailwind CSS for a fast, responsive experience |

## 🛣️ Roadmap

StorEx is under active development. Here's what's coming next:

- [ ] 📤 **Send & Receive** — peer-to-peer token transfers, directly from your dashboard *(coming soon)*
- [ ] 💱 **Fiat On/Off-Ramp** — deposit and withdraw INR seamlessly
- [ ] 🕘 **Transaction History** — a full, searchable log of every swap and transfer
- [ ] 🌐 **Multi-chain Support** — expanding beyond Solana
- [ ] 🔑 **More Auth Providers** — email/password and external wallet connect
- [ ] 🔔 **Real-time Notifications** — price alerts and transaction updates

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | NextAuth (Google OAuth) |
| Database / ORM | PostgreSQL + Prisma 7 |
| Blockchain | Solana (`@solana/kit`, `@solana-program/token`) |
| Swap Engine | Jupiter Aggregator API v2 |
| Validation | Zod |
| Encryption | Node.js `crypto` (AES-256-GCM) |

## 🏗️ How It Works

1. **Sign in** with Google — StorEx creates your account on first login.
2. **Wallet generated** — a fresh Solana keypair is created, and the private key is encrypted (AES-256-GCM) before it ever touches the database.
3. **Dashboard loads** — your live SOL / USDC / USDT balances and their USD value are pulled from the chain and priced via Jupiter.
4. **Request a swap** — pick a token pair and amount; StorEx fetches the best route and quote from Jupiter.
5. **Sign & execute** — your key is decrypted in-memory, the transaction is signed server-side, submitted to Jupiter for execution, and the signature is returned — never exposing your private key to the client.

## 📂 Project Structure

```
StorEx-Waas/
└── frontend/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/   # NextAuth handler
    │   │   ├── quote/                # Get a swap quote (Jupiter)
    │   │   ├── swap/                 # Sign & execute a swap
    │   │   └── tokens/               # Fetch live token balances
    │   ├── components/               # UI components (Hero, Header, Swap, TokenList, ...)
    │   ├── dashboard/                # User dashboard
    │   ├── db/                       # Prisma client
    │   ├── hooks/                    # React hooks (useTokens, ...)
    │   ├── lib/                      # Auth config, RPC/constants, token selects
    │   ├── schemas/                  # Zod validation schemas
    │   └── utils/                    # Wallet creation & encryption helpers
    └── prisma/
        └── schema.prisma             # Data models (User, solWallet, inrWallet)
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/)
- A PostgreSQL database
- A [Google OAuth](https://console.cloud.google.com/apis/credentials) Client ID & Secret
- A [Jupiter Aggregator](https://station.jup.ag/) API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd StorEx-Waas/frontend

# Install dependencies
pnpm install
```

### Configure environment variables

Copy the example file and fill in your own values:

```bash
cp example.env .env
```

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret from Google Cloud Console |
| `DATABASE_URL` | PostgreSQL connection string |
| `JUP_AG_API_KEY` | API key for the Jupiter Aggregator |
| `ENCRYPTION_KEY` | 32-byte hex key used to encrypt wallet private keys |
| `NEXTAUTH_URL` | Base URL of your app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret used to sign NextAuth session tokens |

### Set up the database

```bash
pnpm prisma migrate dev
```

### Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in to see your wallet come to life. 🎉

## 🔐 Security

- Private keys are **encrypted at rest** using AES-256-GCM with a unique IV and authentication tag per wallet — plaintext keys are never persisted.
- Wallet decryption and transaction signing happen **entirely server-side**; the client never sees a private key.
- Every API route is guarded with **runtime validation (Zod)** and **session checks** before touching a wallet.
- Swap execution is a two-step, verifiable flow (quote → sign → execute) to minimize exposure to malformed or stale transactions.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues) or open a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ on Solana

</div>