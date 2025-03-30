'use client';

const Footer: React.FC = () => {
  return (
    <>
      <div className='px-1 w-[100%] flex flex-wrap space-x-2 justify-center'>
        <a href='/terms' target='_blank' className='text-[15px] text-gray-500 hover:underline'>
          Terms of Service
        </a>
        <a href='/privacy' target='_blank' className='text-[15px] text-gray-500 hover:underline'>
          Privacy Policy
        </a>
        <a href='/about' target='_blank' className='text-[15px] text-gray-500 hover:underline'>
          About
        </a>
      </div>
      <div className='px-1 w-[100%] text-[15px] text-gray-500 text-center'>© 2025 Tweeter Club</div>
    </>
  );
};

export default Footer;
