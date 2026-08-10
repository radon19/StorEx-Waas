<div align="center">

# 🪙 StorEx — Wallet-as-a-Service for Crypto Trading

**Your brokerage. Your exchange. Your money.**

Sign in with Google. Get a real Solana wallet in milliseconds. Trade at the best on-chain rate. No seed phrases, no browser extensions, no 12-word paper cuts — just a fintech-grade custodial trading experience built from scratch, end to end.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![Jupiter](https://img.shields.io/badge/Jupiter-Swap_API_v2-orange)](https://station.jup.ag/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

</div>

---

## ✨ Why StorEx

Self-custody wallets are secure but hostile to newcomers — seed phrases, extensions, gas token juggling. Centralized exchanges are easy but opaque. **StorEx is built to close that gap**: every user gets a genuine, non-custodial-grade Solana wallet the instant they sign in with Google, with the private key sealed behind server-side AES-256-GCM encryption and never once exposed to the browser.

This isn't a mock-up or a demo wallet — it's a working pipeline: real keypairs generated with `@solana/kit`, real balances pulled live from the chain, real USD pricing from Jupiter, and real swaps quoted, signed, and executed through the Jupiter Aggregator v2. It's engineered the way a production fintech product has to be: typed end-to-end, validated at every boundary, and structured to grow into a full exchange.

## 🚀 Features

| | Feature | Details |
|---|---|---|
| 🔐 | **One-Tap Google Sign-In** | OAuth via NextAuth — zero passwords, zero friction |
| 🪪 | **Instant Wallet Provisioning** | A genuine Solana keypair is minted automatically on a user's first login |
| 🔒 | **Bank-Grade Key Security** | Private keys are never stored in plaintext — sealed at rest with **AES-256-GCM**, unique IV + auth tag per wallet |
| 📊 | **Live Portfolio Dashboard** | Real-time SOL and SPL token balances, read straight from the Solana RPC |
| 💹 | **Live Market Pricing** | USD valuations streamed in from the Jupiter Price API |
| 🔁 | **Best-Rate Token Swaps** | One-click swaps via the **Jupiter Aggregator v2** — quote, sign, and execute, entirely server-side |
| 🧾 | **End-to-End Type Safety** | Every API boundary is runtime-validated with **Zod**, no unchecked input reaches the database or the chain |
| 🇮🇳 | **Fiat-Ready Data Layer** | An INR wallet model is already built in, paving the way for real fiat on/off-ramps |
| 🎨 | **Sleek, Modern UI** | Tailwind CSS 4, fast and responsive by default |

## 🛣️ Roadmap

StorEx is under active development. Here's what's next:

- [ ] 📤 **Send & Receive** — peer-to-peer token transfers straight from the dashboard *(coming soon)*
- [ ] 💱 **Fiat On/Off-Ramp** — deposit and withdraw INR seamlessly
- [ ] 🕘 **Transaction History** — a full, searchable log of every swap and transfer
- [ ] 🌐 **Multi-Chain Support** — expanding beyond Solana
- [ ] 🔑 **More Auth Providers** — email/password and external wallet connect
- [ ] 🔔 **Real-Time Notifications** — price alerts and transaction updates

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| Language | TypeScript, end to end |
| Styling | Tailwind CSS 4 |
| Authentication | NextAuth (Google OAuth) |
| Database / ORM | PostgreSQL + Prisma 7 |
| Blockchain | Solana — `@solana/kit`, `@solana-program/token` |
| Swap Engine | Jupiter Aggregator API v2 (order → sign → execute) |
| Pricing | Jupiter Price API v3 |
| Validation | Zod, on every API route |
| Encryption | Node.js `crypto` — AES-256-GCM |
| HTTP Client | Axios |
| Package Manager | pnpm |

## 🏗️ How It Works

1. **Sign in** with Google — StorEx provisions the account on first login.
2. **Wallet generated** — a fresh Solana keypair is created with `@solana/kit`, and the private key is AES-256-GCM encrypted before it ever touches Postgres.
3. **Dashboard loads** — live SOL / SPL balances and their USD value are pulled from the chain and priced via Jupiter.
4. **Request a swap** — pick a token pair and amount; StorEx fetches the best route and quote from Jupiter's `/order` endpoint.
5. **Sign & execute** — the key is decrypted in-memory server-side only, the transaction is partially signed, submitted to Jupiter's `/execute` endpoint, and the signature is returned. The private key never reaches the client, not even for a millisecond.

## 📂 Project Structure

```
StorEx-Waas/
└── frontend/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/   # NextAuth handler + wallet provisioning on sign-in
    │   │   ├── quote/                # Fetch a live swap quote (Jupiter)
    │   │   ├── swap/                 # Sign & execute a swap (order → sign → execute)
    │   │   └── tokens/                # Fetch live on-chain token balances
    │   ├── components/               # UI components (Hero, Header, Swap, TokenList, Assets, ...)
    │   ├── dashboard/                # User dashboard
    │   ├── db/                       # Prisma client singleton
    │   ├── hooks/                    # React hooks (useTokens, useQuote)
    │   ├── lib/                      # Auth config, RPC client, supported tokens, constants
    │   ├── schemas/                  # Zod validation schemas
    │   └── utils/                    # Wallet generation, AES-256-GCM crypto, swap service
    └── prisma/
        └── schema.prisma             # Data models — User, solWallet, inrWallet
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io/)
- A PostgreSQL database
- A [Google OAuth](https://console.cloud.google.com/apis/credentials) Client ID & Secret
- A [Jupiter Aggregator](https://station.jup.ag/) API key
- A Solana RPC endpoint (e.g. from [Alchemy](https://www.alchemy.com/))

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
| `ALCHEMY_RPC_KEY` | Solana RPC endpoint URL used for balance reads |
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

Open [http://localhost:3000](http://localhost:3000), sign in, and watch your wallet come to life. 🎉

## 🔐 Security

- Private keys are **encrypted at rest** with AES-256-GCM, a unique IV and authentication tag per wallet — plaintext keys are never persisted.
- Decryption and transaction signing happen **entirely server-side**; the client never receives a private key.
- Every API route runs **runtime validation (Zod)** and a **session check** before it touches a wallet.
- Swap execution is a verifiable two-step flow — quote, then sign-and-execute — to minimize exposure to malformed or stale transactions.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Check the [issues page](../../issues) or open a pull request.

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