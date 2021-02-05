import React, { InputHTMLAttributes } from 'react';
import { useField, Field } from 'formik';
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Textarea,
} from '@chakra-ui/react';

type Props = InputHTMLAttributes<HTMLTextAreaElement> & {
	name: string;
	size?: any;
	label: string;
	type?: string;
	bg?: any;
};

const TextAreaField: React.FC<Props> = ({
	size = 'md',
	label,
	type,
	bg,
	required = true,
	...props
}) => {
	const [{ name, value: __, ...field }, { error, touched, value }] = useField(
		props
	);
	return (
		<FormControl mb={5} isRequired={required} isInvalid={touched && !!error}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Field>
				{() => {
					return (
						<Textarea
							focusBorderColor='primary.500'
							id={name}
							size={size}
							value={value}
							bg={bg}
							bgColor={touched && error ? 'red.200' : 'secondary.200'}
							{...field}
							{...props}
						/>
					);
				}}
			</Field>
			<FormErrorMessage>{touched && error ? error : ''}</FormErrorMessage>
		</FormControl>
	);
};

export default TextAreaField;
