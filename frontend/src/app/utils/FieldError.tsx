export const FieldError = (err: any) => {
	const errorObj: any = {};
	Object.keys(err.errors).forEach((er: any) => {
		errorObj[er] = err.errors[er].message;
	});

	return errorObj;
};
