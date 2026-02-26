# LedgerAI – TODO

Track tasks and next steps. Check off as you go.

---

## Before / for deploy

- [ ] Add `.env.example` (list required env vars, no secrets)
- [ ] Set production env vars on host (MONGODB_URI, NEXTAUTH_URL, NEXTAUTH_SECRET, OPENAI_API_KEY, optional Google)
- [ ] Use production MongoDB (e.g. Atlas), not local
- [ ] (Optional) Error tracking (e.g. Sentry)
- [ ] (Optional) Rate limiting on auth / upload

---

## Features

- [x] **Edit transaction** – Edit existing transaction (vendor, amount, GST, category, date, etc.)
- [ ] **Export** – Export month’s transactions (CSV and/or PDF)
- [x] **Search / filter transactions** – Search by vendor/invoice; filter by type, category, date range
- [ ] **Password reset** – “Forgot password?” flow with email link
- [x] **GST due reminder** – Banner or notice on dashboard when GST filing is due
- [x] **Recurring templates** – Save transaction as template, “Add from template” for rent, subscriptions, etc.

---

## Polish / later

- [ ] Edit business profile from onboarding (or skip and do in Profile)
- [ ] PWA / installable app
- [ ] Multi-business (switch business per user)
- [ ] Basic SEO (meta tags, OG) for landing / marketing pages

---

## Done (reference)

- [x] Liquid dock, Add popover (Manually / Upload)
- [x] Onboarding for new users, dock hidden on onboarding
- [x] Redirect to /transactions after add/upload
- [x] Insights caching, loading skeleton
- [x] Quick links alignment, Settings visibility in header
- [x] .gitignore essentials

---

*Update this file as you complete or add tasks.*
