import {
	Button,
	Container,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Textarea,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
import useCreatePostMutation from '../hooks/useCreatePostMutation';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';

const validationSchema = Yup.object()
	.shape({
		content: Yup.string().required('This is a required field').trim(),
	})
	.required();

interface CreatePostPageProps {}

const CreatePostPage: React.FC<CreatePostPageProps> = ({}) => {
	const { isLoading, mutate } = useCreatePostMutation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const onSubmit = (values: FieldValues) => {
		mutate({
			content: values.content,
		});
		reset();
	};

	return (
		<>
			<Container maxW='container.lg' py='5'>
				<Button as={Link} to='/app/feed'>
					Back
				</Button>
			</Container>
			<Container>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<FormControl isRequired isInvalid={!!errors.content}>
						<FormLabel>Content</FormLabel>
						<Textarea {...register('content')} />
						<FormErrorMessage>
							{errors.content?.message as string}
						</FormErrorMessage>
					</FormControl>

					<Button isLoading={isLoading} colorScheme='blue' mt='4' type='submit'>
						Submit
					</Button>
				</form>
			</Container>
		</>
	);
};

export default CreatePostPage;
