# LedgerAI

AI-powered expense, GST, and cash flow tracker for Indian small businesses.

## Tech Stack

- **Next.js 14** (App Router), **TypeScript**, **TailwindCSS**, **ShadCN-style UI**
- **MongoDB** (Mongoose)
- **NextAuth** (Credentials + Google)
- **OpenAI API** (invoice parsing & insights)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and set:

   - `MONGODB_URI` — MongoDB connection string (default: `mongodb://localhost:27017/ledgerai`)
   - `NEXTAUTH_URL` — App URL (e.g. `http://localhost:3000`)
   - `NEXTAUTH_SECRET` — Random secret (e.g. `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Optional, for Google sign-in
   - `OPENAI_API_KEY` — For invoice parsing and AI insights

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Phase 1 (MVP) Features

- **Auth** — Sign up / Sign in (credentials + Google), multi-tenant (all data scoped by user)
- **Expense / Income** — Add transactions with vendor, amount, GST %, category, invoice number, date (with validation)
- **Delete transaction** — Remove a transaction from the list (owner-only)
- **GST** — Input GST (expenses), Output GST (income), Net GST payable
- **Dashboard** — Total income, expenses, net profit, Input/Output/Net GST; **month selector** (view any month)
- **Multi-currency** — INR, USD, etc. in transaction list; overview totals are INR-only
- **Invoice upload** — PDF upload → text extraction → OpenAI → structured data → save as expense
- **AI Insights** — Monthly summary (spending change %, top category, GST due alert)

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server actions (auth, transactions, insights, upload)
│   ├── api/auth/         # NextAuth API route
│   ├── dashboard/       # Dashboard layout + page
│   ├── login/           # Login page + form
│   ├── register/        # Register page + form
│   └── layout.tsx
├── components/
│   ├── dashboard/       # Dashboard metrics, insights, transaction list, forms, upload
│   ├── providers/       # SessionProvider
│   └── ui/              # ShadCN-style (Button, Card, Input, Label, Select, Toast)
├── lib/
│   ├── ai/              # Invoice parser (OpenAI), insights (OpenAI)
│   ├── auth/            # NextAuth config, getServerSession
│   ├── db/              # Mongoose connection, User & Transaction models
│   ├── gst/              # GST calculator (input/output/net)
│   ├── format.ts        # formatCurrency, formatDate
│   └── utils.ts         # cn()
└── types/               # next-auth.d.ts
```

## Demo script (for interview / showcase)

1. **Run the app**: `npm run dev` → open http://localhost:3000
2. **Sign up**: Click "Sign up", enter email + password (min 6 chars), create account
3. **Dashboard**: You land on Dashboard with Overview / Transactions / Insights tabs
4. **Add a transaction**: Transactions tab → fill vendor, amount (e.g. 10000), category, date → "Add transaction"
5. **Month selector**: Use ← → next to the month to view different months (metrics and list update)
6. **Upload invoice**: Transactions tab → "Choose PDF or drop here" → pick a PDF invoice (Indian or USD); app parses and saves as expense
7. **Delete**: In Recent transactions, click the trash icon on a row → confirm to delete
8. **AI Insights**: Insights tab shows monthly summary (needs `OPENAI_API_KEY`)

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint
