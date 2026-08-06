package com.ahetru.innerchess.user.mapper;

import com.ahetru.innerchess.user.domain.User;
import com.ahetru.innerchess.user.dto.UserDto;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getUserName(),
                user.getRole()
        );
    }
}
