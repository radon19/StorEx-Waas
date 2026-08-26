<div align="center">

<img src="https://github.com/radon19/StorEx-Waas/blob/9f8b4beebfa8f5f6334da5cc3cca0c441bd161f1/frontend/app/icon.svg" alt="StorEx Logo" width="80" />

# StorEx

### Institutional-Grade Wallet Infrastructure for Digital Asset Trading

**Zero-friction onboarding. Server-side key management. Best-execution swaps.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white&style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white&style=flat-square)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square)](https://www.postgresql.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white&style=flat-square)](https://solana.com/)
[![Jupiter](https://img.shields.io/badge/Jupiter_Aggregator-v2-orange?style=flat-square)](https://station.jup.ag/)

---

StorEx is a **Wallet-as-a-Service (WaaS) platform** that eliminates the structural friction of self-custody without sacrificing security. Users authenticate via OAuth, receive a production-grade Solana wallet in milliseconds, and execute on-chain operations — all through a single, unified interface.

Built for teams shipping real financial infrastructure.

</div>

---

## Core Value Proposition

| Problem | StorEx Solution |
|---|---|
| Self-custody UX is hostile to mainstream users | OAuth-first onboarding — no seed phrases, no extensions, no 12-word recovery |
| Centralized exchanges require trust in opaque custodians | Server-side AES-256-GCM encryption — private keys never reach the browser |
| Token swaps require manual DEX navigation | Jupiter Aggregator v2 integration — best-rate execution with configurable slippage |
| Onboarding new users to crypto takes days | Wallet provisioning in <100ms on first sign-in |
| Cross-platform wallet management is fragmented | Unified dashboard — portfolio, swap, send, receive in a single interface |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript 5       │
├─────────────────────────────────────────────────────────────────┤
│                        API LAYER                                │
│   NextAuth (Google OAuth) · Zod Validation · Session Guards    │
├─────────────────────────────────────────────────────────────────┤
│                     SERVICES LAYER                              │
│   Wallet Provisioning · Transaction Signing · Jupiter Routing  │
├─────────────────────────────────────────────────────────────────┤
│                      DATA LAYER                                 │
│   PostgreSQL · Prisma 7 · AES-256-GCM Encryption               │
├─────────────────────────────────────────────────────────────────┤
│                    BLOCKCHAIN LAYER                             │
│   Solana RPC (Alchemy) · Jupiter v2 · SPL Token Program        │
└─────────────────────────────────────────────────────────────────┘
```

## Feature Set

### Authentication & Identity

- **OAuth 2.0 (Google)** — One-tap sign-in via NextAuth v4. Zero passwords, zero credential management.
- **Automatic Wallet Provisioning** — Ed25519 keypair generated server-side on first authentication via `@solana/kit`. No user action required.

### Portfolio Management

- **Real-Time Balance Tracking** — Live SOL and SPL token balances queried directly from Solana RPC (Alchemy).
- **USD Valuation Engine** — Jupiter Price API v3 provides real-time fiat pricing across all held assets.
- **Token Discovery** — Automatic detection of associated token accounts via ATA PDA derivation.

### Trading

- **Best-Execution Swaps** — Jupiter Aggregator v2 finds optimal routing across Solana DEXs. Two-phase flow: order lock → transaction signing → execution.
- **Configurable Slippage** — 0.1%, 0.5%, 1%, 3% tolerance levels with real-time quote preview.
- **Server-Side Transaction Signing** — Private key decrypted in-memory for <50ms signing window. Never exposed to client.

### Transfers

- **SOL & SPL Transfers** — Send any supported token to any Solana address.
- **Automatic ATA Creation** — Destination associated token account created on-demand if it doesn't exist.
- **Transaction Verification** — Solscan integration for real-time transaction status and audit trail.

### Security

- **AES-256-GCM Encryption** — Each wallet encrypted with a unique 16-byte IV and GCM authentication tag. No shared keys.
- **Session-Bound Operations** — Every API route validates NextAuth session before wallet access.
- **Input Validation** — Zod schemas enforce strict type checking at every API boundary.
- **Public Key Verification** — Send operations verify wallet ownership against database record.

## Supported Assets

| Asset | Mint | Decimals | Type |
|---|---|---|---|
| SOL | `So11111111111111111111111111111111111111112` | 9 | Native |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | 6 | SPL |
| USDT | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` | 6 | SPL |

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | Next.js 16 (App Router) | Server components, API routes, edge-ready |
| **UI** | React 19 + Tailwind CSS 4 | Component composition, utility-first styling |
| **Language** | TypeScript 5 (strict) | End-to-end type safety, compile-time guarantees |
| **Auth** | NextAuth v4 (Google OAuth) | Production-grade session management |
| **Database** | PostgreSQL + Prisma 7 | Relational integrity, type-safe ORM, connection pooling |
| **Blockchain** | Solana (`@solana/kit` v8) | High throughput, low latency, SPL token support |
| **DEX** | Jupiter Aggregator v2 | Optimal swap routing across Solana liquidity |
| **Pricing** | Jupiter Price API v3 | Real-time USD valuations |
| **Encryption** | Node.js `crypto` (AES-256-GCM) | NIST-approved authenticated encryption |
| **Validation** | Zod v4 | Runtime schema validation at API boundaries |

## Project Structure

```
StorEx/
└── frontend/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/    # OAuth handler + wallet provisioning
    │   │   ├── tokens/                # On-chain balance queries
    │   │   ├── quote/                 # Jupiter swap quotes
    │   │   ├── swap/                  # Transaction signing + execution
    │   │   └── send/                  # SOL/SPL transfers
    │   ├── components/                # UI component library
    │   ├── hooks/                     # Custom React hooks (useTokens, useQuote)
    │   ├── lib/                       # Auth config, RPC client, token registry
    │   ├── schemas/                   # Zod validation schemas
    │   └── utils/                     # Crypto, wallet generation, formatters
    └── prisma/
        └── schema.prisma              # Data models (User, solWallet, inrWallet)
```

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (package manager)
- **PostgreSQL** (local or cloud)
- **Google OAuth** credentials ([Console](https://console.cloud.google.com/apis/credentials))
- **Jupiter Aggregator** API key ([Station](https://station.jup.ag/))
- **Alchemy** Solana RPC endpoint ([Dashboard](https://dashboard.alchemy.com/))

### Installation

```bash
git clone <repository-url>
cd StorEx/frontend
pnpm install
```

### Environment Configuration

```bash
cp example.env .env
```

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `DATABASE_URL` | PostgreSQL connection string |
| `JUP_AG_API_KEY` | Jupiter Aggregator API key |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM |
| `ALCHEMY_RPC_KEY` | Solana RPC endpoint URL |
| `NEXTAUTH_URL` | Application base URL |
| `NEXTAUTH_SECRET` | NextAuth session signing secret |

### Database Setup

```bash
pnpm prisma migrate dev
```

### Development

```bash
pnpm dev
```

Navigate to `http://localhost:3000`.

## Security Model

```
┌──────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
├──────────────────────────────────────────────────────────────┤
│  1. TRANSPORT    │  HTTPS enforced, NextAuth session tokens  │
│  2. AUTH         │  OAuth 2.0, server-side session validation│
│  3. VALIDATION   │  Zod schemas on every API boundary        │
│  4. ENCRYPTION   │  AES-256-GCM, unique IV + auth tag/wallet │
│  5. ISOLATION    │  Private keys: decrypted in-memory only   │
│  6. VERIFICATION │  Public key ownership checks on sends     │
└──────────────────────────────────────────────────────────────┘
```

**Key Security Properties:**

- Private keys are **never stored in plaintext** — encrypted at rest with AES-256-GCM
- Decryption occurs **only in server memory** during transaction signing (<50ms window)
- The browser **never receives or handles** private key material
- Every wallet operation requires a **valid NextAuth session**
- All external inputs are **Zod-validated** before processing

## Roadmap

- [ ] **Withdraw** — External wallet withdrawal with address validation
- [ ] **Fiat On/Off-Ramp** — INR deposit and withdrawal integration
- [ ] **Transaction History** — Searchable audit log with export capabilities
- [ ] **Multi-Chain** — Ethereum, Polygon, and BSC support
- [ ] **Portfolio Analytics** — Historical performance, PnL tracking, tax reporting
- [ ] **API Access** — Programmatic wallet management for institutional clients
- [ ] **Compliance** — KYC/AML integration, transaction monitoring, regulatory reporting

## Contributing

We welcome contributions from experienced engineers. StorEx is a production-grade system — all contributions must meet our quality bar.

### Development Standards

- **Type Safety** — TypeScript strict mode. No `any` types.
- **Validation** — All inputs validated with Zod at API boundaries.
- **Security** — Never log, expose, or commit sensitive material.
- **Testing** — Write tests for new functionality. Verify before submitting.
- **Code Style** — Follow existing patterns. Consistency over creativity.

### Workflow

```bash
# Fork and clone
git clone <your-fork-url>
cd StorEx/frontend

# Create feature branch
git checkout -b feature/your-feature

# Make changes, verify
pnpm lint
pnpm build

# Commit and push
git commit -m "feat: description of change"
git push origin feature/your-feature

# Open Pull Request
```

## License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

**Built for teams building the future of finance.**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com)

</div>
