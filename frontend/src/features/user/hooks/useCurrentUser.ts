import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/user.api';
import type { UserDto } from '../../auth/types/auth.types';

export function useCurrentUser() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getCurrentUser()
            .then((u) => {
                if (cancelled) return;
                setUser(u);
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : 'Unknown error');
            })
            .finally(() => {
                if (cancelled) return;
                setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { user, isLoading, error };
}
