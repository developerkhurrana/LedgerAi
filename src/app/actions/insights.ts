'use server';

import { connectDb, Transaction, InsightCache } from '@/lib/db';
import { computeGstSummary } from '@/lib/gst/calculator';
import { generateMonthlyInsights } from '@/lib/ai/insights';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalInputGst: number;
  totalOutputGst: number;
  netGstPayable: number;
}

/**
 * Aggregate dashboard metrics for the user for a given month (default: current month).
 */
export async function getDashboardMetrics(
  userId: string,
  year?: number,
  month?: number
): Promise<DashboardMetrics | null> {
  if (!userId) return null;

  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const start = startOfMonth(new Date(y, m, 1));
  const end = endOfMonth(new Date(y, m, 1));

  await connectDb();

  const transactions = await Transaction.find({
    userId,
    date: { $gte: start, $lte: end },
  }).lean();

  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeGst = 0;
  let expenseGst = 0;
  const currencyField = (t: { currency?: string }) => t.currency ?? 'INR';

  for (const t of transactions) {
    if (currencyField(t) !== 'INR') continue; // dashboard totals are INR-only (GST is India-specific)
    if (t.type === 'income') {
      totalIncome += t.amount;
      incomeGst += t.gstAmount;
    } else {
      totalExpenses += t.amount;
      expenseGst += t.gstAmount;
    }
  }

  const gst = computeGstSummary(incomeGst, expenseGst);
  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalInputGst: gst.totalInputGst,
    totalOutputGst: gst.totalOutputGst,
    netGstPayable: gst.netGstPayable,
  };
}

/**
 * Get top expense category for the month (for insights).
 */
async function getTopExpenseCategory(
  userId: string,
  start: Date,
  end: Date
): Promise<{ category: string; amount: number } | null> {
  const list = await Transaction.aggregate([
    { $match: { userId, type: 'expense', date: { $gte: start, $lte: end }, $or: [{ currency: 'INR' }, { currency: { $exists: false } }] } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);
  const first = list[0];
  return first ? { category: first._id, amount: first.total } : null;
}

/**
 * Get previous month total expenses for comparison.
 */
async function getPreviousMonthExpenses(userId: string, currentStart: Date): Promise<number> {
  const prevStart = subMonths(currentStart, 1);
  const prevEnd = endOfMonth(prevStart);
  const result = await Transaction.aggregate([
    { $match: { userId, type: 'expense', date: { $gte: prevStart, $lte: prevEnd }, $or: [{ currency: 'INR' }, { currency: { $exists: false } }] } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0]?.total ?? 0;
}

/**
 * Get transaction fingerprint for the month: count and latest updatedAt.
 * Used to invalidate insight cache when transactions change.
 */
async function getTransactionFingerprint(
  userId: string,
  start: Date,
  end: Date
): Promise<{ count: number; lastUpdatedAt: Date | null }> {
  const list = await Transaction.find(
    { userId, date: { $gte: start, $lte: end } },
    { updatedAt: 1 }
  )
    .sort({ updatedAt: -1 })
    .limit(1)
    .lean();
  const count = await Transaction.countDocuments({ userId, date: { $gte: start, $lte: end } });
  const lastUpdatedAt = list[0]?.updatedAt ?? null;
  return { count, lastUpdatedAt };
}

/**
 * Fetch AI-generated monthly insights for dashboard.
 * Uses cached OpenAI response when the month's transactions have not changed.
 */
export async function getMonthlyInsights(
  userId: string,
  year?: number,
  month?: number
): Promise<{ title: string; description: string; type: string; value?: string }[]> {
  const metrics = await getDashboardMetrics(userId, year, month);
  if (!metrics) return [];

  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const start = startOfMonth(new Date(y, m, 1));
  const end = endOfMonth(new Date(y, m, 1));

  await connectDb();

  const { count, lastUpdatedAt } = await getTransactionFingerprint(userId, start, end);
  const lastUpdatedAtDate = lastUpdatedAt ? new Date(lastUpdatedAt) : null;

  const cached = await InsightCache.findOne({
    userId,
    year: y,
    month: m,
  }).lean();

  const cacheValid =
    cached &&
    cached.insights?.length &&
    cached.transactionCount === count &&
    (count === 0 ||
      (lastUpdatedAtDate != null &&
        cached.lastTransactionUpdatedAt != null &&
        new Date(cached.lastTransactionUpdatedAt).getTime() === lastUpdatedAtDate.getTime()));

  if (cacheValid && cached.insights?.length) {
    return cached.insights;
  }

  const [topCategory, previousMonthExpenses] = await Promise.all([
    getTopExpenseCategory(userId, start, end),
    getPreviousMonthExpenses(userId, start),
  ]);

  const insights = await generateMonthlyInsights({
    ...metrics,
    topCategory: topCategory?.category,
    topCategoryAmount: topCategory?.amount,
    previousMonthExpenses,
  });

  const payload = insights.map((i) => ({
    title: i.title,
    description: i.description,
    type: i.type,
    value: i.value,
  }));

  await InsightCache.findOneAndUpdate(
    { userId, year: y, month: m },
    {
      userId,
      year: y,
      month: m,
      transactionCount: count,
      lastTransactionUpdatedAt: lastUpdatedAtDate ?? start,
      insights: payload,
    },
    { upsert: true }
  );

  return payload;
}
