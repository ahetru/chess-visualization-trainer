package com.ahetru.innerchess.chess.puzzle.exception;

import com.ahetru.innerchess.auth.exception.AccountDisabledException;
import com.ahetru.innerchess.auth.exception.BadCredentialsException;
import com.ahetru.innerchess.user.exception.DuplicateEmailException;
import com.ahetru.innerchess.user.exception.DuplicateUserNameException;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PuzzleNotFoundException.class)
    public ResponseEntity<ApiError> handlePuzzleNotFound(PuzzleNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ApiError(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiError(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiError(HttpStatus.BAD_REQUEST.value(), message));
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiError> handleDuplicateEmail(DuplicateEmailException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ApiError(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    @ExceptionHandler(DuplicateUserNameException.class)
    public ResponseEntity<ApiError> handleDuplicateUserName(DuplicateUserNameException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ApiError(HttpStatus.CONFLICT.value(), ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiError(HttpStatus.UNAUTHORIZED.value(), ex.getMessage()));
    }

    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<ApiError> handleAccountDisabled(AccountDisabledException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ApiError(HttpStatus.FORBIDDEN.value(), ex.getMessage()));
    }

    public record ApiError(int status, String message) {}
}
