import { Container, Heading, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as React from 'react';
import FormInput from '../../src/shared/components/FormInput';
import useLoginMutation from '../../src/User/hooks/api/mutations/useLoginMutation';

interface LoginPageProps {}

const initialValues = {
	email: '',
	password: '',
};

const LoginPage: React.FC<LoginPageProps> = ({}) => {
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

export default LoginPage;
