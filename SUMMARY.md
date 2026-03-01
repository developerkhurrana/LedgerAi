# LedgerAI – Summary of Recent Changes

Summary of features and fixes implemented so far.

---

## Navigation & Dock

### Bottom dock (liquid style)
- **Floating liquid-style dock** (Framer Motion) with **liquid glass effect**: same inset shadows and SVG backdrop filter as the liquid glass button component for a consistent frosted-glass look.
- Dock shows: **Dashboard**, **Transactions**, **Insights**, **AI Expert**, **Profile**, and **Add** (Settings is in the header only).
- Active route has a glowing pill and primary-colored icon; tap/hover animations.
- **Width**: Dock spans most of the screen with horizontal padding, `max-w-4xl`, and `justify-between`.

### Add button (popover)
- The **Add** item is a **button** that opens a **popover above it**.
- **Manually** → `/add` (manual form). **Upload** → `/add?upload=1` (file picker opens).
- Implemented in `AddDockButton.tsx`; click-outside closes the popover.

### Dock hidden on onboarding
- **DockWhenNotOnboarding**: dock is not rendered on `/onboarding`.

### Settings
- Settings is in the **header** only (gear icon, `text-primary`, `sm:bg-primary/10` for visibility).

---

## Add / Transactions Flow

- **`/add`**: Add transaction form + Upload invoice (PDF). Templates list for “Add from template.”
- **Transactions** page: month picker + transaction list (no add form; add is via dock).
- **After add/upload**: Redirect to **`/transactions`**.
- **Upload from dock**: `InvoiceUpload` has `autoOpenFileDialog` for `/add?upload=1`; opens file picker and cleans URL.

---

## Edit Transaction

- **Server**: `getTransaction(userId, id)`, `updateTransaction(userId, id, input)` in `actions/transactions.ts`. Owner-only.
- **UI**: **Edit** (pencil) on each transaction row → **`/transactions/[id]/edit`**. `EditTransactionForm` pre-filled from transaction; **Save as template** in header.
- **Edit page**: Loads transaction; redirects to `/transactions` if not found. Save redirects to `/transactions`.

---

## Search & Filter Transactions

- **Server**: `listTransactions` accepts **`search`** (vendor/invoice, case-insensitive regex) and **`category`** (exact). Date range via existing month picker.
- **UI**: **TransactionFilters** on `/transactions`: search input + “Search” button, **Type** (All / Income / Expense), **Category** (All + list). Filters in URL (`?search=&type=&category=`); **Clear filters** resets them.
- Month picker keeps search/type/category when changing month.

---

## Recurring Templates

- **Model**: **TransactionTemplate** (userId, name, type, vendorName, amount, currency, gstPercent, category, invoiceNumber). No date (chosen when adding).
- **Actions**: `createTemplate`, `listTemplates`, `getTemplate`, `deleteTemplate` in `actions/templates.ts`.
- **Add page**: **TemplateList** (“Add from template”) with **Use** → `/add?template=id` and **Delete**. Form pre-fills from template via `initialData`; **key** resets form when template changes.
- **AddTransactionForm**: Optional **`initialData`** and **Currency** (INR/USD) for templates.
- **Save as template**: On **Edit transaction** page, **Save as template** in header; prompt for name → create template → redirect to `/add?template=newId`.

---

## GST Due Reminder

- **GstDueBanner** on dashboard: shown **1st–20th** of each month (GSTR-3B due by 20th of next month).
- Message: e.g. “GSTR-3B for January 2025 is due by 20 February 2025.” Links: **File on GST portal** (gst.gov.in), **View GST in LedgerAI** (`/overview`).
- Amber banner with icon; not shown after the 20th.

---

## AI Expert Chat

- **Route**: **`/chat`**. **Dock**: “AI Expert” (message icon) links to `/chat`.
- **Backend**: `chatWithExpert(messages)` in `actions/chat.ts`; OpenAI with LedgerAI expert system prompt (app usage, GST, finances, troubleshooting). Uses `gpt-4o-mini`.
- **UI**: **ChatExpert** – single heading “AI Expert” with sparkle icon; welcome “How can I help you today?”; message list (user right, assistant left); input with visible text/placeholder (`text-foreground`, `placeholder:text-foreground/60`); send button. No back arrow (navigate via dock/header).
- **State**: In-memory per session; no persistence yet.

---

## Insights

- **InsightCache** model; **getMonthlyInsights** uses cache; OpenAI only when month’s transactions change.
- **Insights loading**: `loading.tsx` skeleton.

---

## Liquid Glass UI

- **`components/ui/liquid-glass-button.tsx`**:
  - **LiquidButton**: Glass effect (inset shadows + SVG `#container-glass` filter). Variants/sizes. **GlassFilter** (exported) provides the filter SVG.
  - **MetalButton**: Metallic look with variants (default, primary, success, error, gold, bronze); press/hover states; touch-aware.
  - **Exports**: `GlassFilter`, `liquidGlassShadowClass`, `liquidGlassShadowDarkClass` for reuse.
- **Dock**: AppDock uses the same liquid glass layers (shadow classes + backdrop filter + GlassFilter) on the dock pill for a consistent look.
- **Demo**: **`/demo`** shows LiquidButton and MetalButton variants (link from dashboard or go to `/demo`).

---

## UI Polish

- **Dashboard Quick links**: Grid `grid-cols-[2.5rem_1fr_auto]`, min height, consistent padding and alignment.
- **Session**: `next-auth.d.ts` – `Session.user.onboardingCompleted`.

---

## Onboarding

- **User**: `onboardingCompleted` (default `false`). **Session**: exposes it; legacy users (no field) skip onboarding.
- **OnboardingGuard**: redirects to `/onboarding` when not completed. **Onboarding page**: welcome, “What you can do,” optional Quick setup (name, business), **Get started**. **completeOnboarding** action.

---

## File / Route Overview

| Area            | Files / routes |
|-----------------|----------------|
| Dock            | `AppDock.tsx`, `AddDockButton.tsx`, `DockWhenNotOnboarding.tsx`; liquid glass from `liquid-glass-button.tsx` |
| Add flow        | `(app)/add/page.tsx`, `AddTransactionForm.tsx`, `InvoiceUpload.tsx`, `TemplateList.tsx` |
| Transactions    | `(app)/transactions/page.tsx`, `TransactionFilters.tsx`, `TransactionListView.tsx`; edit: `(app)/transactions/[id]/edit/page.tsx`, `EditTransactionForm.tsx` |
| Templates       | `TransactionTemplate.ts`, `actions/templates.ts` |
| Insights        | `InsightCache.ts`, `actions/insights.ts`, `(app)/insights/loading.tsx` |
| Chat            | `(app)/chat/page.tsx`, `ChatExpert.tsx`, `actions/chat.ts` |
| Dashboard       | `(app)/dashboard/page.tsx`, `GstDueBanner.tsx` |
| Onboarding      | `(app)/onboarding/page.tsx`, `OnboardingFlow.tsx`, `OnboardingGuard.tsx`, `actions/onboarding.ts` |
| UI              | `components/ui/liquid-glass-button.tsx` (LiquidButton, MetalButton, GlassFilter, shadow classes) |
| Layout / auth   | `(app)/layout.tsx`, `lib/auth/config.ts`, `User.ts` |

---

*Last updated to include edit transaction, search/filter, templates, GST reminder, AI Expert chat, liquid glass component and dock integration.*
