import React, { useContext, useEffect } from 'react';
import { Button, Grid, GridItem, Heading } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import InputField from '../../components/Form/InputField';
import {
	loginContainer,
	loginformContainer,
	loginBtn,
	loginHeading,
} from './styles/loginStyles';
import { AuthContext } from '../../store/context/AuthContext';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import useAlert from '../../hooks/useAlert';
import BaseAlert from '../../components/Alert/BaseAlert';
import { FieldError } from '../../utils/FieldError';

const intitalValues = {
	email: '',
	password: '',
};

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email('Please provide a valid email')
		.required('Please provide your email'),
	password: Yup.string().required('Please enter your password'),
});

const Login: React.FC = () => {
	const { user, updateUser } = useContext(AuthContext);
	const { setAlert, alertDetails, isAlertOpen } = useAlert();
	const history = useHistory();

	useEffect(() => {
		if (user) {
			return history.replace('/app/public');
		}
	}, [user, history]);

	return (
		<>
			{isAlertOpen && <BaseAlert alertDetails={alertDetails} />}
			<Grid {...loginContainer}>
				<GridItem {...loginformContainer}>
					<Heading textTransform='uppercase' as='h3' {...loginHeading}>
						Login
					</Heading>

					<Formik
						initialValues={intitalValues}
						validationSchema={loginSchema}
						onSubmit={async (values, { setErrors }) => {
							try {
								const res: AxiosResponse = await axios({
									url: '/api/v1/users/login',
									method: 'POST',
									data: { ...values },
								});

								setAlert('success', 'You are logged in!!');

								setTimeout(() => {
									updateUser(res.data.user);
								}, 1500);
							} catch (err) {
								if (err.response.data.error) {
									setErrors(FieldError(err.response.data.error));
								} else {
									setAlert('error', err.response.data.message);
								}
							}
						}}>
						{({ dirty, isValid, isSubmitting }) => {
							return (
								<Form autoComplete='off'>
									<InputField name='email' label='Email' type='email' />
									<InputField
										name='password'
										label='Password'
										type='password'
									/>
									<Button
										isLoading={isSubmitting}
										disabled={(!dirty && isValid) || (dirty && !isValid)}
										{...loginBtn}
										type='submit'>
										LOGIN
									</Button>
								</Form>
							);
						}}
					</Formik>
				</GridItem>
			</Grid>
		</>
	);
};

export default Login;
