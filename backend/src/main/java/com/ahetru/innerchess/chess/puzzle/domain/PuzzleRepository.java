package com.ahetru.innerchess.chess.puzzle.domain;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PuzzleRepository extends JpaRepository<Puzzle, String> {

    @Query(value = "SELECT * FROM puzzle ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<Puzzle> findRandom();
}
