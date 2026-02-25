# LedgerAI – Summary of Recent Changes

Summary of features and fixes implemented in this session.

---

## Navigation & Dock

### Bottom dock (liquid style)
- Replaced the previous dock with a **floating liquid-style dock** (Framer Motion).
- Dock shows: **Dashboard**, **Transactions**, **Insights**, **Profile**, and **Add** (no longer Settings).
- Active route has a glowing pill and primary-colored icon; tap/hover animations.
- **Width**: Dock spans most of the screen with horizontal padding, `max-w-4xl`, and `justify-between` so items are spaced across the bar.

### Add button (no direct jump)
- The **Add** item in the dock is a **button** that opens a **popover above it** (no immediate navigation).
- Popover options:
  - **Manually** → navigates to `/add` (manual transaction form).
  - **Upload** → navigates to `/add?upload=1` (add page opens with file picker for PDF).
- Implemented in `AddDockButton.tsx`; click-outside closes the popover.

### Dock hidden on onboarding
- **DockWhenNotOnboarding** component: dock is **not rendered** on `/onboarding`.
- On all other app routes the dock is shown as usual.

### Settings access
- **Settings** was removed from the dock and is only in the **header** (gear icon, primary styling).
- Header Settings button was made more visible: `text-primary`, and on larger screens `sm:bg-primary/10` so it reads clearly on the dark header.

---

## Add / Transactions Flow

### Dedicated Add page
- **Route**: `/add`.
- Contains only: **Add transaction** form and **Upload invoice** (PDF).
- **Transactions** page (`/transactions`) no longer has “Quick actions”; it only shows the month picker and the transaction list.

### Redirect after successful add
- After **manually** adding a transaction: redirect to **`/transactions`** (no longer stay on `/add`).
- After **uploading** an invoice successfully: redirect to **`/transactions`**.
- Implemented in `AddTransactionForm.tsx` and `InvoiceUpload.tsx`.

### Upload from dock
- Choosing **Upload** in the Add popover goes to `/add?upload=1`.
- **InvoiceUpload** has optional prop **`autoOpenFileDialog`**; when `true` it opens the file picker on mount and then cleans the `upload` query from the URL.

---

## Onboarding

### New-user onboarding
- **User model**: added **`onboardingCompleted`** (boolean, default `false`).
- **Session**: `onboardingCompleted` is read from the DB in the session callback and exposed on `session.user`.
- **OnboardingGuard** (client): if the user is logged in and `onboardingCompleted` is `false`, redirects to **`/onboarding`** unless already there.
- **Onboarding page** (`/onboarding`): welcome block, “What you can do” (transactions/GST, AI insights), optional “Quick setup” (name, business name), and **Get started** button.
- **completeOnboarding** server action: sets `onboardingCompleted: true` and optionally saves name/business name; then user can access the rest of the app.
- **Legacy users**: users without the `onboardingCompleted` field are treated as completed so they are not sent to onboarding.

---

## Insights

### Caching
- **InsightCache** model: stores cached insights per user/month with a fingerprint (transaction count + last transaction `updatedAt`).
- **getMonthlyInsights**: checks cache first; calls OpenAI only when the month’s transactions have changed; otherwise returns cached insights.
- Reduces repeated OpenAI calls and speeds up repeat visits to Insights.

### Loading state
- **Insights loading**: `loading.tsx` with a skeleton (header, month picker placeholder, card with skeleton insight rows) while server fetches or uses cached insights.

---

## UI Polish

### Dashboard Quick links
- Quick link cards use a **strict grid**: `grid-cols-[2.5rem_1fr_auto]` so icon, text, and arrow align across all four cards.
- **Min height** on the card header so all quick link cards have consistent height.
- Consistent padding (`py-4 sm:py-5`), `text-left`, and `leading-tight` / `leading-snug` for aligned, readable layout.

### Session types
- **next-auth.d.ts**: `Session.user` extended with **`onboardingCompleted?: boolean`**.

---

## File / Route Overview

| Area            | Files / routes |
|-----------------|----------------|
| Dock            | `AppDock.tsx`, `AddDockButton.tsx`, `DockWhenNotOnboarding.tsx` |
| Onboarding      | `(app)/onboarding/page.tsx`, `OnboardingFlow.tsx`, `OnboardingGuard.tsx`, `actions/onboarding.ts` |
| Add flow        | `(app)/add/page.tsx`, `AddTransactionForm.tsx`, `InvoiceUpload.tsx` (with `autoOpenFileDialog`) |
| Insights        | `InsightCache.ts`, `getMonthlyInsights` in `actions/insights.ts`, `(app)/insights/loading.tsx` |
| Layout / auth   | `(app)/layout.tsx` (OnboardingGuard, DockWhenNotOnboarding, header Settings), `lib/auth/config.ts` (session + onboardingCompleted), `User.ts` (onboardingCompleted) |

---

*Generated as a summary of the session’s work.*
