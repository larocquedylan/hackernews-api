import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const BOOKMARKS_FILE = path.join(__dirname, "bookmarks.json");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Helper function to read bookmarks
async function readBookmarks() {
  try {
    const data = await fs.readFile(BOOKMARKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookmarks file:", error);
    return [];
  }
}

// Helper function to write bookmarks
async function writeBookmarks(bookmarks: any[]) {
  try {
    await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
  } catch (error) {
    console.error("Error writing bookmarks file:", error);
  }
}

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

  const bookmarks = await readBookmarks();

  // Avoid duplicates
  if (bookmarks.some((b: any) => b.id === bookmark.id)) {
    return res.status(400).json({ error: "Bookmark already exists." });
  }

  bookmarks.push(bookmark);
  await writeBookmarks(bookmarks);

  res.json({ success: true });
});

// Endpoint to retrieve all bookmarks
app.get("/bookmarks", async (_req, res) => {
  const bookmarks = await readBookmarks();
  res.json(bookmarks);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
