import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeDatabase, addBookmark } from "./db.ts";

const __filename = process.argv[1];
const __dirname = dirname(__filename);

async function migrateBookmarks() {
  try {
    await initializeDatabase();
    const data = await readFile(join(__dirname, "bookmarks.json"), "utf8");
    const bookmarks = JSON.parse(data);

    for (const bookmark of bookmarks) {
      await addBookmark(bookmark);
    }
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateBookmarks();
