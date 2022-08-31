import React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { ImageSettings } from '../types/api';

const useCroppedImage = () => {
	const [image, setImage] = React.useState<File | null>(null);
	const [imageUrl, setImageUrl] = React.useState<any>(null);
	const [imageSettings, setImageSettings] = React.useState<ImageSettings>();
	const [croppedImage, setCroppedImage] = React.useState<any>(null);

	const {
		isOpen: showImageCropper,
		onClose: closeImageCropper,
		onOpen: openImageCropper,
	} = useDisclosure();

	React.useEffect(() => {
		if (image) {
			setImageUrl(URL.createObjectURL(image));
			openImageCropper();
		}
	}, [image, openImageCropper]);

	const resetValues = () => {
		setImage(null);
		setImageUrl(null);
		setCroppedImage(null);
	};

	return {
		image,
		setImage,
		showImageCropper,
		closeImageCropper,
		imageSettings,
		setImageSettings,
		imageUrl,
		resetValues,
		setImageUrl,
		setCroppedImage,
		croppedImage,
		openImageCropper,
	};
};

export default useCroppedImage;
