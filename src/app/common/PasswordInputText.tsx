import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface IPasswordInputTextProps {
  pass: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const PasswordInputText: React.FC<IPasswordInputTextProps> = ({ pass, handleChange }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className='text-black relative w-full'>
      <input
        className='w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        type={isShowPassword ? 'text' : 'password'}
        value={pass}
        onChange={(e) => handleChange(e, 'password')}
        placeholder='Password'
      />
      <button
        type='button'
        className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent p-1'
        onClick={handleClick}
      >
        {isShowPassword ? (
          <EyeSlashIcon className='w-5 h-5 bg-transparent' />
        ) : (
          <EyeIcon className='w-5 h-5 bg-transparent' />
        )}
      </button>
    </div>
  );
};

export default PasswordInputText;
