import React from 'react';
import {
	Box,
	Image,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';

interface ImagePreviewProps {
	isOpen: boolean;
	onClose: () => void;
	imageUrl: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
	isOpen,
	onClose,
	imageUrl,
}) => {
	return (
		<>
			<Modal
				size='xl'
				isOpen={isOpen}
				scrollBehavior='inside'
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<Box>
						<ModalHeader>Cropped Image Preview</ModalHeader>
						<ModalCloseButton />

						<Box display='flex' justifyContent='center'>
							<Image boxSize='500px' src={imageUrl} alt='image preview' />
						</Box>
						<ModalFooter />
					</Box>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ImagePreview;
