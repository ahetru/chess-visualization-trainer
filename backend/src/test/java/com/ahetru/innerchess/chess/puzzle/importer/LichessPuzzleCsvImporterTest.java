package com.ahetru.innerchess.chess.puzzle.importer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;

@ExtendWith(MockitoExtension.class)
class LichessPuzzleCsvImporterTest {

    @Mock
    private PuzzleRepository repository;

    @InjectMocks
    private LichessPuzzleCsvImporter importer;

    @Captor
    private ArgumentCaptor<List<Puzzle>> batchCaptor;

    private static final String[] HEADERS = {
        "PuzzleId", "FEN", "Moves", "Rating", "RatingDeviation",
        "Popularity", "NbPlays", "Themes", "GameUrl"
    };

    @Nested
    class ImportCount {

        @Test
        void importsCorrectNumberOfPuzzles(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 3);

            int result = importer.importFromCsv(csv, 3);

            assertEquals(3, result);
        }

        @Test
        void importsOnlyUpToMaxPuzzles(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 10);

            int result = importer.importFromCsv(csv, 3);

            assertEquals(3, result);
        }

        @Test
        void importsZeroWhenMaxPuzzlesIsZero(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 5);

            int result = importer.importFromCsv(csv, 0);

            assertEquals(0, result);
            verify(repository, never()).saveAll(any());
        }

        @Test
        void returnsZeroForEmptyCsv(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 0);

            int result = importer.importFromCsv(csv, 5);

            assertEquals(0, result);
            verify(repository, never()).saveAll(any());
        }
    }

    @Nested
    class BatchFlushing {

        @Test
        void flushesBatchWhenBatchSizeReached(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 2500);

            importer.importFromCsv(csv, 2500);

            verify(repository, times(3)).saveAll(any());
        }

        @Test
        void flushesRemainingBatchAtEnd(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 500);

            importer.importFromCsv(csv, 500);

            verify(repository, times(1)).saveAll(any());
        }

        @Test
        void flushesExactlyAtBatchBoundary(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 1000);

            importer.importFromCsv(csv, 1000);

            verify(repository, times(1)).saveAll(any());
        }

        @Test
        void flushesTwoBatchesPlusRemainder(@TempDir Path tempDir) throws IOException {
            Path csv = csvWithRows(tempDir, 1001);

            importer.importFromCsv(csv, 1001);

            verify(repository, times(2)).saveAll(any());
        }
    }

    @Nested
    class FieldMapping {

        @Test
        void mapsAllFieldsCorrectly(@TempDir Path tempDir) throws IOException {
            Path csv = writeCsv(tempDir, List.of(
                "00001,r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24,e2e4 d7d5,1784,77,95,9822,crushing hangingPiece,https://lichess.org/787zsVup/black#48"
            ));

            importer.importFromCsv(csv, 1);

            verify(repository).saveAll(batchCaptor.capture());
            Puzzle puzzle = batchCaptor.getValue().getFirst();

            assertEquals("00001", puzzle.getId());
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
        void parsesIntegerFieldsCorrectly(@TempDir Path tempDir) throws IOException {
            Path csv = writeCsv(tempDir, List.of(
                "00001,startpos,e2e4,0,0,0,0,,https://example.com"
            ));

            importer.importFromCsv(csv, 1);

            verify(repository).saveAll(batchCaptor.capture());
            Puzzle puzzle = batchCaptor.getValue().getFirst();

            assertEquals(0, puzzle.getRating());
            assertEquals(Integer.valueOf(0), puzzle.getRatingDeviation());
            assertEquals(Integer.valueOf(0), puzzle.getPopularity());
            assertEquals(Integer.valueOf(0), puzzle.getNbPlays());
        }

        @Test
        void handlesEmptyOptionalFields(@TempDir Path tempDir) throws IOException {
            Path csv = writeCsv(tempDir, List.of(
                "00001,startpos,e2e4,1500,50,90,1000,,https://example.com"
            ));

            importer.importFromCsv(csv, 1);

            verify(repository).saveAll(batchCaptor.capture());
            Puzzle puzzle = batchCaptor.getValue().getFirst();

            assertEquals("", puzzle.getThemes());
            assertEquals("https://example.com", puzzle.getGameUrl());
        }
    }

    @Nested
    class ErrorHandling {

        @Test
        void throwsIOExceptionForMissingFile() {
            Path missing = Path.of("/nonexistent/file.csv");

            assertThrows(IOException.class, () -> importer.importFromCsv(missing, 10));
        }

        @Test
        void throwsExceptionForInvalidIntegerField(@TempDir Path tempDir) throws IOException {
            Path csv = writeCsv(tempDir, List.of(
                "00001,startpos,e2e4,notanumber,50,90,1000,,https://example.com"
            ));

            assertThrows(NumberFormatException.class, () -> importer.importFromCsv(csv, 1));
        }
    }

    private Path csvWithRows(Path tempDir, int count) throws IOException {
        List<String> rows = new java.util.ArrayList<>();
        for (int i = 1; i <= count; i++) {
            rows.add(String.format("p%05d,startpos,e2e4,%d,%d,%d,%d,,https://example.com/%d",
                i, 1500 + i, 50 + i, 90 + i, 1000 + i, i));
        }
        return writeCsv(tempDir, rows);
    }

    private Path writeCsv(Path tempDir, List<String> rows) throws IOException {
        Path csv = tempDir.resolve("puzzles.csv");
        List<String> lines = new java.util.ArrayList<>();
        lines.add(String.join(",", HEADERS));
        lines.addAll(rows);
        Files.write(csv, lines);
        return csv;
    }
}