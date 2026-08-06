package com.ahetru.innerchess.user.exception;

public class DuplicateUserNameException extends RuntimeException {

    public DuplicateUserNameException(String userName) {
        super("User name already taken: " + userName);
    }
}
