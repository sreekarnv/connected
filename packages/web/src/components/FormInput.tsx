import { FormControl } from '@chakra-ui/form-control';
import {
	FormErrorMessage,
	FormLabel,
	Input,
	InputProps,
	Textarea,
} from '@chakra-ui/react';
import * as React from 'react';
import { useField } from 'formik';

type FormInputProps = React.InputHTMLAttributes<
	HTMLInputElement | HTMLTextAreaElement
> &
	InputProps & {
		name: string;
		label: string;
		multiple?: boolean;
	};

const FormInput: React.FC<FormInputProps> = ({
	label,
	name,
	multiple,
	required = true,
	size: _,
	...props
}) => {
	const [field, { error }] = useField({ name, ...props });

	let C: any = multiple ? Textarea : Input;

	return (
		<>
			<FormControl mb='5' id={name} isInvalid={!!error} isRequired={required}>
				<FormLabel>{label}</FormLabel>
				<C
					variant='filled'
					required={required}
					rows={multiple ? 10 : undefined}
					{...field}
					{...props}
				/>
				<FormErrorMessage>{error}</FormErrorMessage>
			</FormControl>
		</>
	);
};

export default FormInput;
