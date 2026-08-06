package com.ahetru.innerchess.user;

import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;
import com.ahetru.innerchess.user.exception.DuplicateEmailException;
import com.ahetru.innerchess.user.exception.DuplicateUserNameException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void registerCreatesUserAndReturnsDto() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.existsByUserName("alice")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$10$hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            return savedUser(u);
        });

        UserDto result = userService.register("alice@example.com", "secret123", "alice");

        assertNotNull(result.id());
        assertEquals("alice@example.com", result.email());
        assertEquals("alice", result.userName());
        assertEquals("USER", result.role());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("alice@example.com", saved.getEmail());
        assertEquals("$2a$10$hashed", saved.getPasswordHash());
        assertEquals("alice", saved.getUserName());
        assertEquals("USER", saved.getRole());
        assertTrue(saved.isEnabled());
    }

    @Test
    void registerThrowsWhenEmailAlreadyExists() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        DuplicateEmailException ex = assertThrows(DuplicateEmailException.class,
                () -> userService.register("alice@example.com", "secret123", "alice"));

        assertTrue(ex.getMessage().contains("alice@example.com"));
    }

    @Test
    void registerThrowsWhenUserNameAlreadyTaken() {
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(false);
        when(userRepository.existsByUserName("alice")).thenReturn(true);

        DuplicateUserNameException ex = assertThrows(DuplicateUserNameException.class,
                () -> userService.register("bob@example.com", "secret123", "alice"));

        assertTrue(ex.getMessage().contains("alice"));
    }

    private User savedUser(User template) {
        User u = new User(
                template.getEmail(),
                template.getPasswordHash(),
                template.getUserName(),
                template.getRole(),
                template.isEnabled()
        );
        // Simulate JPA assigning an ID by using reflection
        try {
            var idField = User.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(u, java.util.UUID.randomUUID());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return u;
    }
}
