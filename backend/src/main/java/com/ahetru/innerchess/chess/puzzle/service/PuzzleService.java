package com.ahetru.innerchess.chess.puzzle.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;
import com.ahetru.innerchess.chess.puzzle.dto.MoveSubmissionRequest;
import com.ahetru.innerchess.chess.puzzle.dto.MoveSubmissionResponse;
import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;
import com.ahetru.innerchess.chess.puzzle.exception.PuzzleNotFoundException;
import com.ahetru.innerchess.chess.puzzle.mapper.PuzzleMapper;

@Service
public class PuzzleService {

    private final PuzzleRepository repository;
    private final PuzzleMapper mapper;

    public PuzzleService(PuzzleRepository repository, PuzzleMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public PuzzleDto getRandomPuzzle() {
        Puzzle puzzle = repository.findRandom()
            .orElseThrow(() -> new PuzzleNotFoundException("No puzzles available"));
        return mapper.toDto(puzzle);
    }

    public PuzzleDto getPuzzle(String id) {
        Puzzle puzzle = repository.findById(id)
            .orElseThrow(() -> new PuzzleNotFoundException("Puzzle not found with id " + id));
        return mapper.toDto(puzzle);
    }

    public MoveSubmissionResponse submitMove(String id, MoveSubmissionRequest request) {
        Puzzle puzzle = repository.findById(id)
            .orElseThrow(() -> new PuzzleNotFoundException("Puzzle not found with id " + id));

        List<String> solution = parseSolution(puzzle.getMoves());

        if (request.moveNumber() >= solution.size()) {
            throw new IllegalArgumentException(
                "moveNumber " + request.moveNumber() + " is out of range for puzzle " + id);
        }
        // Player moves are at even indices (0, 2, 4, ...); replies at odd indices are owned by the backend.
        if (request.moveNumber() % 2 != 0) {
            throw new IllegalArgumentException(
                "moveNumber " + request.moveNumber() + " is not a player move (must be even)");
        }

        if (!request.move().equals(solution.get(request.moveNumber()))) {
            return new MoveSubmissionResponse(false, false, null);
        }

        boolean hasReply = request.moveNumber() + 1 < solution.size();
        String replyMove = hasReply ? solution.get(request.moveNumber() + 1) : null;
        boolean solved = !hasReply || request.moveNumber() + 1 == solution.size() - 1;
        return new MoveSubmissionResponse(true, solved, replyMove);
    }

    private List<String> parseSolution(String moves) {
        if (moves == null || moves.isBlank()) {
            throw new IllegalArgumentException("Puzzle has no solution");
        }
        String[] tokens = moves.trim().split("\\s+");
        if (tokens.length < 2) {
            throw new IllegalArgumentException("Puzzle has no solution (only opponent move present)");
        }
        // Skip tokens[0] — it is the opponent's blunder, not part of the player's solution.
        return Arrays.stream(tokens, 1, tokens.length)
            .filter(s -> !s.isBlank())
            .toList();
    }
}
