package com.ahetru.innerchess.chess.puzzle.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;
import com.ahetru.innerchess.chess.puzzle.exception.PuzzleNotFoundException;
import com.ahetru.innerchess.chess.puzzle.service.PuzzleService;
import com.ahetru.innerchess.config.WebConfig;

@WebMvcTest(
    controllers = PuzzleController.class,
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebConfig.class)
)
@AutoConfigureMockMvc(addFilters = false)
class PuzzleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PuzzleService puzzleService;

    @Test
    void randomReturnsPuzzleDto() throws Exception {
        when(puzzleService.getRandomPuzzle()).thenReturn(dto());

        mockMvc.perform(get("/api/puzzles/random"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("00001"))
            .andExpect(jsonPath("$.fen").value("startpos"))
            .andExpect(jsonPath("$.moves").value("e2e4"))
            .andExpect(jsonPath("$.rating").value(1784))
            .andExpect(jsonPath("$.themes").value("crushing"));
    }

    @Test
    void randomReturns404WhenNoPuzzleAvailable() throws Exception {
        when(puzzleService.getRandomPuzzle()).thenThrow(new PuzzleNotFoundException("No puzzles available"));

        mockMvc.perform(get("/api/puzzles/random"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.message").value("No puzzles available"));
    }

    @Test
    void byIdReturnsPuzzleDto() throws Exception {
        when(puzzleService.getPuzzle("00001")).thenReturn(dto());

        mockMvc.perform(get("/api/puzzles/00001"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("00001"))
            .andExpect(jsonPath("$.rating").value(1784));
    }

    @Test
    void byIdReturns404WhenPuzzleDoesNotExist() throws Exception {
        when(puzzleService.getPuzzle("99999")).thenThrow(new PuzzleNotFoundException("Puzzle not found with id 99999"));

        mockMvc.perform(get("/api/puzzles/99999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Puzzle not found with id 99999"));
    }

    private PuzzleDto dto() {
        return new PuzzleDto("00001", "startpos", "e2e4", 1784, "crushing");
    }
}
