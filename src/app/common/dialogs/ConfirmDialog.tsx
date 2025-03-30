import Modal from 'react-modal';
import { MODAL_STYLE } from '@/lib/constants';
import CustomButtonLoader from '../CustomButtonLoader';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isDialogVisible: boolean;
  setIsDialogVisible: (value: boolean) => void;
  title?: string;
  titleClassName?: string;
  description: string;
  descriptionClassName?: string;
  primaryBtnText: string;
  primaryBtnClassName: string;
  primaryBtnOnClickHandler: () => void;
  secondaryBtnText: string;
  secondaryBtnClassName: string;
  secondaryBtnOnClickHandler: () => void;
  isActionSpinnerVisible?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isDialogVisible = false,
  setIsDialogVisible,
  titleClassName,
  title,
  descriptionClassName,
  description,
  primaryBtnText,
  primaryBtnClassName,
  primaryBtnOnClickHandler,
  secondaryBtnText,
  secondaryBtnClassName,
  secondaryBtnOnClickHandler,
  isActionSpinnerVisible = false
}) => {
  const closeDialog = () => {
    if (!isActionSpinnerVisible) {
      setIsDialogVisible(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isDialogVisible}
        onRequestClose={closeDialog}
        style={MODAL_STYLE}
        contentLabel='Confirm Dialog'
        ariaHideApp={false}
      >
        <div className={`p-6`}>
          <div className='flex justify-end cursor-pointer' onClick={closeDialog}>
            <X className='w-[25px] h-[25px] text-red-400' />
          </div>
          <div
            style={{ height: 'fit-content', width: 'fit-content' }}
            className={`flex flex-col justify-center text-[1.4rem] text-center font-semibold space-y-1`}
          >
            <h1 className={titleClassName}>{title}</h1>
            <h1 className={descriptionClassName}>{description}</h1>
            <div className='flex flex-row justify-center pt-[1rem] space-x-12'>
              <button type='button' onClick={primaryBtnOnClickHandler} className={primaryBtnClassName}>
                {primaryBtnText}
              </button>
              <button
                type='button'
                onClick={secondaryBtnOnClickHandler}
                className={`${secondaryBtnClassName} ${
                  isActionSpinnerVisible ? 'pointer-events-none' : 'cursor-pointer'
                }`}
              >
                {isActionSpinnerVisible ? <CustomButtonLoader /> : secondaryBtnText}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
