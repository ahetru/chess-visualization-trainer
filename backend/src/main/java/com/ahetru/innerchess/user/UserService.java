package com.ahetru.innerchess.user;

import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;
import com.ahetru.innerchess.user.exception.DuplicateEmailException;
import com.ahetru.innerchess.user.exception.DuplicateUserNameException;
import com.ahetru.innerchess.user.exception.UserNotFoundException;
import com.ahetru.innerchess.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class UserService {

    private static final String DEFAULT_ROLE = "USER";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto register(String email, String password, String userName) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException(email);
        }
        if (userRepository.existsByUserName(userName)) {
            throw new DuplicateUserNameException(userName);
        }

        String passwordHash = passwordEncoder.encode(password);

        User user = new User(email, passwordHash, userName, DEFAULT_ROLE, true);
        User saved = userRepository.save(user);

        return UserMapper.toDto(saved);
    }

    public UserDto getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return UserMapper.toDto(user);
    }
}
