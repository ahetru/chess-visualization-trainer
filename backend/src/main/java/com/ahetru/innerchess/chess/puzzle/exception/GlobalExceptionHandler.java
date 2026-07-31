package com.ahetru.innerchess.chess.puzzle.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PuzzleNotFoundException.class)
    public ResponseEntity<ApiError> handlePuzzleNotFound(PuzzleNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    public record ApiError(int status, String message) {}
}
