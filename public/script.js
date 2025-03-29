let currentStory = null;

async function fetchBookmarks() {
  const response = await fetch("/bookmarks");
  const bookmarks = await response.json();

  const bookmarkList = document.getElementById("bookmarkList");
  bookmarkList.innerHTML = "";

  bookmarks.forEach((bookmark) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${bookmark.url}" target="_blank">${bookmark.title}</a> by ${bookmark.author} (Score: ${bookmark.score}, Comments: ${bookmark.comments})`;
    bookmarkList.appendChild(li);
  });
}

document.getElementById("fetchBtn").addEventListener("click", async () => {
  const hnUrl = document.getElementById("hnUrl").value;

  if (!hnUrl) {
    alert("Please enter a Hacker News URL");
    return;
  }

  const response = await fetch("/fetch-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: hnUrl }),
  });

  const data = await response.json();

  if (response.ok) {
    currentStory = data;
    document.getElementById("storyDetails").innerHTML = `
      <h3>${data.title}</h3>
      <p><strong>Author:</strong> ${data.author}</p>
      <p><strong>Score:</strong> ${data.score}</p>
      <p><strong>Comments:</strong> ${data.comments}</p>
      <p><a href="${data.url}" target="_blank">Read Story</a></p>
    `;
  } else {
    alert(data.error || "Failed to fetch story details");
  }
});

document.getElementById("bookmarkBtn").addEventListener("click", async () => {
  if (!currentStory) {
    alert("Fetch a story first!");
    return;
  }

  const response = await fetch("/bookmark", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentStory),
  });

  const result = await response.json();

  if (response.ok) {
    alert("Story bookmarked successfully!");
    fetchBookmarks();
  } else {
    alert(result.error || "Failed to bookmark story");
  }
});

// Initial load
fetchBookmarks();
