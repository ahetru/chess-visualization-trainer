package com.ahetru.innerchess.chess;

public interface ChessBoard {
    boolean isLegalMove(String fen, String uciString);
}