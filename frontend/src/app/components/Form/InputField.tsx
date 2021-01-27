import React, { InputHTMLAttributes } from 'react';
import { useField, Field } from 'formik';
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	size?: any;
	label: string;
	type?: string;
	passwordValue?: string;
};

const InputField: React.FC<Props> = ({
	size: _,
	label,
	type,
	passwordValue,
	required = true,
	...props
}) => {
	const [{ name, value: __, ...field }, { error, touched, value }] = useField(
		props
	);

	return (
		<FormControl isRequired={required} isInvalid={touched && !!error} mb={5}>
			<FormLabel htmlFor={name} textTransform='capitalize'>
				{label}
			</FormLabel>
			<Input
				bgColor={touched && error ? 'red.200' : 'secondary.200'}
				as={Field}
				color='gray.700'
				type={type}
				value={value}
				id={name}
				{...field}
				{...props}
			/>
			<FormErrorMessage>{touched && error ? error : ''}</FormErrorMessage>
		</FormControl>
	);
};

export default InputField;
