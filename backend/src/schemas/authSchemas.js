import { z } from 'zod';

// La Regex flexible que no bloquea dominios raros
const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;

export const signupSchema = z.object({
	email: z.string()
		.trim() // Remueve espacios accidentales antes/después
		.regex(emailRegex, 'Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)')
		.min(5, 'El email es demasiado corto')
		.max(100, 'El email es demasiado largo'),
	password: z.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres')
		.max(100, 'La contraseña es demasiado larga')
		.regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
		.regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
		.regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
	name: z.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(50, 'El nombre es demasiado largo')
		.trim()
});

export const loginSchema = z.object({
	email: z.string().trim().regex(emailRegex, 'Ingresa un correo electrónico válido'),
	password: z.string().min(1, 'La contraseña es requerida')
});