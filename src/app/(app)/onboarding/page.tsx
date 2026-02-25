import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default async function OnboardingPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');
  if (session.user.onboardingCompleted) redirect('/dashboard');

  return (
    <div className="mx-auto max-w-lg space-y-8 py-6">
      <OnboardingFlow userEmail={session.user.email ?? undefined} userName={session.user.name ?? undefined} />
    </div>
  );
}
