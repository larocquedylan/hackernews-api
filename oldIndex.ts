import axios from "axios";
import { createInterface } from "readline";

async function fetchTopStories() {
  try {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const topStoryIds: number[] = response.data;

    for (let i = 0; i < 10; i++) {
      // Print top 10 stories
      const storyId = topStoryIds[i];
      const storyResponse = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      );
      const storyData = storyResponse.data;

      console.log(`Title: ${storyData.title}`);
      console.log(`Author: ${storyData.by}`);
      console.log(`URL: ${storyData.url}`);
      console.log(`Score: ${storyData.score}`);
      console.log(`storyDAta: ${storyData}`);
      console.log("-----");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.error("Error fetching data:", String(error));
    }
  }
}

// fetchTopStories();

// Read the HN URL from the user
// get the id from the url
// fetch the story data
// print the story data

async function fetchStoryByURL(url: string) {
  try {
    // Extract ID from HN URL
    const idMatch = url.match(/id=(\d+)/);
    if (!idMatch) {
      console.error("Invalid HN URL format");
      return;
    }
    console.log(`idMatch: ${idMatch}`);
    const storyId = idMatch[1];
    console.log(`storyId: ${storyId}`);

    const response = await axios.get(
      // `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
    );
    const storyData = response.data;

    console.log("\nStory Details:");
    console.log(`Title: ${storyData.title}`);
    console.log(`URL: ${storyData.url}`);
    console.log(`Score: ${storyData.score}`);
    console.log(`Comments: ${storyData.descendants}`);
    console.log("--------------------------------");
    console.log("Full Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(
      "Error fetching story:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Enter HN URL (e.g. https://news.ycombinator.com/item?id=43514383): ",
  (url: string) => {
    fetchStoryByURL(url);
    rl.close();
  }
);

// fetchStoryByURL("https://hacker-news.firebaseio.com/v0/item/30942477.json");
