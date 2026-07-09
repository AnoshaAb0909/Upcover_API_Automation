# AHP product module

Add AHP quick quote automation here:

- `data/quickQuote.payload.ts` — default payload + builder
- `services/quickQuote.service.ts` — POST to the AHP quick quote endpoint
- `types/` — request/response TypeScript types
- `../../tests/products/ahp/quickQuote.test.ts` — Jest test suite

All requests use shared guest login and `BASE_URL` from `src/core/`.
