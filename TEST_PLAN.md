# Upcover API — Test Plan

Backend API QA automation for Upcover products using Jest + Supertest against `BASE_URL` (default: `https://dev-api.upcover.com`).

**Last updated:** 2026-07-08

---

## 1. Scope

| Area | In scope | Status |
|------|----------|--------|
| Shared auth | Guest login, Bearer token on all requests | ✅ Automated |
| Coalition | QQ → FQ → payments → emails | ✅ Automated |
| Viz | QQ → FQ → payments → emails | ✅ Automated |
| Referral flow | Referral denial, review, bind after approval | 📋 Planned |
| Endorsement flow | Post-bind policy changes | 📋 Planned |
| AHP | Full product flow | 📋 Planned |
| PPL | Full product flow | 📋 Planned |
| Cyber | Full product flow | 📋 Planned |

---

## 2. Prerequisites

| Item | Notes |
|------|-------|
| `.env` | Copy from `.env.example`; set `BASE_URL`, payment method IDs |
| Guest login | `GET /auth/guestLogin` — runs once in `jest.setup.ts` |
| Stripe (dev) | Payment / POI may warn-pass on `Customer does not exist` or `Unknown Stripe error` |
| Timeouts | `REQUEST_TIMEOUT=120000`, Jest `testTimeout: 300000` for slow dev APIs |
| Serial runs | Coalition and Viz use `--runInBand` for ordered flows |

---

## 3. Test execution

```bash
npm run test:auth        # Guest login
npm run test:coalition   # Coalition 01–06 (serial)
npm run test:viz         # Viz 01–06 (serial)
npm run test:ahp         # AHP (when implemented)
npm run test:ppl         # PPL (when implemented)
npm run test:cyber       # Cyber (when implemented)
npm test                 # All suites
npm run test:report      # HTML report
```

---

## 4. Standard happy-path flow (per product)

Each product follows the same high-level sequence unless noted.

| Step | Test file pattern | Method | Typical path | Key mappings |
|------|-------------------|--------|--------------|--------------|
| 01 Quick quote | `01.quickQuote.test.ts` | POST | `/<product>/quick-quote` | Returns product quote id |
| 02 Full quote | `02.fullQuote.test.ts` | POST | `/<product>/full-quote` | `quoteId` + fields from QQ response |
| 03 Annual payment | `03.payment.test.ts` | POST | `/<product>/payments` | `quoteId`, `expectedPrice` from FQ |
| 04 Monthly payment | `04.monthlyPayment.test.ts` | POST | `/<product>/payments/monthly` | FQ with `isMonthlySubscription: true` |
| 05 Quote docs email | `05.quoteDocsEmail.test.ts` | POST | `/<product>/quote-docs/email` | `email`, `quoteId` from FQ |
| 06 Proof of insurance | `06.proofOfInsuranceEmail.test.ts` | POST | `/<product>/proof-of-insurance/email` | `email` from FQ, `policyRequestId` from payment |

---

## 5. Product coverage

### 5.1 Coalition ✅ Automated

| # | Scenario | Command / file | Expected |
|---|----------|----------------|----------|
| C-01 | Quick quote | `01.quickQuote.test.ts` | `201`, `col_*` id, premium breakdown |
| C-02 | Full quote (annual) | `02.fullQuote.test.ts` | `201`, mapped from QQ |
| C-03 | Annual payment | `03.payment.test.ts` | `201` (or Stripe warn-pass) |
| C-04 | Monthly payment | `04.monthlyPayment.test.ts` | Fresh QQ + monthly FQ → payment |
| C-05 | Quote docs email | `05.quoteDocsEmail.test.ts` | `200`, annual + monthly FQ |
| C-06 | Proof of insurance | `06.proofOfInsuranceEmail.test.ts` | `200`, after annual/monthly payment |

**Notes:** QQ retries on `errorCode: referral` (rotates real test companies) and TOI scan in progress.

---

### 5.2 Viz ✅ Automated

