import { apiClient } from '../../../lib/api/client';
import type { LoginRequest, RegisterRequest, AuthResponse, UserDto } from '../types/auth.types';
import { authResponseSchema, userDtoSchema } from '../types/auth.types';

/**
 * Authenticate with email and password.
 * Returns an access/refresh token pair on success.
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', request);
    return authResponseSchema.parse(response.data);
}

/**
 * Create a new user account.
 * Returns the newly created user on success.
 */
export async function register(request: RegisterRequest): Promise<UserDto> {
    const response = await apiClient.post('/api/auth/register', request);
    return userDtoSchema.parse(response.data);
}
