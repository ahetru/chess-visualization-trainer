import { apiClient } from './client';

export interface Puzzle {
    id: string;
    fen: string;
    moves: string;
    rating: number;
    themes: string;
}

export async function getRandomPuzzle(): Promise<Puzzle> {
    const response = await apiClient.get('/api/puzzles/random');
    return response.data;
}

export async function getPuzzle(id: string): Promise<Puzzle> {
    const response = await apiClient.get(`/api/puzzles/${id}`);
    return response.data;
}
