package com.ahetru.innerchess.chess.puzzle.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "puzzle")
public class Puzzle {
    @Id
    private String id;
    private String fen;
    private String moves;
    private int rating;
    private Integer ratingDeviation;
    private Integer popularity;
    private Integer nbPlays;
    private String themes;
    private String gameUrl;

    public Puzzle() {
    }

    public Puzzle(String id, String fen, String moves, int rating, Integer ratingDeviation, Integer popularity, Integer nbPlays, String themes, String gameUrl) {
        this.id = id;
        this.fen = fen;
        this.moves = moves;
        this.rating = rating;
        this.ratingDeviation = ratingDeviation;
        this.popularity = popularity;
        this.nbPlays = nbPlays;
        this.themes = themes;
        this.gameUrl = gameUrl;
    }

    public String getId() {return id;}
    public String getFen() {return fen;}
    public String getMoves() {return moves;}
    public int getRating() {return rating;}
    public Integer getRatingDeviation() {return ratingDeviation;}
    public Integer getPopularity() {return popularity;}
    public Integer getNbPlays() {return nbPlays;}
    public String getThemes() {return themes;}
    public String getGameUrl() {return gameUrl;}
}
