package com.ahetru.innerchess.chess.puzzle.dto;

public record PuzzleDto(
    String id,
    String fen,
    String moves,
    int rating,
    String themes
) {}
