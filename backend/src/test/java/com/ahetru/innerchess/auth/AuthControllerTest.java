package com.ahetru.innerchess.auth;

import com.ahetru.innerchess.auth.dto.AuthResponse;
import com.ahetru.innerchess.auth.exception.AccountDisabledException;
import com.ahetru.innerchess.auth.exception.BadCredentialsException;
import com.ahetru.innerchess.auth.jwt.JwtService;
import com.ahetru.innerchess.config.JwtProperties;
import com.ahetru.innerchess.config.WebConfig;
import com.ahetru.innerchess.user.UserService;
import com.ahetru.innerchess.user.dto.UserDto;
import com.ahetru.innerchess.user.exception.DuplicateEmailException;
import com.ahetru.innerchess.user.exception.DuplicateUserNameException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
    controllers = AuthController.class,
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebConfig.class)
)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtProperties jwtProperties;

    @Test
    void registerReturnsCreatedWithUserDto() throws Exception {
        when(userService.register("alice@example.com", "secret123", "alice"))
                .thenReturn(new UserDto(
                        UUID.fromString("11111111-1111-1111-1111-111111111111"),
                        "alice@example.com", "alice", "USER"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"secret123","userName":"alice"}"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("11111111-1111-1111-1111-111111111111"))
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.userName").value("alice"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void registerReturns409WhenEmailAlreadyExists() throws Exception {
        when(userService.register(eq("alice@example.com"), any(), any()))
                .thenThrow(new DuplicateEmailException("alice@example.com"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"secret123","userName":"alice"}"""))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Email already registered: alice@example.com"));
    }

    @Test
    void registerReturns409WhenUserNameAlreadyTaken() throws Exception {
        when(userService.register(eq("bob@example.com"), any(), any()))
                .thenThrow(new DuplicateUserNameException("alice"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"bob@example.com","password":"secret123","userName":"alice"}"""))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("User name already taken: alice"));
    }

    @Test
    void registerReturns400WhenEmailIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"","password":"secret123","userName":"alice"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("email: Email is required"));
    }

    @Test
    void registerReturns400WhenEmailIsInvalid() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"not-an-email","password":"secret123","userName":"alice"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("email: Email must be valid"));
    }

    @Test
    void registerReturns400WhenPasswordIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"","userName":"alice"}"""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerReturns400WhenPasswordIsTooShort() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"1234567","userName":"alice"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("password: Password must be at least 8 characters"));
    }

    @Test
    void registerReturns400WhenUserNameIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"secret123","userName":""}"""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerReturns400WhenUserNameIsTooShort() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"secret123","userName":"ab"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("userName: User name must be between 3 and 100 characters"));
    }

    @Test
    void loginReturnsAuthResponseOnValidCredentials() throws Exception {
        UserDto user = new UserDto(
                UUID.fromString("11111111-1111-1111-1111-111111111111"),
                "alice@example.com", "alice", "USER");
        when(authService.authenticate("alice@example.com", "secret123"))
                .thenReturn(user);
        when(jwtService.generateAccessToken(user.id()))
                .thenReturn("access-token-abc");
        when(jwtService.generateRefreshToken())
                .thenReturn("refresh-token-xyz");
        when(jwtProperties.accessTokenTtl())
                .thenReturn(900);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"secret123"}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token-abc"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token-xyz"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(900));
    }

    @Test
    void loginReturns401OnBadCredentials() throws Exception {
        when(authService.authenticate("alice@example.com", "wrong"))
                .thenThrow(new BadCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":"wrong"}"""))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    void loginReturns403OnDisabledAccount() throws Exception {
        when(authService.authenticate("bob@example.com", "secret123"))
                .thenThrow(new AccountDisabledException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"bob@example.com","password":"secret123"}"""))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("Account is disabled"));
    }

    @Test
    void loginReturns400WhenEmailIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"","password":"secret123"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("email: Email is required"));
    }

    @Test
    void loginReturns400WhenEmailIsInvalid() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"not-an-email","password":"secret123"}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("email: Email must be valid"));
    }

    @Test
    void loginReturns400WhenPasswordIsBlank() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"alice@example.com","password":""}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("password: Password is required"));
    }
}
