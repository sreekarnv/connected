import * as React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
	Box,
	Button,
	FormControl,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	FormLabel,
	Heading,
	Text,
} from '@chakra-ui/react';
import { PostContext } from '../../../context/PostContext';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
	const [text, setText] = React.useState('');
	const { onCreatePostClose, isCreatePostOpen } =
		React.useContext(PostContext)!;

	return (
		<Modal
			size='full'
			motionPreset='slideInBottom'
			isOpen={isCreatePostOpen!}
			scrollBehavior='inside'
			onClose={onCreatePostClose!}>
			<ModalOverlay />
			<ModalContent>
				<ReactQuill value={text} onChange={(value: any) => setText(value)} />
			</ModalContent>
		</Modal>
	);
};

export default CreatePost;
