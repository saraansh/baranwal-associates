import { currentUser } from '@clerk/nextjs/server';

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
        Welcome to our application. You can explore our
        {' '}
        <a
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
        >
          Next.js Boilerplate SaaS
        </a>
        {' '}
        for more features.
      </p>
    </>
  );
};
