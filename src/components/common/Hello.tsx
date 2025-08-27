import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export const Hello = async () => {
  const user = await currentUser();

  return (
    <>
      <p>
        {`👋 `}
        Hello,
        {' '}
        {user?.primaryEmailAddress?.emailAddress ?? 'Guest'}
        !
      </p>
      <p>
        Welcome to Baranwal Associates. You can explore our
        {' '}
        <Link
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="/#projects"
        >
          architectural projects
        </Link>
        {' '}
        and services.
      </p>
    </>
  );
};
