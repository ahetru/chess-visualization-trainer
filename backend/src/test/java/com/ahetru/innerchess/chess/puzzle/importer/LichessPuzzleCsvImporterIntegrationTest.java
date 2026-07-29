package com.ahetru.innerchess.chess.puzzle.importer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;

@SpringBootTest
@Testcontainers
class LichessPuzzleCsvImporterIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private LichessPuzzleCsvImporter importer;

    @Autowired
    private PuzzleRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void importsPuzzlesEndToEnd(@TempDir Path tempDir) throws IOException {
        Path csv = writeCsv(tempDir, List.of(
            "00001,r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24,e2e4,1784,77,95,9822,crushing,https://lichess.org/787zsVup/black#48",
            "00002,rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1,d2d4,1500,50,80,5000,opening,https://lichess.org/abc"
        ));

        int imported = importer.importFromCsv(csv, 2);

        assertEquals(2, imported);
        assertEquals(2, repository.count());
        assertTrue(repository.findById("00001").isPresent());
        assertTrue(repository.findById("00002").isPresent());
    }

    @Test
    void persistsAllFieldsCorrectly(@TempDir Path tempDir) throws IOException {
        Path csv = writeCsv(tempDir, List.of(
            "00001,r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24,e2e4 d7d5,1784,77,95,9822,crushing hangingPiece,https://lichess.org/787zsVup/black#48"
        ));

        importer.importFromCsv(csv, 1);

        Puzzle puzzle = repository.findById("00001").orElseThrow();
        assertEquals("r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24", puzzle.getFen());
        assertEquals("e2e4 d7d5", puzzle.getMoves());
        assertEquals(1784, puzzle.getRating());
        assertEquals(Integer.valueOf(77), puzzle.getRatingDeviation());
        assertEquals(Integer.valueOf(95), puzzle.getPopularity());
        assertEquals(Integer.valueOf(9822), puzzle.getNbPlays());
        assertEquals("crushing hangingPiece", puzzle.getThemes());
        assertEquals("https://lichess.org/787zsVup/black#48", puzzle.getGameUrl());
    }

    @Test
    void respectsMaxPuzzlesWithDatabase(@TempDir Path tempDir) throws IOException {
        Path csv = writeCsv(tempDir, List.of(
            "00001,startpos,e2e4,1500,50,90,1000,,https://example.com/1",
            "00002,startpos,d2d4,1600,60,85,2000,,https://example.com/2",
            "00003,startpos,e2e3,1700,70,80,3000,,https://example.com/3"
        ));

        int imported = importer.importFromCsv(csv, 2);

        assertEquals(2, imported);
        assertEquals(2, repository.count());
    }

    @Test
    void importsZeroPuzzlesWhenCsvIsEmpty(@TempDir Path tempDir) throws IOException {
        Path csv = writeCsv(tempDir, List.of());

        int imported = importer.importFromCsv(csv, 10);

        assertEquals(0, imported);
        assertEquals(0, repository.count());
    }

    private static Path writeCsv(Path tempDir, List<String> rows) throws IOException {
        Path csv = tempDir.resolve("puzzles.csv");
        List<String> lines = new java.util.ArrayList<>();
        lines.add("PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl");
        lines.addAll(rows);
        Files.write(csv, lines);
        return csv;
    }
}