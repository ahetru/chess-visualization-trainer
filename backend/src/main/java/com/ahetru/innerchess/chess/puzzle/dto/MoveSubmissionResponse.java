package com.ahetru.innerchess.chess.puzzle.dto;

public record MoveSubmissionResponse(
    boolean correct,
    boolean solved,
    String replyMove
) {}
