import express from "express";
import cors from "cors";
import axios from "axios";
import { initializeDatabase, getBookmarks, addBookmark } from "./db.ts";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Initialize database when server starts
await initializeDatabase();

// Endpoint to fetch story from HN
app.post("/fetch-story", async (req, res) => {
  const { url } = req.body;

  const idMatch = url.match(/id=(\d+)/);
  if (!idMatch) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const storyId = idMatch[1];

  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
    );

    const storyData = {
      id: storyId,
      title: response.data.title,
      url: response.data.url,
      score: response.data.score,
      comments: response.data.descendants,
      author: response.data.by,
    };

    res.json(storyData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching story from HN API" });
  }
});

// Endpoint to save a bookmark
app.post("/bookmark", async (req, res) => {
  const bookmark = req.body;

  try {
    await addBookmark(bookmark);
    res.json({ success: true });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Bookmark already exists." });
    } else {
      res.status(500).json({ error: "Error saving bookmark" });
    }
  }
});

// Endpoint to retrieve all bookmarks
app.get("/bookmarks", async (_req, res) => {
  try {
    const bookmarks = await getBookmarks();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookmarks" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
