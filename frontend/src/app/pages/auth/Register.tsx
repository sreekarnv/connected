import React, { useContext, useEffect } from 'react';
import { Button, Grid, GridItem, Heading, HStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
	registerBtn,
	registerContainer,
	registerformContainer,
	registerHeading,
} from './styles/registerStyles';
import InputField from '../../components/Form/InputField';
import { AuthContext } from '../../store/context/AuthContext';
import { useHistory } from 'react-router-dom';
import BaseAlert from '../../components/Alert/BaseAlert';
import useAlert from '../../hooks/useAlert';
import axios from 'axios';
import { FieldError } from '../../utils/FieldError';
import Hidden from '../../components/Hidden/Hidden';

const initialValues = {
	email: '',
	password: '',
	passwordConfirm: '',
	firstName: '',
	middleName: '',
	lastName: '',
};

const registerSchema = Yup.object().shape({
	firstName: Yup.string().required('Please provide your firstname'),
	lastName: Yup.string().required('Please provide your lastname'),
	email: Yup.string()
		.email('Please provide a valid email')
		.required('Please provide your email'),
	password: Yup.string()
		.min(6, 'Password should atleast contain a minimum of 6 characters')
		.required('Please protect your account with a password'),
	passwordConfirm: Yup.string()
		.when('password', {
			is: (val: string) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf([Yup.ref('password')], 'passwords do not match'),
		})
		.required('Confirm your password'),
});

const Register: React.FC = () => {
	const { user } = useContext(AuthContext);
	const history = useHistory();

	useEffect(() => {
		if (user) {
			return history.replace('/app/public');
		}
	}, [user, history]);

	const { setAlert, isAlertOpen, alertDetails } = useAlert();

	return (
		<>
			{isAlertOpen && <BaseAlert alertDetails={alertDetails} />}
			<Grid {...registerContainer}>
				<GridItem {...registerformContainer}>
					<Heading textTransform='uppercase' as='h3' {...registerHeading}>
						Register
					</Heading>

					<Formik
						initialValues={initialValues}
						validationSchema={registerSchema}
						onSubmit={async (values, { setErrors }) => {
							let data = { ...values } as any;
							if (data.middleName.trim() === '') {
								delete data['middleName'];
							}
							try {
								await axios({
									url: '/api/v1/users/register',
									method: 'POST',
									data,
								});

								setAlert('success', 'your account was created successfully!!');
								setTimeout(() => {
									return history.replace('/auth/login');
								}, 1500);
							} catch (err) {
								if (err.response.data.message) {
									setAlert(err.response.data.status, err.response.data.message);
								} else {
									setErrors(FieldError(err.response.data.error));
								}
							}
						}}>
						{({ isValid, dirty, isSubmitting }) => {
							return (
								<Form autoComplete='off'>
									<Hidden hide={{ md: true, sm: true }}>
										<HStack>
											<InputField
												name='firstName'
												label='First Name'
												type='text'
											/>
											<InputField
												name='middleName'
												required={false}
												label='Middle Name'
												type='text'
											/>
											<InputField
												name='lastName'
												label='Last Name'
												type='text'
											/>
										</HStack>
									</Hidden>

									<Hidden hide={{ lg: true, xl: true }}>
										<>
											<HStack>
												<InputField
													name='firstName'
													label='First Name'
													type='text'
												/>
												<InputField
													name='middleName'
													required={false}
													label='Middle Name'
													type='text'
												/>
											</HStack>
											<InputField
												name='lastName'
												label='Last Name'
												type='text'
											/>
										</>
									</Hidden>

									<InputField name='email' label='Email' type='email' />

									<Hidden hide={{ md: true, sm: true }}>
										<>
											<InputField
												name='password'
												label='Password'
												type='password'
											/>

											<InputField
												name='passwordConfirm'
												label='Password Confirm'
												type='password'
											/>
										</>
									</Hidden>

									<Hidden hide={{ lg: true, xl: true }}>
										<>
											<HStack>
												<InputField
													name='password'
													label='Password'
													type='password'
												/>

												<InputField
													name='passwordConfirm'
													label='Password Confirm'
													type='password'
												/>
											</HStack>
										</>
									</Hidden>

									<Button
										isLoading={isSubmitting}
										disabled={(!dirty && isValid) || (dirty && !isValid)}
										{...registerBtn}
										type='submit'>
										REGISTER
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

export default Register;
