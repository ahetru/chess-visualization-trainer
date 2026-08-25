import { apiClient } from '../../../lib/api/client';
import type { UserDto } from '../../auth/types/auth.types';
import { userDtoSchema } from '../../auth/types/auth.types';

export async function getCurrentUser(): Promise<UserDto> {
    const response = await apiClient.get('/api/users/me');
    return userDtoSchema.parse(response.data);
}
