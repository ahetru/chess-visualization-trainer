package com.ahetru.innerchess.auth.jwt;

import com.ahetru.innerchess.config.JwtProperties;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties(
                "dGVzdC1zZWNyZXQtZm9yLWp3dC10ZXN0aW5nLW9ubHktbm90LXVzZWQtaW4tcHJvZHVjdGlvbg==",
                900,
                604800,
                "innerchess"
        );
        jwtService = new JwtService(properties);
    }

    @Test
    void generateAccessTokenReturnsNonEmptyString() {
        String token = jwtService.generateAccessToken(UUID.randomUUID());
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validateAccessTokenReturnsUserIdFromValidToken() {
        UUID userId = UUID.randomUUID();
        String token = jwtService.generateAccessToken(userId);

        UUID extracted = jwtService.validateAccessToken(token);

        assertEquals(userId, extracted);
    }

    @Test
    void validateAccessTokenThrowsOnTamperedToken() {
        String token = jwtService.generateAccessToken(UUID.randomUUID());
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        assertThrows(JwtException.class, () -> jwtService.validateAccessToken(tampered));
    }

    @Test
    void generateRefreshTokenReturnsNonEmptyString() {
        String token = jwtService.generateRefreshToken();
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertEquals(43, token.length()); // 32 random bytes in base64url without padding
    }

    @Test
    void generateRefreshTokenReturnsUniqueTokens() {
        String token1 = jwtService.generateRefreshToken();
        String token2 = jwtService.generateRefreshToken();
        assertNotEquals(token1, token2);
    }
}
