package com.ahetru.innerchess.auth.exception;

public class BadCredentialsException extends RuntimeException {

    public BadCredentialsException() {
        super("Invalid email or password");
    }
}
