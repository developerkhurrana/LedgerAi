import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { connectDb, User } from '@/lib/db';
import { BusinessProfileForm } from '@/components/profile/BusinessProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) redirect('/login');

  await connectDb();
  const user = await User.findById(userId)
    .select(
      'email name businessName legalName gstin pan phone addressLine1 addressLine2 city state postalCode country baseCurrency financialYearStartMonth'
    )
    .lean();

  if (!user) redirect('/login');

  const profile = {
    email: user.email as string,
    name: (user as { name?: string }).name ?? '',
    businessName: (user as { businessName?: string }).businessName ?? '',
    legalName: (user as { legalName?: string }).legalName ?? '',
    gstin: (user as { gstin?: string }).gstin ?? '',
    pan: (user as { pan?: string }).pan ?? '',
    phone: (user as { phone?: string }).phone ?? '',
    addressLine1: (user as { addressLine1?: string }).addressLine1 ?? '',
    addressLine2: (user as { addressLine2?: string }).addressLine2 ?? '',
    city: (user as { city?: string }).city ?? '',
    state: (user as { state?: string }).state ?? '',
    postalCode: (user as { postalCode?: string }).postalCode ?? '',
    country: (user as { country?: string }).country ?? 'India',
    baseCurrency: (user as { baseCurrency?: string }).baseCurrency ?? 'INR',
    financialYearStartMonth:
      (user as { financialYearStartMonth?: number }).financialYearStartMonth ?? 3,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Business profile
        </h1>
        <p className="text-sm text-muted-foreground">
          These details are used for invoices, GST calculations, and reports.
        </p>
      </div>

      <BusinessProfileForm userId={userId} initialProfile={profile} />
    </div>
  );
}
