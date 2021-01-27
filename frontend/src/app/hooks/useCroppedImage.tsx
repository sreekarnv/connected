import { useState, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

const useCroppedImage = () => {
	const [image, setImage] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<any>(null);
	const [imageSettings, setImageSettings] = useState({});
	const [croppedImage, setCroppedImage] = useState<any>(null);

	const {
		isOpen: showImageCropper,
		onClose: closeImageCropper,
		onOpen: openImageCropper,
	} = useDisclosure();

	useEffect(() => {
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
