import { CustomLoaderColors, CustomLoaderTypes } from '@/lib/constants';
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

interface CustomLoaderProps {
  type?: CustomLoaderTypes;
  height?: number;
  width?: number;
  color?: CustomLoaderColors;
  isTextVisible?: boolean;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  type = CustomLoaderTypes.THREE_DOTS,
  color = CustomLoaderColors.PRIMARY,
  height = 50,
  width = 50,
  isTextVisible = true
}) => {
  const getLoader = () => {
    switch (type) {
      case CustomLoaderTypes.THREE_DOTS:
        return <ThreeDots color={color} height={height} width={width} />;
      default:
        break;
    }
  };
  return (
    <div className={`flex flex-col justify-center items-center text-lg font-semibold`}>
      <div>{getLoader()}</div>
      {isTextVisible && (
        <div className={`mt-4`} style={{ color: color }}>
          Please wait, while we fetch data...
        </div>
      )}
    </div>
  );
};

export default CustomLoader;
