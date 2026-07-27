CREATE TABLE puzzle (
    id              VARCHAR(10) PRIMARY KEY,
    fen             VARCHAR(100) NOT NULL,
    moves           VARCHAR(255) NOT NULL,
    rating          INTEGER NOT NULL,
    rating_deviation INTEGER,
    popularity      INTEGER,
    nb_plays        INTEGER,
    themes          VARCHAR(500),
    game_url        VARCHAR(255)
);

CREATE INDEX idx_puzzle_rating ON puzzle(rating);
CREATE INDEX idx_puzzle_themes ON puzzle(themes);
