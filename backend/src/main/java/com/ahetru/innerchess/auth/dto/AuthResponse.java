package com.ahetru.innerchess.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}
