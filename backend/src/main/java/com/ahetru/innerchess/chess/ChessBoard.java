package com.ahetru.innerchess.chess;
import com.github.bhlangonijr.chesslib.*;

public interface ChessBoard {
    boolean isLegalMove(String fen, String moveSan);
}