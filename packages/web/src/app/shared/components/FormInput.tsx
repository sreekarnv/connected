import { FormControl } from '@chakra-ui/form-control';
import {
	FormErrorMessage,
	FormLabel,
	Input,
	InputProps,
} from '@chakra-ui/react';
import * as React from 'react';
import { useField } from 'formik';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> &
	InputProps & {
		name: string;
		label: string;
	};

const FormInput: React.FC<FormInputProps> = ({
	label,
	name,
	required = true,
	size: _,
	...props
}) => {
	const [field, { error }] = useField({ name, ...props });

	return (
		<>
			<FormControl mb='5' id={name} isInvalid={!!error} isRequired={required}>
				<FormLabel>{label}</FormLabel>
				<Input variant='filled' required={required} {...field} {...props} />
				<FormErrorMessage>{error}</FormErrorMessage>
			</FormControl>
		</>
	);
};

export default FormInput;
