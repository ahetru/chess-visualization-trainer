package com.ahetru.innerchess.chess.puzzle.mapper;

import org.springframework.stereotype.Component;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;

@Component
public class PuzzleMapper {

    public PuzzleDto toDto(Puzzle puzzle) {
        return new PuzzleDto(
            puzzle.getId(),
            puzzle.getFen(),
            puzzle.getMoves(),
            puzzle.getRating(),
            puzzle.getThemes()
        );
    }
}
