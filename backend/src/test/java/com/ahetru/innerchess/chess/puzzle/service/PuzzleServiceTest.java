package com.ahetru.innerchess.chess.puzzle.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;
import com.ahetru.innerchess.chess.puzzle.dto.PuzzleDto;
import com.ahetru.innerchess.chess.puzzle.exception.PuzzleNotFoundException;
import com.ahetru.innerchess.chess.puzzle.mapper.PuzzleMapper;

@ExtendWith(MockitoExtension.class)
class PuzzleServiceTest {

    @Mock
    private PuzzleRepository repository;

    private PuzzleMapper mapper;
    private PuzzleService service;

    @BeforeEach
    void setUp() {
        mapper = new PuzzleMapper();
        service = new PuzzleService(repository, mapper);
    }

    @Test
    void getRandomPuzzleReturnsMappedDto() {
        when(repository.findRandom()).thenReturn(Optional.of(puzzle()));

        PuzzleDto dto = service.getRandomPuzzle();

        assertEquals("00001", dto.id());
        assertEquals("r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24", dto.fen());
        assertEquals("e2e4 d7d5", dto.moves());
        assertEquals(1784, dto.rating());
        assertEquals("crushing hangingPiece", dto.themes());
    }

    @Test
    void getRandomPuzzleThrowsWhenRepositoryIsEmpty() {
        when(repository.findRandom()).thenReturn(Optional.empty());

        assertThrows(PuzzleNotFoundException.class, () -> service.getRandomPuzzle());
    }

    @Test
    void getPuzzleReturnsMappedDto() {
        when(repository.findById("00001")).thenReturn(Optional.of(puzzle()));

        PuzzleDto dto = service.getPuzzle("00001");

        assertEquals("00001", dto.id());
        assertEquals("e2e4 d7d5", dto.moves());
    }

    @Test
    void getPuzzleThrowsWhenPuzzleDoesNotExist() {
        when(repository.findById("99999")).thenReturn(Optional.empty());

        assertThrows(PuzzleNotFoundException.class, () -> service.getPuzzle("99999"));
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