| # | Scenario | Command / file | Expected |
|---|----------|----------------|----------|
| V-01 | Quick quote | `01.quickQuote.test.ts` | `201`, `viz_*` id (path: `/viz/quick-quote` on dev) |
| V-02 | Full quote | `02.fullQuote.test.ts` | `201`, Melbourne template + QQ client info |
| V-03 | Annual payment | `03.payment.test.ts` | `expectedPrice` = `priceBreakdown.clientPayable` |
| V-04 | Monthly payment | `04.monthlyPayment.test.ts` | `expectedPrice` = `monthlyBreakdown.firstInstallmentPayable` |
| V-05 | Quote docs email | `05.quoteDocsEmail.test.ts` | `201` (Viz returns 201, not 200) |
| V-06 | Proof of insurance | `06.proofOfInsuranceEmail.test.ts` | Skips email step if Stripe unavailable |

**Notes:** Policy dates use `Australia/Melbourne` timezone to avoid `451 approval-required` on payment.

---

### 5.3 AHP 📋 Planned

Scaffold: `src/products/ahp/`

| # | Scenario | Endpoint (TBD) | Preconditions | Expected |
|---|----------|------------------|---------------|----------|
| A-01 | Quick quote | `POST /ahp/quick-quote` | Valid AHP payload | `201`, quote id |
| A-02 | Full quote | `POST /ahp/full-quote` | A-01 complete | `201`, mapped from QQ |
| A-03 | Annual payment | `POST /ahp/payments` | A-02, payment method in `.env` | `201` |
| A-04 | Monthly payment | `POST /ahp/payments/monthly` | Monthly FQ | `201` |
| A-05 | Quote docs email | `POST /ahp/quote-docs/email` | A-02 | Success status |
| A-06 | Proof of insurance | `POST /ahp/proof-of-insurance/email` | After payment | Success status |

**Needs from product team:** QQ/FQ sample bodies, occupation IDs, payment method IDs, status codes.

---

### 5.4 PPL 📋 Planned

Scaffold: `src/products/ppl/` (to be created)

| # | Scenario | Endpoint (TBD) | Preconditions | Expected |
|---|----------|------------------|---------------|----------|
| P-01 | Quick quote | `POST /ppl/quick-quote` | Valid PPL payload | `201`, quote id |
| P-02 | Full quote | `POST /ppl/full-quote` | P-01 complete | `201` |
| P-03 | Annual payment | `POST /ppl/payments` | P-02 | `201` |
| P-04 | Monthly payment | `POST /ppl/payments/monthly` | Monthly FQ | `201` |
| P-05 | Quote docs email | `POST /ppl/quote-docs/email` | P-02 | Success status |
| P-06 | Proof of insurance | `POST /ppl/proof-of-insurance/email` | After payment | Success status |

**Needs from product team:** Product-specific fields (limits, occupations, declarations), env vars.

---

### 5.5 Cyber 📋 Planned

Scaffold: `src/products/cyber/` (to be created)

| # | Scenario | Endpoint (TBD) | Preconditions | Expected |
|---|----------|------------------|---------------|----------|
| CY-01 | Quick quote | `POST /cyber/quick-quote` | Valid Cyber payload | `201`, quote id |
| CY-02 | Full quote | `POST /cyber/full-quote` | CY-01 complete | `201` |
| CY-03 | Annual payment | `POST /cyber/payments` | CY-02 | `201` |
| CY-04 | Monthly payment | `POST /cyber/payments/monthly` | Monthly FQ | `201` |
| CY-05 | Quote docs email | `POST /cyber/quote-docs/email` | CY-02 | Success status |
| CY-06 | Proof of insurance | `POST /cyber/proof-of-insurance/email` | After payment | Success status |

**Needs from product team:** Cyber-specific declarations, bundle/cover IDs, payment config.

---

## 6. Referral flow 📋 Planned

Referral occurs when underwriting rules block automatic bind (e.g. Coalition `400` + `errorCode: referral`).

### Current automation (partial)

| # | Scenario | Product | Status |
|---|----------|---------|--------|
| R-01 | QQ returns referral denial | Coalition | ✅ Handled via `createQuickQuoteWithRetry()` — rotates test companies |
| R-02 | Assert referral response shape | All applicable | 📋 Not yet — dedicated negative test |
| R-03 | Submit / fetch referral for review | TBD endpoint | 📋 Needs API spec |
| R-04 | Approve referral (ops / admin) | TBD endpoint | 📋 Needs API spec + auth |
| R-05 | Re-quote or resume after approval | TBD | 📋 Needs API spec |
| R-06 | Complete bind (FQ → payment) post-approval | Coalition / Viz / others | 📋 Planned |
| R-07 | Decline referral — assert terminal state | TBD | 📋 Planned |

### Suggested test structure

