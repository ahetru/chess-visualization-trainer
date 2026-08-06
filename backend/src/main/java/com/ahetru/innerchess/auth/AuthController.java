package com.ahetru.innerchess.auth;

import com.ahetru.innerchess.auth.dto.AuthResponse;
import com.ahetru.innerchess.auth.dto.LoginRequest;
import com.ahetru.innerchess.auth.dto.RegisterRequest;
import com.ahetru.innerchess.auth.jwt.JwtService;
import com.ahetru.innerchess.config.JwtProperties;
import com.ahetru.innerchess.user.UserService;
import com.ahetru.innerchess.user.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthController(UserService userService, AuthService authService,
                          JwtService jwtService, JwtProperties jwtProperties) {
        this.userService = userService;
        this.authService = authService;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        UserDto userDto = userService.register(
                request.email(),
                request.password(),
                request.userName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        UserDto user = authService.authenticate(request.email(), request.password());
        String accessToken = jwtService.generateAccessToken(user.id());
        String refreshToken = jwtService.generateRefreshToken();
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken,
                "Bearer", jwtProperties.accessTokenTtl()));
    }
}
