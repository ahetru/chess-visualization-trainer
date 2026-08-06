package com.ahetru.innerchess.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        int expiresIn
) {
    public AuthResponse {
        if (tokenType == null) {
            tokenType = "Bearer";
        }
    }
}
