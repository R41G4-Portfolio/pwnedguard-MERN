import { signupSchema, loginSchema } from '../schemas/authSchemas';

export const validateSignup = (data) => {
	try {
		const result = signupSchema.parse(data);
		return { success: true, data: result, errors: null };
	} catch (error) {
		if (error.errors) {
			const errors = error.errors.reduce((acc, err) => {
				acc[err.path[0]] = err.message;
				return acc;
			}, {});
			return { success: false, data: null, errors };
		}
		return { success: false, data: null, errors: { _form: 'Error de validación' } };
	}
};

export const validateLogin = (data) => {
	try {
		const result = loginSchema.parse(data);
		return { success: true, data: result, errors: null };
	} catch (error) {
		if (error.errors) {
			const errors = error.errors.reduce((acc, err) => {
				acc[err.path[0]] = err.message;
				return acc;
			}, {});
			return { success: false, data: null, errors };
		}
		return { success: false, data: null, errors: { _form: 'Error de validación' } };
	}
};