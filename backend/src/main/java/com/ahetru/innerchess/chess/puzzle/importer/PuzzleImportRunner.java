package com.ahetru.innerchess.chess.puzzle.importer;

import java.nio.file.Path;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("import-puzzles")
public class PuzzleImportRunner implements CommandLineRunner {

    private final LichessPuzzleCsvImporter importer;

    public PuzzleImportRunner(LichessPuzzleCsvImporter importer) {
        this.importer = importer;
    }

    @Override
    public void run(String... args) throws Exception {
        Path csvPath = Path.of(args[0]);
        int maxPuzzles = args.length > 1 ? Integer.parseInt(args[1]) : 500;

        int imported = importer.importFromCsv(csvPath, maxPuzzles);
        System.out.println("Puzzles importés : " + imported);
    }
}