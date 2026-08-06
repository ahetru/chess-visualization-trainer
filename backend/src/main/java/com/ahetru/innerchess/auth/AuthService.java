package com.ahetru.innerchess.auth;

import com.ahetru.innerchess.auth.exception.AccountDisabledException;
import com.ahetru.innerchess.auth.exception.BadCredentialsException;
import com.ahetru.innerchess.user.UserRepository;
import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;
import com.ahetru.innerchess.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

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
        User user = userRepository.findByEmail(email)
                .orElseThrow(BadCredentialsException::new);

        if (!user.isEnabled()) {
            throw new AccountDisabledException();
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException();
        }

        return UserMapper.toDto(user);
    }
}
