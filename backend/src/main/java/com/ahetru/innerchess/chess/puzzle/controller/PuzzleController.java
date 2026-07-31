package com.ahetru.innerchess.chess.puzzle.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;
import com.ahetru.innerchess.chess.puzzle.service.PuzzleService;

@RestController
@RequestMapping("/api/puzzles")
public class PuzzleController {

    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/random")
    public PuzzleDto random() {
        return puzzleService.getRandomPuzzle();
    }

    @GetMapping("/{id}")
    public PuzzleDto byId(@PathVariable String id) {
        return puzzleService.getPuzzle(id);
    }
}
