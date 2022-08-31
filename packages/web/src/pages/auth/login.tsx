import React from 'react';
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Button,
} from '@chakra-ui/react';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useLoginMutation from '../../modules/auth/hooks/useLoginMutation';
import AuthLayout from '../../modules/auth/layouts/AuthLayout';
import { useSiteMetadata } from '../../modules/shared/hooks/useSiteMetadata';
import { HeadFC } from 'gatsby';

interface LoginPageProps {
	path?: string;
}

const validationSchema = Yup.object()
	.shape({
		email: Yup.string()
			.required('user must provide their email')
			.email('please provide a valid email')
			.trim(),
		password: Yup.string()
			.required('user must provide a password')
			.min(6, 'password must contain atleast 6 characters'),
	})
	.required();

export const Head: HeadFC = () => {
	const siteData = useSiteMetadata();
	const title = `Login | ${siteData.title}`;
	const description = siteData.description;

	return (
		<>
			<title>{title}</title>
			<meta name='description' content={description} />
		</>
	);
};

const LoginPage: React.FC<LoginPageProps> = ({}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const { isLoading, mutate } = useLoginMutation();

	const onSubmit = (values: FieldValues) => {
		mutate({
			email: values.email,
			password: values.password,
		});

		reset();
	};

	return (
		<>
			<AuthLayout heading='Login'>
				<form noValidate onSubmit={handleSubmit(onSubmit)}>
					<FormControl mb='4' isRequired isInvalid={!!errors.email}>
						<FormLabel>Email address</FormLabel>
						<Input type='email' {...register('email')} />
						<FormErrorMessage>
							{errors.email?.message as string}
						</FormErrorMessage>
					</FormControl>

					<FormControl isRequired isInvalid={!!errors.password}>
						<FormLabel>Password</FormLabel>
						<Input type='password' {...register('password')} />
						<FormErrorMessage>
							{errors.password?.message as string}
						</FormErrorMessage>
					</FormControl>

					<Button isLoading={isLoading} colorScheme='blue' type='submit' mt='5'>
						Login
					</Button>
				</form>
			</AuthLayout>
		</>
	);
};

export default LoginPage;
