import * as React from 'react';
import {
	Modal,
	ModalContent,
	ModalOverlay,
	Container,
	ModalHeader,
	ModalCloseButton,
	Button,
} from '@chakra-ui/react';
import { PostContext } from '../../../context/PostContext';
import { Form, Formik } from 'formik';
import FormInput from '../../../components/FormInput';
import useCreatePost from '../../../hooks/api/posts/mutations/useCreatePost';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
	const { mutate, isLoading } = useCreatePost();
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
				<ModalHeader>Create Post</ModalHeader>
				<ModalCloseButton />
				<Container py='10' maxW='container.lg'>
					<Formik
						initialValues={{ content: '' }}
						onSubmit={async (values, { resetForm }) => {
							await mutate(values);
							resetForm();
							onCreatePostClose!();
						}}>
						{() => {
							return (
								<Form>
									<FormInput label='Content' name='content' multiple />
									<Button
										isLoading={isLoading}
										colorScheme='primary'
										type='submit'>
										Save
									</Button>
								</Form>
							);
						}}
					</Formik>
				</Container>
			</ModalContent>
		</Modal>
	);
};

export default CreatePost;
