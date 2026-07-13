package com.ahetru.innerchess.chess;
import org.springframework.stereotype.Component;

import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Square;
import com.github.bhlangonijr.chesslib.Side;
import com.github.bhlangonijr.chesslib.Piece;
import com.github.bhlangonijr.chesslib.move.Move;

@Component
public class ChessBoardImplementation implements ChessBoard {

    private Piece getPromotionPiece(char promotionChar, Side side) {

        return switch(promotionChar) {
            case 'q' -> side == Side.WHITE ? Piece.WHITE_QUEEN : Piece.BLACK_QUEEN;
            case 'r' -> side == Side.WHITE ? Piece.WHITE_ROOK : Piece.BLACK_ROOK;
            case 'b' -> side == Side.WHITE ? Piece.WHITE_BISHOP : Piece.BLACK_BISHOP;
            case 'n' -> side == Side.WHITE ? Piece.WHITE_KNIGHT : Piece.BLACK_KNIGHT;
            default -> throw new IllegalArgumentException("Invalid promotion character: " + promotionChar);
        };
    }

    private Move uciStringToMove(Board board, String uciString) {
        if (uciString.length() < 4 || uciString.length() > 5) {
            throw new IllegalArgumentException("Invalid UCI string: " + uciString);
        }
        Square from = Square.fromValue(uciString.substring(0,2).toUpperCase());
        Square to   = Square.fromValue(uciString.substring(2,4).toUpperCase());

        if (uciString.length() == 5) {
            Side side = board.getSideToMove();
            Piece promotionPiece = getPromotionPiece(uciString.charAt(4), side);
            return new Move(from, to, promotionPiece);
        }
        return new Move(from, to);
    }

    @Override
    public boolean isLegalMove(String fen, String uciString) {
        Board board = new Board();
    
        //Note(ahetru): this method does not check at all if the position is valid
        board.loadFromFen(fen);

        try {
            Move move = uciStringToMove(board, uciString);
            return board.isMoveLegal(move, true);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
}
