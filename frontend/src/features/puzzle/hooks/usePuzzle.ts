import { useEffect, useState } from 'react';
import { getRandomPuzzle } from '../api/puzzle.api';
import type { Puzzle } from '../types/puzzle.types';

export function usePuzzle() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    return { puzzle, isLoading, error };
}