import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ahetru.innerchess.chess.puzzle.domain.Puzzle;
import com.ahetru.innerchess.chess.puzzle.domain.PuzzleRepository;


@Component
public class LichessPuzzleCsvImporter {

    private final PuzzleRepository repository;

    public LichessPuzzleCsvImporter(PuzzleRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public int importFromCsv(Path csvFile, int maxPuzzles) throws IOException {
        try (var reader = Files.newBufferedReader(csvFile);
         var csvParser = CSVFormat.DEFAULT.builder()
             .setHeader()
             .setSkipHeaderRecord(true)
             .build()
             .parse(reader)) {

        List<Puzzle> batch = new ArrayList<>(1000);
        int imported = 0;

        for (CSVRecord record : csvParser) {
            if (imported >= maxPuzzles) {
                break;
            }

            batch.add(mapToPuzzle(record));
            imported++;

            if (batch.size() == 1000) {
                repository.saveAll(batch);
                batch.clear();
            }
        }

        if (!batch.isEmpty()) {
            repository.saveAll(batch);
        }

        return imported;
    }
}

    private Puzzle mapToPuzzle(CSVRecord r) {
        return new Puzzle( 
            r.get("id"),
            r.get("fen"),
            r.get("moves"),
            Integer.parseInt(r.get("rating")),
            Integer.valueOf(r.get("RatingDeviation")),
            Integer.valueOf(r.get("Popularity")),
            Integer.valueOf(r.get("NbPlays")),
            r.get("themes"),
            r.get("gameUrl")
        );
    }
}