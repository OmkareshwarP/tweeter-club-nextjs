'use client';

import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className='font-semibold flex justify-center items-center min-h-screen bg-[#181919]'>
      <div className='text-center mx-6 p-6 bg-[##03010d] w-full max-w-md rounded-lg border-2 border-gray-500 shadow-lg'>
        <div className='font-extrabold text-6xl text-red-500 mb-4'>404</div>
        <div className='text-2xl font-bold text-white mb-6'>Page Not Found</div>
        <div className='font-semibold text-[#b5bdbd] mb-8'>Oops! The page you are looking for doesn’t exist.</div>
        <button
          className='px-4 py-2 bg-white text-black rounded-lg'
          onClick={() => {
            router.replace('/');
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
