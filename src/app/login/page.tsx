import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const session = await getServerSession();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-3 py-4 sm:p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold sm:text-2xl">Sign in to LedgerAI</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
