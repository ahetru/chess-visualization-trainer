package com.ahetru.innerchess.chess.puzzle.dto;

public record PuzzleDto(
    String id,
    String fen,
    String playerColor,
    String opponentMove,
    String solution,
    int rating,
    String themes
) {}
