package com.ahetru.innerchess.auth.service;

import com.ahetru.innerchess.auth.AuthService;
import com.ahetru.innerchess.auth.exception.AccountDisabledException;
import com.ahetru.innerchess.auth.exception.BadCredentialsException;
import com.ahetru.innerchess.user.UserRepository;
import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    private final User enabledUser = testUser("alice@example.com", "$2a$10$hash", true);

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder);
    }

    @Test
    void authenticateReturnsUserDtoOnValidCredentials() {
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(enabledUser));
        when(passwordEncoder.matches("secret123", "$2a$10$hash"))
                .thenReturn(true);

        UserDto result = authService.authenticate("alice@example.com", "secret123");

        assertEquals("alice@example.com", result.email());
        assertEquals("alice", result.userName());
        assertEquals("USER", result.role());
    }

    @Test
    void authenticateThrowsBadCredentialsWhenEmailNotFound() {
        when(userRepository.findByEmail("unknown@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class,
                () -> authService.authenticate("unknown@example.com", "secret123"));
    }

    @Test
    void authenticateThrowsBadCredentialsWhenPasswordWrong() {
        when(userRepository.findByEmail("alice@example.com"))
                .thenReturn(Optional.of(enabledUser));
        when(passwordEncoder.matches("wrong", "$2a$10$hash"))
                .thenReturn(false);

        assertThrows(BadCredentialsException.class,
                () -> authService.authenticate("alice@example.com", "wrong"));
    }

    @Test
    void authenticateThrowsAccountDisabledWhenUserDisabled() {
        User disabledUser = testUser("bob@example.com", "$2a$10$hash", false);
        when(userRepository.findByEmail("bob@example.com"))
                .thenReturn(Optional.of(disabledUser));

        assertThrows(AccountDisabledException.class,
                () -> authService.authenticate("bob@example.com", "secret123"));
    }

    private static User testUser(String email, String passwordHash, boolean enabled) {
        return new User(email, passwordHash, "alice", "USER", enabled);
    }
}
