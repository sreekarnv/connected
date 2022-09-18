import React from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import {
	Box,
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
} from '@chakra-ui/react';
import { ImageSettings } from '../types/api';

interface Props {
	photo: any;
	showImageCropper: boolean;
	closeImageCropper: () => void;
	imageSettings?: ImageSettings;
	setImageSettings: any;
	setCroppedImage: any;
}

const ImageCropper: React.FC<Props> = ({
	photo,
	showImageCropper,
	closeImageCropper,
	setImageSettings,
	setCroppedImage,
	imageSettings,
}) => {
	const [imageInstance, setImageInstance] = React.useState<any>();

	const saveDetails = () => {
		if (imageInstance) {
			imageInstance.getCroppedCanvas().toBlob((blob: Blob) => {
				setCroppedImage(URL.createObjectURL(blob));
			});

			setImageSettings(imageInstance.getData({ rounded: true }));

			closeImageCropper();
		}
	};

	return (
		<Modal
			size='xl'
			isOpen={showImageCropper}
			scrollBehavior='inside'
			onClose={closeImageCropper}>
			<ModalOverlay />
			<ModalContent>
				<Box>
					<ModalCloseButton />

					<Box h='100%' pt={12}>
						{showImageCropper && photo && (
							<>
								<Cropper
									style={{ height: 400, width: '100%' }}
									src={photo}
									aspectRatio={1 / 1}
									viewMode={1}
									guides={true}
									minCropBoxHeight={20}
									minCropBoxWidth={20}
									background={false}
									responsive={true}
									autoCropArea={1}
									onInitialized={(instance) => {
										setImageInstance(instance);
									}}
									{...imageSettings}
								/>
							</>
						)}
						<br />
					</Box>
					<ModalFooter>
						<Button onClick={saveDetails}>Save</Button>
					</ModalFooter>
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default ImageCropper;
