'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserSidebar from './components/UserSidebar';
import UserNavbar from './components/UserNavbar';
import * as React from 'react';

export default function UserDashLayout({ children, params }) {
  const id = React.use(params).id; // Unwrap params with React.use()
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Layout session status:", status, "session:", session);
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session.user.role === 'admin') {
        router.push('/admindash');
      } else if (session.user.id !== id) {
        router.push(`/userdash/${session.user.id}`);
      }
    }
  }, [status, session, id, router]);

  if (status === 'loading') {
    return <p className="text-center">Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return null; // Prevent rendering until redirect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar userId={id} />
      <div className="flex-1 flex flex-col">
        <UserNavbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}