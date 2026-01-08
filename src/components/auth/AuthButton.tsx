'use client';

import { authClient } from '@/lib/auth/client';
import Link from 'next/link';

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {user.name || user.email}
        </span>
        <button
          onClick={() => authClient.signOut()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/sign-in"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
}
