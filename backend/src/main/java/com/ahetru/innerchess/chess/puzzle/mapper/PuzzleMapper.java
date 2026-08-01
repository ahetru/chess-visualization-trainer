package com.ahetru.innerchess.chess.puzzle.mapper;

import java.util.Arrays;

import org.springframework.stereotype.Component;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;

@Component
public class PuzzleMapper {

    public PuzzleDto toDto(Puzzle puzzle) {
        String[] tokens = tokenize(puzzle.getMoves());

        String opponentMove = tokens.length > 0 ? tokens[0] : "";
        String solution = tokens.length > 1
            ? String.join(" ", Arrays.copyOfRange(tokens, 1, tokens.length))
            : "";

        return new PuzzleDto(
            puzzle.getId(),
            puzzle.getFen(),
            playerColor(puzzle.getFen()),
            opponentMove,
            solution,
            puzzle.getRating(),
            puzzle.getThemes()
        );
    }

    private String playerColor(String fen) {
        String activeColor = fen.split(" ")[1];
        return activeColor.equals("w") ? "b" : "w";
    }

    private String[] tokenize(String moves) {
        if (moves == null || moves.isBlank()) {
            return new String[0];
        }
        return moves.trim().split("\\s+");
    }
}
