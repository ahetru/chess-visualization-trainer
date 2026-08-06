package com.ahetru.innerchess.user.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String userName,
        String role
) {}
