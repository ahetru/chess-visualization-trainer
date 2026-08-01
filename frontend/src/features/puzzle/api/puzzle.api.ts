import { apiClient } from '../../../lib/api/client';
import type { Puzzle } from '../types/puzzle.types';

export async function getRandomPuzzle(): Promise<Puzzle> {
    const response = await apiClient.get('/api/puzzles/random');
    return response.data;
}

export async function getPuzzle(id: string): Promise<Puzzle> {
    const response = await apiClient.get(`/api/puzzles/${id}`);
    return response.data;
}
