# Viz product module

Quick quote and full quote automation for Viz.

## Endpoints

| Step | Method | Path |
|------|--------|------|
| Quick quote | POST | `/viz/reports` (dev: `/viz/quick-quote`) |
| Full quote | POST | `/viz/full-quote` |
| Annual payment | POST | `/viz/payments` |
| Monthly payment | POST | `/viz/payments/monthly` |
| Quote docs email | POST | `/viz/quote-docs/email` |
| Proof of insurance email | POST | `/viz/proof-of-insurance/email` |

Configure paths via `VIZ_*_PATH` env vars (see `.env.example`).

## Full quote mapping

| Full quote field | Source |
|------------------|--------|
| `quoteId`, `metadata.quoteId` | `quickQuote.id` |
| `clientInformation` | `quickQuote.req.clientInformation` |
| All other fields | Static template (`TRES ABOGADOS PTY LTD`, tools/taxAudit included, etc.) |
| `policyStartDate`, `policyExpiryDate` | Today → +1 year (Australia/Melbourne) |

## Payment mapping

| Payment | `expectedPrice` source |
|---------|------------------------|
| Annual | `fullQuote.priceBreakdown.clientPayable` |
| Monthly | `fullQuote.priceBreakdown.monthlyBreakdown.firstInstallmentPayable` |

Monthly full quote sets `isMonthlySubscription: true` via `buildVizMonthlyFullQuotePayload()`.

## Email mapping

| Email | Field | Source |
|-------|-------|--------|
| Quote docs | `email` | `fullQuote.req.clientInformation.email` |
| Quote docs | `quoteId` | `fullQuote.id` |
| Proof of insurance | `email` | `fullQuote.req.clientInformation.email` |
| Proof of insurance | `policyRequestId` | payment response `id` |

## Run tests

```bash
npm run test:viz
```
