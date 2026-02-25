import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { RegisterForm } from './RegisterForm';

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-3 py-4 sm:p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold sm:text-2xl">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
