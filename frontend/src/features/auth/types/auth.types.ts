import { z } from 'zod';

// --- Login ---

export interface LoginRequest {
    email: string;
    password: string;
}

export const loginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// --- Register ---

export interface RegisterRequest {
    email: string;
    password: string;
    userName: string;
}

export const registerRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    userName: z.string().min(3, 'Username must be at least 3 characters'),
});

// --- Auth response (login) ---

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export const authResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenType: z.string(),
    expiresIn: z.number(),
});

// --- User DTO (register response) ---

export interface UserDto {
    id: string;
    email: string;
    userName: string;
    role: string;
}

export const userDtoSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    userName: z.string(),
    role: z.string(),
});
