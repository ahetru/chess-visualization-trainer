package com.ahetru.innerchess.chess.puzzle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record MoveSubmissionRequest(
    @NotBlank String move,
    @Min(0) int moveNumber
) {}
