package com.ahetru.innerchess.chess;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ChessBoardTest {

    private final ChessBoard chessBoard = new ChessBoardImplementation();

    @Test
    void returnsTrueForALegalOpeningMove() {
        String startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        assertTrue(chessBoard.isLegalMove(startingPosition, "e2e4"));
    }

    @Test
    void returnsFalseForAnIllegalMove() {
        String startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        assertFalse(chessBoard.isLegalMove(startingPosition, "e2e5"));
    }

    @Test
    void returnsTrueForAPromotionMove() {
        String promotionPosition = "8/P7/8/8/8/8/8/k6K w - - 0 1";

        assertTrue(chessBoard.isLegalMove(promotionPosition, "a7a8q"));
    }

    @Test
    void returnsFalseForMalformedUciMove() {
        String startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

        assertFalse(chessBoard.isLegalMove(startingPosition, "e2"));
    }
}