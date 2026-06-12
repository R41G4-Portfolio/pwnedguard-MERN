import { z } from 'zod';

export const updateUserSchema = z.object({
	name: z.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(50, 'El nombre es demasiado largo')
		.trim()
		.optional(),
	email: z.string()
		.email('Formato de email inválido')
		.optional()
});

export const ridParamSchema = z.object({
	rid: z.string().uuid('Formato de UUID inválido')
});