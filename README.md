# Upcover API Supertest Automation

Clean backend API test automation for Upcover using **Jest**, **Supertest**, and **TypeScript**.

Multiple insurance products (**Coalition**, **Viz**, **AHP**, **PPL**, **Cyber**) share the same guest login and base URL. See **[TEST_PLAN.md](./TEST_PLAN.md)** for full coverage, roadmap, and planned referral/endorsement flows.

## Project structure

```
src/
├── core/                      # Shared infrastructure (all products)
│   ├── auth/                  # Guest login + central access token store
│   ├── client/                # Supertest HTTP client (Bearer + base URL)
│   └── config/                # Environment configuration
├── shared/
│   └── data/                  # Cross-product test data (occupations, etc.)
├── products/                  # One folder per insurance product
│   ├── coalition/
│   │   ├── data/              # Payload builders
│   │   ├── services/          # API calls
│   │   └── types/             # Request/response types
│   ├── ahp/
│   ├── ppl/                   # Planned
│   ├── cyber/                 # Planned
│   └── viz/
└── tests/
    ├── auth/                  # Shared guest login tests
    ├── products/              # Product-specific test suites
    │   └── coalition/
    └── setup/                 # Jest global setup
```

## Setup

```bash
cd upcover-api-supertest-automation
npm install
cp .env.example .env
```

## Running tests

```bash
npm test                 # all tests
npm run test:auth        # guest login only
npm run test:coalition   # serial coalition flow (01 QQ → 06 POI)
npm run test:viz         # serial viz flow (01 QQ → 06 POI)
npm run test:ahp         # AHP (when added)
npm run test:ppl         # PPL (when added)
npm run test:cyber       # Cyber (when added)
npm run test:watch       # watch mode
npm run test:report      # run + open HTML report
```

## Authentication flow

All products use the same guest login against `BASE_URL`:

```
GET /auth/guestLogin  →  accessToken  →  authToken.ts  →  Bearer on all requests
```

| File | Role |
|------|------|
| `src/core/auth/authToken.ts` | Central token store |
| `src/core/auth/guestLogin.ts` | Fetches and caches `accessToken` |
| `src/core/client/apiClient.ts` | Attaches `Authorization: Bearer {token}` |
| `src/tests/setup/jest.setup.ts` | Logs in before all tests |

## Covered APIs

| Product | Method | Endpoint | Validations |
|---------|--------|----------|-------------|
| Shared | GET | `/auth/guestLogin` | Returns `accessToken`, stored centrally |
| Coalition | POST | `/coalition/quick-quote` | Status `201`, `policyRequestId` and premium breakdown present |
| Coalition | POST | `/coalition/full-quote` | Status `201`, `id` present; uses `quoteId` from quick quote |
| Coalition | POST | `/coalition/payments` | Annual payment; uses full quote `id` and `clientPayable` |
| Coalition | POST | `/coalition/payments/monthly` | Monthly payment; fresh QQ + FQ with `isMonthlySubscription: true` |
| Coalition | POST | `/coalition/quote-docs/email` | Sends quote docs; uses full quote `id` and client email |
| Coalition | POST | `/coalition/proof-of-insurance/email` | Sends proof of insurance; uses payment `id` and FQ client email |
| Viz | POST | `/viz/reports` | Status `201`, `viz_` id present; occupations + NSW state payload |
| Viz | POST | `/viz/full-quote` | Status `201`; uses `quoteId` and fields mapped from quick quote |
| Viz | POST | `/viz/payments` | Annual payment; uses full quote `id` and `priceBreakdown.clientPayable` |
| Viz | POST | `/viz/payments/monthly` | Monthly payment; uses full quote `id` and `priceBreakdown.monthlyBreakdown.firstInstallmentPayable` |
| Viz | POST | `/viz/quote-docs/email` | Sends quote docs; uses full quote `id` and client email |
| Viz | POST | `/viz/proof-of-insurance/email` | Sends proof of insurance; uses payment `id` and FQ client email |
| AHP | POST | _TBD_ | _Planned — see TEST_PLAN.md_ |
| PPL | POST | _TBD_ | _Planned — see TEST_PLAN.md_ |
| Cyber | POST | _TBD_ | _Planned — see TEST_PLAN.md_ |

Referral and endorsement flows are documented in **[TEST_PLAN.md](./TEST_PLAN.md)** (sections 6–7).

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://dev-api.upcover.com` | API base URL (shared by all products) |
| `REQUEST_TIMEOUT` | `120000` | Request timeout (ms); dev Coalition endpoints can exceed 30s |
| `GUEST_EMAIL` | `qa-automation@upcover.com` | Guest login email |

## Adding a new product quick quote API

1. Create `src/products/<product>/data/quickQuote.payload.ts`
2. Create `src/products/<product>/data/fullQuote.mapper.ts` to map quick quote response → full quote body
3. Create `src/products/<product>/services/quickQuote.service.ts` and `fullQuote.service.ts` using `apiClient`
4. Add types under `src/products/<product>/types/`
5. Add tests under `src/tests/products/<product>/`
6. Add `npm run test:<product>` script in `package.json`

Guest login and Bearer token attachment are handled automatically — no need to pass the token manually.
