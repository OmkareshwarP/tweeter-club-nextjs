import { CustomLoaderColors, CustomLoaderTypes } from '@/lib/constants';
import CustomLoader from './CustomLoader';

interface CustomButtonLoaderProps {
  color?: CustomLoaderColors;
  height?: number;
  width?: number;
}

const CustomButtonLoader: React.FC<CustomButtonLoaderProps> = ({
  color = CustomLoaderColors.PRIMARY,
  height = 16,
  width = 28
}) => {
  return (
    <div>
      <CustomLoader
        type={CustomLoaderTypes.THREE_DOTS}
        isTextVisible={false}
        color={color}
        height={height}
        width={width}
      />
    </div>
  );
};

export default CustomButtonLoader;
