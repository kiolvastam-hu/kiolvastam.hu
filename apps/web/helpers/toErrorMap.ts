
type FieldError = {
	param: string,
	msg: string,
	nestedErrors?: FieldError[],
}

export const toErrorMap = (errors: FieldError[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ param, msg, nestedErrors }) => {
		if(nestedErrors) {
			nestedErrors.forEach(nestedError => {
				errorMap[nestedError.param] = nestedError.msg;
			})
		}
		errorMap[param] = msg;
	})
	return errorMap;
}