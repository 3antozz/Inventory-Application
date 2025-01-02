const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  message TEXT,
  date_added TIMESTAMP 
);

INSERT INTO messages (username, message, date_added) 
VALUES
  ('Bryan', 'Hello there!', '2024-12-31 14:30:00'),
  ('Odin', 'IM HERE!', '2025-01-01 23:30:00'),
  ('Damon', '3antozlozz', '2026-05-05 07:25:00');
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