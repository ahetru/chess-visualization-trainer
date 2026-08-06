package com.ahetru.innerchess.chess.puzzle.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
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
            .andExpect(jsonPath("$.playerColor").value("w"))
            .andExpect(jsonPath("$.opponentMove").value("e2e4"))
            .andExpect(jsonPath("$.solution").value("d7d5"))
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
            .andExpect(jsonPath("$.playerColor").value("w"))
            .andExpect(jsonPath("$.rating").value(1784));
    }

    @Test
    void byIdReturns404WhenPuzzleDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/puzzles/99999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Puzzle not found with id 99999"));
    }

    @Test
    void submitMoveReturnsCorrectWhenMoveMatchesSolution() throws Exception {
        repository.save(puzzle());

        mockMvc.perform(post("/api/puzzles/00001/moves")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"move\":\"d7d5\",\"moveNumber\":0}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.correct").value(true))
            .andExpect(jsonPath("$.solved").value(true))
            .andExpect(jsonPath("$.replyMove").doesNotExist());
    }

    @Test
    void submitMoveReturnsIncorrectWhenMoveDoesNotMatch() throws Exception {
        repository.save(puzzle());

        mockMvc.perform(post("/api/puzzles/00001/moves")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"move\":\"e2e4\",\"moveNumber\":0}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.correct").value(false))
            .andExpect(jsonPath("$.solved").value(false))
            .andExpect(jsonPath("$.replyMove").doesNotExist());
    }

    @Test
    void submitMoveReturns400WhenMoveNumberIsOutOfRange() throws Exception {
        repository.save(puzzle());

        mockMvc.perform(post("/api/puzzles/00001/moves")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"move\":\"d7d5\",\"moveNumber\":5}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void submitMoveReturns404WhenPuzzleDoesNotExist() throws Exception {
        mockMvc.perform(post("/api/puzzles/99999/moves")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"move\":\"d7d5\",\"moveNumber\":0}"))
            .andExpect(status().isNotFound());
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