import { signupSchema, loginSchema } from '../schemas/authSchemas.js';
import { escape } from 'html-escaper';

/*
Se elimina el símbolo '$' para evitar NoSQL Injection, 
pero se deja los puntos intactos para no romper los emails.
*/
const sanitizeString = (str) => {
	if (typeof str !== 'string') return str;
	return str.replace(/[$]/g, '');
};

const sanitizeHtml = (str) => {
	if (typeof str !== 'string') return str;
	return escape(str);
};

// Middleware para limpiar inputs antes de validar
export const sanitizeInput = (req, res, next) => {
	if (req.body) {
		Object.keys(req.body).forEach(key => {
			// No alteres ni email ni password aquí para no corromper caracteres válidos
			if (typeof req.body[key] === 'string' && key !== 'email' && key !== 'password') {
				req.body[key] = sanitizeString(req.body[key]);
			}
		});
	}
	next();
};

export const sanitizeOutput = (data) => {
	if (typeof data === 'string') {
		return sanitizeHtml(data);
	}
	if (Array.isArray(data)) {
		return data.map(item => sanitizeOutput(item));
	}
	if (data && typeof data === 'object') {
		const sanitized = {};
		for (const key in data) {
			sanitized[key] = sanitizeOutput(data[key]);
		}
		return sanitized;
	}
	return data;
};

export const validate = (schema, schemaName) => {
	return (req, res, next) => {
		console.log(`Validando con schema: ${schemaName}`);
		console.log(`Body recibido:`, JSON.stringify(req.body, null, 2));
		
		try {
			// Zod valida y limpia los datos del body
			const validatedData = schema.parse(req.body);
			console.log(`Validación exitosa para ${schemaName}`);
			
			req.validatedBody = validatedData;
			next();
		} 
		catch (error)
		{
			console.log(`Error de validación para ${schemaName}:`, error.errors || error.message);
			
			if (error.errors)
			{
				return res.status(400).json({
					errors: error.errors.map(err => ({
						path: err.path.join('.'),
						message: err.message
					}))
				});
			}
			next(error);
		}
	};
};

export const validateSignup = validate(signupSchema, 'signupSchema');
export const validateLogin = validate(loginSchema, 'loginSchema');