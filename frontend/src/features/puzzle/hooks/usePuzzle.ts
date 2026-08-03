import { useEffect, useState } from 'react';
import { getRandomPuzzle } from '../api/puzzle.api';
import type { Puzzle } from '../types/puzzle.types';

export function usePuzzle() {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRandomPuzzle()
            .then(setPuzzle)
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
            .finally(() => setIsLoading(false));
    }, []);

    return { puzzle, isLoading, error };
}