package com.ahetru.innerchess.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        int accessTokenTtl,
        int refreshTokenTtl,
        String issuer
) {
    public JwtProperties {
        if (issuer == null) {
            issuer = "innerchess";
        }
    }
}
