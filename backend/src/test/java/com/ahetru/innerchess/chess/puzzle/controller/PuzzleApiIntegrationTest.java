package com.ahetru.innerchess.chess.puzzle.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class PuzzleApiIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PuzzleRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void randomReturnsPuzzleFromDatabase() throws Exception {
        repository.save(puzzle());

        mockMvc.perform(get("/api/puzzles/random"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("00001"))
            .andExpect(jsonPath("$.fen").value("r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24"))
            .andExpect(jsonPath("$.moves").value("e2e4 d7d5"))
            .andExpect(jsonPath("$.rating").value(1784))
            .andExpect(jsonPath("$.themes").value("crushing hangingPiece"));
    }

    @Test
    void randomReturns404WhenDatabaseIsEmpty() throws Exception {
        mockMvc.perform(get("/api/puzzles/random"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("No puzzles available"));
    }

    @Test
    void byIdReturnsPuzzleFromDatabase() throws Exception {
        repository.save(puzzle());

        mockMvc.perform(get("/api/puzzles/00001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("00001"))
            .andExpect(jsonPath("$.rating").value(1784));
    }

    @Test
    void byIdReturns404WhenPuzzleDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/puzzles/99999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Puzzle not found with id 99999"));
    }

    private Puzzle puzzle() {
        return new Puzzle(
            "00001",
            "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
            "e2e4 d7d5",
            1784,
            77,
            95,
            9822,
            "crushing hangingPiece",
            "https://lichess.org/787zsVup/black#48"
        );
    }
}
