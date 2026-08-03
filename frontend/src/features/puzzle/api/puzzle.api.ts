import { apiClient } from '../../../lib/api/client';
import type { Puzzle, MoveSubmissionRequest, MoveSubmissionResponse } from '../types/puzzle.types';
import { moveSubmissionResponseSchema } from '../types/puzzle.types';

export async function getRandomPuzzle(): Promise<Puzzle> {
    const response = await apiClient.get('/api/puzzles/random');
    return response.data;
}

export async function getPuzzle(id: string): Promise<Puzzle> {
    const response = await apiClient.get(`/api/puzzles/${id}`);
    return response.data;
}

/**
 * Submit a player move for validation against the puzzle solution.
 * The backend is the authoritative validator; the response includes
 * whether the move was correct and the opponent's forced reply (if any).
 */
export async function submitMove(
    puzzleId: string,
    move: string,
    moveNumber: number,
): Promise<MoveSubmissionResponse> {
    const body: MoveSubmissionRequest = { move, moveNumber };
    const response = await apiClient.post(`/api/puzzles/${puzzleId}/moves`, body);
    return moveSubmissionResponseSchema.parse(response.data);
}
