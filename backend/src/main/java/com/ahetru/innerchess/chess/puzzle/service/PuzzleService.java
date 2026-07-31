package com.ahetru.innerchess.chess.puzzle.service;

import org.springframework.stereotype.Service;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;
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
}
