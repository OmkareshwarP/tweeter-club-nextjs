'use client';

import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <>
      <div>OOPS!</div>
      <div>404 Error</div>
      <div>Page not found</div>
      <div>
        Go to{' '}
        <button
          className='px-2 py-1 rounded-lg'
          onClick={() => {
            router.push('/');
          }}
        >
          Home
        </button>
      </div>
    </>
  );
}
