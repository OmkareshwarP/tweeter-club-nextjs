/* eslint-disable @next/next/no-img-element */
import Modal from 'react-modal';
import { X } from 'lucide-react';

interface ImageViewModalProps {
  isDialogVisible: boolean;
  setIsDialogVisible: (value: boolean) => void;
  imageUrl: string;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ isDialogVisible = false, setIsDialogVisible, imageUrl }) => {
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0rem'
    },
    overlay: { zIndex: 20 }
  };

  return (
    <>
      <Modal
        isOpen={isDialogVisible}
        onRequestClose={closeDialog}
        style={modalStyle}
        contentLabel='ImageViewModal'
        ariaHideApp={false}
        className={'w-[100%] h-[100%] relative top-0 left-0 right-0 outline-none'}
      >
        <div className={`relative w-[100%] h-[100%]`}>
          <X
            className='absolute right-1 z-20 flex justify-end m-2 w-[32px] h-[32px] text-white cursor-pointer'
            onClick={closeDialog}
          />
          <div className='w-[100%] h-[100%] py-2 flex flex-row justify-center items-center'>
            <img src={imageUrl} width={'auto'} height={'auto'} alt='image' />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImageViewModal;
