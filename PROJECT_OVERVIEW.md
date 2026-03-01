# LedgerAI — Project Overview

**LedgerAI** is an AI-powered expense, GST, and cash flow app for Indian small businesses. It helps you track income and expenses, manage GST, upload invoices, and get AI-generated insights—all in one place.

---

## What It Does

### For the business owner

- **Track money** — Add income and expenses with vendor, amount, GST %, category, and date. View totals and net profit by month.
- **GST at a glance** — See input GST (on purchases), output GST (on sales), and net GST payable. Dashboard reminder when GSTR-3B filing is due (by 20th of the following month).
- **Upload invoices** — Drop a PDF invoice; the app extracts details with AI and saves it as an expense.
- **Edit & search** — Edit any transaction, and search or filter by vendor, invoice number, type (income/expense), or category.
- **Recurring entries** — Save a transaction as a template (e.g. rent, subscriptions) and add new entries from it in one tap.
- **AI Expert** — In-app chat to ask questions about LedgerAI, GST, or your finances and get short, practical answers.
- **Monthly insights** — AI-generated summary of the month: spending changes, top category, GST due reminder (cached so repeat visits are fast).

### Experience

- **Onboarding** — New users get a short welcome and optional profile setup (name, business name) before using the app.
- **Quick add** — Bottom dock has an **Add** button: choose *Manually* (form) or *Upload* (PDF). After saving, you’re taken to the transaction list.
- **Liquid glass UI** — Modern dock and buttons with a frosted-glass style; dark theme supported.

---

## Who It’s For

- Indian small businesses and freelancers who need simple expense tracking and GST visibility.
- Anyone who wants to upload invoices instead of typing everything manually and get a monthly AI summary.

---

## Tech (high level)

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: Next.js server actions, MongoDB (Mongoose).
- **Auth**: NextAuth (email/password + optional Google).
- **AI**: OpenAI for invoice parsing, monthly insights, and the in-app Expert chat.

---

## Summary in one line

**LedgerAI** is an AI-powered expense and GST tracker for Indian small businesses, with invoice uploads, templates, search, and an in-app AI Expert.
