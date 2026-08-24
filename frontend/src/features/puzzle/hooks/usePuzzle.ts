import { useCallback, useEffect, useState } from 'react';
import { getRandomPuzzle } from '../api/puzzle.api';
import type { Puzzle } from '../types/puzzle.types';

export function usePuzzle() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        getRandomPuzzle()
            .then((p) => {
                if (cancelled) return;
                setPuzzle(p);
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
    }, [reloadKey]);

    const loadNext = useCallback(() => {
        setError(null);
        setIsLoading(true);
        setReloadKey((k) => k + 1);
    }, []);

    return { puzzle, isLoading, error, loadNext };
}
