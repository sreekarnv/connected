export const removeUndefinedFields = (body: any, allowedFields: string[]) => {
	Object.keys(body).forEach((field) => {
		const isAllowed = allowedFields.includes(field);
		if (!isAllowed || (isAllowed && !body[field])) {
			delete body[field];
		}
	});

	return body;
};

export const removeUnwantedFields = (doc: any, excludeFields: string[]) => {
	Object.keys(doc).forEach((field) => {
		const exclude = excludeFields.includes(field);
		if (exclude && doc[field]) {
			delete doc[field];
		}
	});

	return doc;
};
