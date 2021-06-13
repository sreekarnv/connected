import * as React from 'react';
import { Button, Container, Grid, Heading } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import FormInput from '../../../components/FormInput';
import useLoginMutation from '../../../hooks/api/users/mutations/useLoginMutation';

interface LoginProps {}

const initialValues = {
	email: '',
	password: '',
};

const Login: React.FC<LoginProps> = ({}) => {
	const { isLoading, mutate, error } = useLoginMutation();
	return (
		<Container py='5'>
			<Heading textAlign='center' mb='4'>
				Login
			</Heading>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { resetForm, setErrors }) => {
					mutate(values);
					if (error) {
						setErrors({ ...error.response.data.err.errors });
					} else {
						resetForm();
					}
				}}>
				{() => {
					return (
						<Form autoComplete='off'>
							<FormInput name='email' label='Email' />
							<FormInput name='password' label='Password' type='password' />
							<Button type='submit' isLoading={isLoading}>
								Login
							</Button>
						</Form>
					);
				}}
			</Formik>
		</Container>
	);
};

export default Login;
