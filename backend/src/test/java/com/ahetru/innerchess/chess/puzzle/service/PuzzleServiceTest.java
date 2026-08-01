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
import com.ahetru.innerchess.chess.puzzle.dto.MoveSubmissionRequest;
import com.ahetru.innerchess.chess.puzzle.dto.MoveSubmissionResponse;
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
        assertEquals("w", dto.playerColor());
        assertEquals("e2e4", dto.opponentMove());
        assertEquals("d7d5", dto.solution());
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
        assertEquals("w", dto.playerColor());
        assertEquals("e2e4", dto.opponentMove());
        assertEquals("d7d5", dto.solution());
    }

    @Test
    void getPuzzleThrowsWhenPuzzleDoesNotExist() {
        when(repository.findById("99999")).thenReturn(Optional.empty());

        assertThrows(PuzzleNotFoundException.class, () -> service.getPuzzle("99999"));
    }

    @Test
    void submitMoveReturnsCorrectWithReplyWhenNotYetSolved() {
        // 4 tokens: opponent blunder + player1 + reply1 + player2
        // solution = [player1, reply1, player2]
        when(repository.findById("00001")).thenReturn(Optional.of(
            puzzleWithMoves("e2e4 d7d5 g1f3 a7a6")));

        MoveSubmissionResponse response = service.submitMove("00001",
            new MoveSubmissionRequest("d7d5", 0));

        assertEquals(true, response.correct());
        assertEquals(false, response.solved());
        assertEquals("g1f3", response.replyMove());
    }

    @Test
    void submitMoveReturnsSolvedOnLastPlayerMove() {
        // 4 tokens: opponent blunder + player1 + reply1 + player2
        // solution = [player1, reply1, player2] — player2 at index 2
        when(repository.findById("00001")).thenReturn(Optional.of(
            puzzleWithMoves("e2e4 d7d5 g1f3 a7a6")));

        MoveSubmissionResponse response = service.submitMove("00001",
            new MoveSubmissionRequest("a7a6", 2));

        assertEquals(true, response.correct());
        assertEquals(true, response.solved());
        assertEquals(null, response.replyMove());
    }

    @Test
    void submitMoveReturnsSolvedWhenReplyCompletesLine() {
        // 3 tokens: opponent blunder + player1 + reply1
        // solution = [player1, reply1] — reply completes the line
        when(repository.findById("00001")).thenReturn(Optional.of(
            puzzleWithMoves("e2e4 d7d5 g1f3")));

        MoveSubmissionResponse response = service.submitMove("00001",
            new MoveSubmissionRequest("d7d5", 0));

        assertEquals(true, response.correct());
        assertEquals(true, response.solved());
        assertEquals("g1f3", response.replyMove());
    }

    @Test
    void submitMoveReturnsIncorrectWhenMoveDoesNotMatchSolution() {
        when(repository.findById("00001")).thenReturn(Optional.of(puzzle()));

        MoveSubmissionResponse response = service.submitMove("00001",
            new MoveSubmissionRequest("e2e4", 0));

        assertEquals(false, response.correct());
        assertEquals(false, response.solved());
        assertEquals(null, response.replyMove());
    }

    @Test
    void submitMoveThrowsWhenPuzzleDoesNotExist() {
        when(repository.findById("99999")).thenReturn(Optional.empty());

        assertThrows(PuzzleNotFoundException.class,
            () -> service.submitMove("99999", new MoveSubmissionRequest("d7d5", 0)));
    }

    @Test
    void submitMoveThrowsWhenMoveNumberIsOutOfRange() {
        when(repository.findById("00001")).thenReturn(Optional.of(puzzle()));

        assertThrows(IllegalArgumentException.class,
            () -> service.submitMove("00001", new MoveSubmissionRequest("d7d5", 5)));
    }

    @Test
    void submitMoveThrowsWhenMoveNumberIsNotAPlayerMove() {
        when(repository.findById("00001")).thenReturn(Optional.of(
            puzzleWithMoves("e2e4 d7d5 g1f3 a7a6")));

        assertThrows(IllegalArgumentException.class,
            () -> service.submitMove("00001", new MoveSubmissionRequest("g1f3", 1)));
    }

    private Puzzle puzzle() {
        return puzzleWithMoves("e2e4 d7d5");
    }

    private Puzzle puzzleWithMoves(String moves) {
        return new Puzzle(
            "00001",
            "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
            moves,
            1784,
            77,
            95,
            9822,
            "crushing hangingPiece",
            "https://lichess.org/787zsVup/black#48"
        );
    }
}