package com.ahetru.innerchess.chess.puzzle.domain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PuzzleRepository extends JpaRepository<Puzzle, String> {
    
}
