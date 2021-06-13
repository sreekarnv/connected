import * as React from 'react';

import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	FormHelperText,
	Button,
	Box,
	Container,
	Grid,
	Heading,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import FormInput from '../../../components/FormInput';
import useRegisterMutation from '../../../hooks/api/users/mutations/useRegisterMutation';

interface RegisterProps {}

const initialValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: '',
};

const Register: React.FC<RegisterProps> = ({}) => {
	const { isLoading, mutate, error } = useRegisterMutation();
	return (
		<>
			<Container py='5'>
				<Heading textAlign='center' mb='4'>
					Register
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
								<FormInput name='name' label='Name' />
								<FormInput name='email' label='Email' type='email' />
								<FormInput name='password' label='Password' type='password' />
								<FormInput
									name='passwordConfirm'
									label='Password Confirm'
									type='password'
								/>
								<Button type='submit' isLoading={isLoading}>
									Register
								</Button>
							</Form>
						);
					}}
				</Formik>
			</Container>
		</>
	);
};

export default Register;
