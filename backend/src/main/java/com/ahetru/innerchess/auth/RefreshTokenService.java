package com.ahetru.innerchess.auth;

import com.ahetru.innerchess.auth.domain.RefreshToken;
import com.ahetru.innerchess.auth.dto.AuthResponse;
import com.ahetru.innerchess.auth.exception.RefreshTokenException;
import com.ahetru.innerchess.auth.jwt.JwtService;
import com.ahetru.innerchess.config.JwtProperties;
import com.ahetru.innerchess.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               JwtService jwtService,
                               JwtProperties jwtProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    /**
     * Stores a hashed refresh token for the given user so it can be
     * validated, rotated and revoked later.
     */
    public void store(User user, String rawToken) {
        String tokenHash = hashToken(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(jwtProperties.refreshTokenTtl());
        RefreshToken refreshToken = new RefreshToken(user, tokenHash, expiresAt);
        refreshTokenRepository.save(refreshToken);
    }

    /**
     * Rotates a refresh token: validates the current token is active,
     * revokes it, issues a new refresh token and a new access token, and
     * links the old token to the new one.
     */
    public AuthResponse rotate(String rawToken) {
        RefreshToken existing = validateAndGet(rawToken);
        existing.revoke();

        String newRawRefresh = jwtService.generateRefreshToken();
        RefreshToken newToken = new RefreshToken(
                existing.getUser(),
                hashToken(newRawRefresh),
                Instant.now().plusSeconds(jwtProperties.refreshTokenTtl())
        );
        existing.markReplacedBy(newToken);
        refreshTokenRepository.save(existing);
        refreshTokenRepository.save(newToken);

        String newAccessToken = jwtService.generateAccessToken(existing.getUser().getId());

        return new AuthResponse(newAccessToken, newRawRefresh, "Bearer", jwtProperties.accessTokenTtl());
    }

    /**
     * Revokes a refresh token so it can no longer be used. Idempotent:
     * does nothing if already revoked.
     */
    public void revoke(String rawToken) {
        refreshTokenRepository.findByTokenHash(hashToken(rawToken))
                .ifPresent(token -> {
                    if (token.getRevokedAt() == null) {
                        token.revoke();
                        refreshTokenRepository.save(token);
                    }
                });
    }

    private RefreshToken validateAndGet(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new RefreshTokenException("Invalid refresh token"));

        if (!token.isActive()) {
            throw new RefreshTokenException("Refresh token is expired or revoked");
        }

        return token;
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