```
src/tests/products/<product>/referral/
  01.referralDenied.test.ts      # Negative: trigger referral, assert 400 + errorCode
  02.referralApproval.test.ts    # Happy: approval → bind completes
  03.referralDecline.test.ts     # Negative: declined referral
```

**Needs from product team:** Referral submit/approve/decline endpoints, payloads, and whether guest token is sufficient or admin token required.

---

## 7. Endorsement flow 📋 Planned

Endorsements change an **active policy** after initial bind (limit change, address, add cover, etc.).

| # | Scenario | Endpoint (TBD) | Preconditions | Expected |
|---|----------|------------------|---------------|----------|
| E-01 | Create endorsement request | `POST /.../endorsements` | Bound policy (payment `id`) | Endorsement id / draft |
| E-02 | Get endorsement quote / premium delta | `GET` or `POST` | E-01 | Updated premium breakdown |
| E-03 | Approval required (451) | Same as payment | Date or material change | `451` + `changes[]` — assert shape |
| E-04 | Approve endorsement changes | TBD | E-03 | Proceed to payment |
| E-05 | Pay endorsement (annual) | TBD payments path | E-02 approved | `201` |
| E-06 | Pay endorsement (monthly) | TBD monthly path | Monthly policy | `201` |
| E-07 | Email updated docs | quote-docs / POI | After E-05/E-06 | Success |
| E-08 | Cancel / withdraw endorsement | TBD | E-01 draft | Terminal state |

### Suggested test structure

```
src/tests/products/<product>/endorsement/
  01.createEndorsement.test.ts
  02.endorsementPayment.test.ts
  03.endorsementApprovalRequired.test.ts
  04.endorsementEmails.test.ts
```

**Prerequisite flow:** Complete steps 01–06 (QQ → payment) for the same product, then branch into endorsement tests (serial sequencer).

**Needs from product team:** Endorsement API paths, change types, mapping from bound policy id, approval workflow.

---

## 8. Cross-cutting test cases

| # | Scenario | Applies to | Priority |
|---|----------|------------|----------|
| X-01 | Missing / expired Bearer token | All | P1 |
| X-02 | Invalid `quoteId` on FQ / payment | All | P1 |
| X-03 | `expectedPrice` mismatch | Payments | P1 |
| X-04 | Policy start date drift (`451 approval-required`) | Viz, others | P1 |
| X-05 | Stripe customer missing (dev) | Payments, POI | P2 — warn-pass OK on dev |
| X-06 | Monthly FQ without `isMonthlySubscription: true` | Monthly flows | P1 |
| X-07 | Email to wrong `quoteId` | Quote docs | P2 |
| X-08 | POI without prior payment | POI | P1 |

---

## 9. Implementation roadmap

| Phase | Deliverable | Products |
|-------|-------------|----------|
| **Phase 1** ✅ | Happy path 01–06 | Coalition, Viz |
| **Phase 2** | Referral negative + approval E2E | Coalition (first), then Viz |
| **Phase 3** | Endorsement E2E | Per product after bind flow stable |
| **Phase 4** | Happy path 01–06 | AHP |
| **Phase 5** | Happy path 01–06 | PPL |
| **Phase 6** | Happy path 01–06 | Cyber |
| **Phase 7** | Referral + endorsement | AHP, PPL, Cyber |

---

## 10. Information needed to proceed

To automate the planned sections, please provide (per product where applicable):

1. **Postman / OpenAPI** exports for referral and endorsement endpoints  
2. **Sample request/response** bodies for AHP, PPL, Cyber (QQ + FQ minimum)  
3. **Payment method IDs** and coupon rules per product  
4. **Expected HTTP status codes** for email endpoints  
5. **Auth requirements** for referral approval (guest vs admin)  
6. **Test data** — companies, occupations, and referral-trigger vs clean payloads  

---

## 11. Traceability

| Test plan ID | Automated test file |
|--------------|---------------------|
| C-01 … C-06 | `src/tests/products/coalition/01.*` … `06.*` |
| V-01 … V-06 | `src/tests/products/viz/01.*` … `06.*` |
| A-01 … A-06 | _Not yet_ |
| P-01 … P-06 | _Not yet_ |
| CY-01 … CY-06 | _Not yet_ |
| R-01 | `coalition/services/quickQuote.service.ts` (retry only) |
| E-01 … E-08 | _Not yet_ |
