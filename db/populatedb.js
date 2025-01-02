const { Client } = require("pg");
require("dotenv").config();

const SQL = `

CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) UNIQUE,
  founded_date DATE);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) UNIQUE,
  cover_url TEXT);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) UNIQUE,
  description TEXT,
  release_date DATE,
  cover_url TEXT);

CREATE TABLE IF NOT EXISTS game_genre (
  game_id INTEGER REFERENCES games (id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres (id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id));

CREATE TABLE IF NOT EXISTS game_dev (
  game_id INTEGER REFERENCES games (id) ON DELETE CASCADE,
  developer_id INTEGER REFERENCES developers (id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, developer_id));


INSERT INTO developers (name, founded_date) 
VALUES
  ('Rockstar Games', '1998-02-15'),
  ('Microsoft Studios', '1980-08-22');

INSERT INTO genres (name, cover_url) 
VALUES
  ('Action', 'https://news.xbox.com/en-us/wp-content/uploads/sites/2/KnowYourGenre_ActionRPG_Inline3.jpg'),
  ('Real Time Strategy', 'https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2023/03/10-best-rts-games-of-all-time-1.jpg'),
  ('First Person Shooter', 'https://i.ytimg.com/vi/uywWQTuVqw4/maxresdefault.jpg');

INSERT INTO games (name, description, release_date, cover_url) 
VALUES
  ('GTA V', 'Grand Theft Auto', '2013-09-17', 'https://oyster.ignimgs.com/wordpress/stg.ign.com/2013/04/BG2SpcKCEAEeLeb.jpg'),
  ('GTA IV', 'Grand Theft Auto', '2008-04-29', 'https://upload.wikimedia.org/wikipedia/en/b/b7/Grand_Theft_Auto_IV_cover.jpg'),
  ('Age of Mythology', 'Prostagma!', '2002-10-31', 'https://upload.wikimedia.org/wikipedia/en/c/cc/Age_of_Mythology_Retold_cover_art.jpg');

INSERT INTO game_dev (game_id, developer_id)
VALUES
    ((SELECT id FROM games WHERE name='GTA IV'),
    (SELECT id FROM developers WHERE name='Rockstar Games')),
    ((SELECT id FROM games WHERE name='Age of Mythology'),
    (SELECT id FROM developers WHERE name='Microsoft Studios'));

INSERT INTO game_genre (game_id, genre_id)
VALUES
    ((SELECT id FROM games WHERE name='Age of Mythology'),
    (SELECT id FROM genres WHERE name='Real Time Strategy')),
    ((SELECT id FROM games WHERE name='GTA IV'),
    (SELECT id FROM genres WHERE name='Action')),
    ((SELECT id FROM games WHERE name='GTA IV'),
    (SELECT id FROM genres WHERE name='First Person Shooter')),
    ((SELECT id FROM games WHERE name='GTA V'),
    (SELECT id FROM genres WHERE name='Action')),
    ((SELECT id FROM games WHERE name='GTA V'),
    (SELECT id FROM genres WHERE name='First Person Shooter'));   
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();



const query = `

  SELECT games.name, games.release_date, STRING_AGG(DISTINCT genres.name, ', ') AS genres, STRING_AGG(DISTINCT developers.name, ', ') AS developers
    FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id JOIN game_dev ON games.id=game_dev.game_id JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name, games.release_date;

      SELECT games.name, games.release_date, developers.name AS developer, genres.name AS genre
    FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id JOIN game_dev ON games.id=game_dev.game_id JOIN developers ON developer_id=developers.id;

    SELECT games.name, games.release_date, STRING_AGG(DISTINCT genres.name, ', ') AS genres, STRING_AGG(DISTINCT developers.name, ', ') AS developers
    FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id JOIN game_dev ON games.id=game_dev.game_id JOIN developers ON developer_id=developers.id GROUP BY games.id, games.name ORDER BY games.name;

    SELECT games.name
    FROM games JOIN game_genre ON games.id=game_genre.game_id JOIN genres ON genre_id=genres.id WHERE genres.name='Action';

`