# AHP product module

## Endpoints

| Step | Method | Path |
|------|--------|------|
| Quick quote | POST | `/quickQuote` |
| Full quote | POST | `/fullQuote` |

Configure paths via `AHP_*_PATH` env vars (see `.env.example`).

## Full quote mapping

`buildAhpFullQuotePayload(quickQuote, quickQuoteRequest)` maps from the QQ response + request:

| FQ field | Source |
|----------|--------|
| `quoteId` | `quickQuote.policyRequestId` |
| `occupations` | `quickQuoteRequest.occupations` (`id` → `occupationId`) |
| `statesSplit` | `quickQuoteRequest.states` |
| `revenueLastFy` / `revenueCurrentFy` | `quickQuoteRequest.averageRevenue` |
| `coverInput` | `quickQuoteRequest.coverInput` |
| `operatesInMultipleStates` | `states.length > 1` |
| `firstName`, `lastName`, `email` | Generated via `generateDummyClientInformation()` |
| `companyName`, `insuredName` | Derived from generated client name (`{LAST} {FIRST} PTY LTD`) |
| `policyStartDate` | Today (`Australia/Melbourne`, `DD/MM/YYYY`) |

Static template fields (address, ABN, declarations, etc.) live in `fullQuote.defaults.ts`.


Static template from product sample; override fields via `buildAhpQuickQuotePayload(overrides)`.

| Field | Default |
|-------|---------|
| `occupations[0].id` | `595ab40a-588d-4e0e-8090-347f50cc094e` |
| `states[0].id` | `e5384a75-8180-4d4c-9859-8e84f4ddb36f` |
| `averageRevenue` | `3433` |
| `coverInput` | PI $1M + PL $10M |

## Run tests

```bash
npm run test:ahp
```
