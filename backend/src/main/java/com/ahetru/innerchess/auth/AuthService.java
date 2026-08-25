package com.ahetru.innerchess.auth;

import com.ahetru.innerchess.auth.dto.AuthResponse;
import com.ahetru.innerchess.auth.exception.AccountDisabledException;
import com.ahetru.innerchess.auth.exception.BadCredentialsException;
import com.ahetru.innerchess.auth.jwt.JwtService;
import com.ahetru.innerchess.config.JwtProperties;
import com.ahetru.innerchess.user.UserRepository;
import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;
import com.ahetru.innerchess.user.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user by email and password. Returns the {@link UserDto}
     * on success. Does not reveal whether the email exists when credentials
     * are wrong — always throws {@link BadCredentialsException} with a
     * generic message.
     */
    public UserDto authenticate(String email, String password) {
        return UserMapper.toDto(authenticateUser(email, password));
    }

    /**
     * Full login flow: authenticates, issues tokens, and stores the refresh
     * token. Returns an {@link AuthResponse} with access and refresh tokens.
     */
    @Transactional
    public AuthResponse login(String email, String password,
                              JwtService jwtService,
                              RefreshTokenService refreshTokenService,
                              JwtProperties jwtProperties) {
        User user = authenticateUser(email, password);

        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken();
        refreshTokenService.store(user, refreshToken);

        return new AuthResponse(accessToken, refreshToken, "Bearer", jwtProperties.accessTokenTtl());
    }

    private User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Login failed: unknown email {}", email);
                    return new BadCredentialsException();
                });

        if (!user.isEnabled()) {
            log.warn("Login failed: account disabled for {}", email);
            throw new AccountDisabledException();
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            log.warn("Login failed: incorrect password for {}", email);
            throw new BadCredentialsException();
        }

        return user;
    }
}
