'use client';

import { UserCog } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserNavbar = () => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);

  // Ensure client-specific rendering happens after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Consistent className for header to avoid mismatches
  const headerClass = 'bg-white shadow-sm z-20 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 left-0 right-0';
  // Use a fallback className for server render, updated on client
  const titleClass = isClient
    ? 'text-xl ml-14 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text'
    : 'text-xl ml-14 font-extrabold';

  return (
    <header className={headerClass}>
      {/* Use a div as a fallback for server render to match client structure */}
      {isClient ? (
        <h1 className={titleClass}>
          Welcome, {session?.user?.fname} {session?.user?.lname}!
        </h1>
      ) : (
        <div className={titleClass}>
          Welcome, User!
        </div>
      )}
      
      <Link
        href={`/userdash/${session?.user?.id}/profile`}
        className="flex items-center justify-center p-2 rounded-full w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md transform hover:scale-105 transition-all duration-300"
      >
        <UserCog size={18} />
        <span className="sr-only">Profile Settings</span>
      </Link>
    </header>
  );
};

export default UserNavbar;