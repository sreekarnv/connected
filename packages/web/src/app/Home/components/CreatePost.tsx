import * as React from 'react';
import EditorJs from 'react-editor-js';
import {
	Modal,
	ModalContent,
	ModalOverlay,
	Container,
	useColorMode,
	Box,
	Heading,
	ModalHeader,
	ModalCloseButton,
} from '@chakra-ui/react';
import { PostContext } from '../../../context/PostContext';

interface CreatePostProps {}

const DEFAULT_INITIAL_DATA = () => {
	return {
		time: new Date().getTime(),
		blocks: [
			{
				type: 'header',
				data: {
					text: 'This is my awesome editor!',
					level: 1,
				},
			},
		],
	};
};

const EDITOR_HOLDER_ID = 'editorjs';

const CreatePost: React.FC<CreatePostProps> = ({}) => {
	const [editorData, setEditorData] = React.useState(DEFAULT_INITIAL_DATA);
	const { onCreatePostClose, isCreatePostOpen } =
		React.useContext(PostContext)!;

	const { colorMode } = useColorMode();

	return (
		<Modal
			size='full'
			motionPreset='slideInBottom'
			isOpen={isCreatePostOpen!}
			scrollBehavior='inside'
			onClose={onCreatePostClose!}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create Post</ModalHeader>
				<ModalCloseButton />
				<Container py='10' maxW='container.lg'>
					<Box
						borderRadius='10'
						bgColor={colorMode === 'light' ? 'gray.100' : 'gray.800'}
						minH='lg'
						py='10'>
						<EditorJs placeholder='start typing here....' />
					</Box>
				</Container>
			</ModalContent>
		</Modal>
	);
};

export default CreatePost;
