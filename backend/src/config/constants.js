export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // 'Strict' POR 'None' 
    // Esto le permite al navegador adjuntar la cookie en las peticiones fetch de tu React SPA
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/'
};

export const JWT_CONFIG = {
    expiresIn: '7d',
    algorithm: 'HS256'
};

export const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const RATE_LIMIT = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
};

export const BCYPT_CONFIG = {
    saltRounds: 10
};