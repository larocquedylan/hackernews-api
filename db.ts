import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "db.sqlite");

// Create/connect to SQLite database
const db = new sqlite3.Database(join(__dirname, "bookmarks.db"));

// Initialize database
export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        score INTEGER,
        comments INTEGER,
        author TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Helper functions for CRUD operations
export function getBookmarks(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM bookmarks ORDER BY created_at DESC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function addBookmark(bookmark: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const { id, title, url, score, comments, author } = bookmark;
    db.run(
      "INSERT INTO bookmarks (id, title, url, score, comments, author) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, url, score, comments, author],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}
