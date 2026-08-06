package com.ahetru.innerchess.auth.service;

import com.ahetru.innerchess.auth.RefreshTokenRepository;
import com.ahetru.innerchess.auth.RefreshTokenService;
import com.ahetru.innerchess.auth.domain.RefreshToken;
import com.ahetru.innerchess.auth.exception.RefreshTokenException;
import com.ahetru.innerchess.auth.jwt.JwtService;
import com.ahetru.innerchess.config.JwtProperties;
import com.ahetru.innerchess.user.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtService jwtService;

    private JwtProperties jwtProperties;
    private RefreshTokenService service;
    private User user;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties("dummy", 900, 604800, "innerchess");
        service = new RefreshTokenService(refreshTokenRepository, jwtService, jwtProperties);
        user = testUser();
    }

    @Test
    void storeCreatesAndSavesRefreshToken() {
        String rawToken = "test-refresh-token";

        service.store(user, rawToken);

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());
        RefreshToken saved = captor.getValue();
        assertEquals(user, saved.getUser());
        assertEquals(sha256(rawToken), saved.getTokenHash());
        assertNotNull(saved.getExpiresAt());
        assertTrue(saved.getExpiresAt().isAfter(Instant.now()));
    }

    @Test
    void rotateReturnsNewTokensOnValidRefreshToken() {
        String rawToken = "old-refresh";
        RefreshToken existing = new RefreshToken(user, sha256(rawToken),
                Instant.now().plusSeconds(3600));
        when(refreshTokenRepository.findByTokenHash(sha256(rawToken)))
                .thenReturn(Optional.of(existing));
        when(jwtService.generateRefreshToken()).thenReturn("new-refresh");
        when(jwtService.generateAccessToken(any())).thenReturn("new-access");

        var response = service.rotate(rawToken);

        assertEquals("new-access", response.accessToken());
        assertEquals("new-refresh", response.refreshToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(900, response.expiresIn());

        assertNotNull(existing.getRevokedAt());
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    void rotateThrowsWhenTokenHashNotFound() {
        when(refreshTokenRepository.findByTokenHash(sha256("unknown")))
                .thenReturn(Optional.empty());

        assertThrows(RefreshTokenException.class,
                () -> service.rotate("unknown"));
    }

    @Test
    void rotateThrowsWhenTokenIsExpired() {
        String rawToken = "expired-token";
        RefreshToken expired = new RefreshToken(user, sha256(rawToken),
                Instant.now().minusSeconds(1));
        when(refreshTokenRepository.findByTokenHash(sha256(rawToken)))
                .thenReturn(Optional.of(expired));

        assertThrows(RefreshTokenException.class,
                () -> service.rotate(rawToken));
    }

    @Test
    void rotateThrowsWhenTokenIsRevoked() {
        String rawToken = "revoked-token";
        RefreshToken revoked = new RefreshToken(user, sha256(rawToken),
                Instant.now().plusSeconds(3600));
        revoked.revoke();
        when(refreshTokenRepository.findByTokenHash(sha256(rawToken)))
                .thenReturn(Optional.of(revoked));

        assertThrows(RefreshTokenException.class,
                () -> service.rotate(rawToken));
    }

    @Test
    void revokeSetsRevokedAtOnActiveToken() {
        String rawToken = "active-token";
        RefreshToken active = new RefreshToken(user, sha256(rawToken),
                Instant.now().plusSeconds(3600));
        when(refreshTokenRepository.findByTokenHash(sha256(rawToken)))
                .thenReturn(Optional.of(active));

        service.revoke(rawToken);

        assertNotNull(active.getRevokedAt());
        verify(refreshTokenRepository).save(active);
    }

    @Test
    void revokeIsIdempotentOnAlreadyRevokedToken() {
        String rawToken = "revoked-token";
        RefreshToken alreadyRevoked = new RefreshToken(user, sha256(rawToken),
                Instant.now().plusSeconds(3600));
        alreadyRevoked.revoke();
        when(refreshTokenRepository.findByTokenHash(sha256(rawToken)))
                .thenReturn(Optional.of(alreadyRevoked));

        service.revoke(rawToken);

        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void revokeDoesNothingWhenTokenNotFound() {
        when(refreshTokenRepository.findByTokenHash(sha256("unknown")))
                .thenReturn(Optional.empty());

        assertDoesNotThrow(() -> service.revoke("unknown"));
        verify(refreshTokenRepository, never()).save(any());
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private static User testUser() {
        return new User("test@example.com", "hash", "testuser", "USER", true);
    }
}
