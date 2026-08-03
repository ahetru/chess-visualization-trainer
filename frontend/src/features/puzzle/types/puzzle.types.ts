import { z } from 'zod';

export interface Puzzle {
    id: string;
    /** Original position — the opponent (not the player) is to move in this FEN */
    fen: string;
    /** The player's color ('w' or 'b') — explicit, provided by the backend */
    playerColor: 'w' | 'b';
    /** The opponent's blunder (UCI) that sets up the puzzle, e.g. "f4h6" */
    opponentMove: string;
    /** The player's winning line (space-separated UCI). Even indices = player moves */
    solution: string;
    rating: number;
    themes: string;
}

// --- Move submission ---

export interface MoveSubmissionRequest {
    move: string;       // UCI notation (e.g. "e2e4", "e7e8q")
    moveNumber: number; // 0-based index of the player move in the solution line
}

export interface MoveSubmissionResponse {
    correct: boolean;
    solved: boolean;
    replyMove: string | null; // opponent's forced reply (UCI), null if incorrect or last ply
}

// Zod schema for validating the backend response
export const moveSubmissionResponseSchema = z.object({
    correct: z.boolean(),
    solved: z.boolean(),
    replyMove: z.string().nullable(),
});

export type MoveSubmissionResponseValidated = z.infer<typeof moveSubmissionResponseSchema>;
