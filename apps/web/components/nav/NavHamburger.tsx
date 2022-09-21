import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';

export const NavHamburger = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <IconButton
      size={'md'}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      aria-label={'Open Menu'}
      display={{ md: 'none' }}
      onClick={isOpen ? onClose : onOpen}
    />
  );
};
