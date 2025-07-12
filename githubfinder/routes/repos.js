// Get username from localStorage
const username = localStorage.getItem("username");

// Import GitHub token config
import { CONFIG } from "../config.js";

// Function to display repos
function showRepos(userrepos) {
  const container = document.querySelector(".repos-grid");

  userrepos.forEach((repo, i) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = `card card-${i}`;

  cardDiv.innerHTML = `
  <p><strong>Name:</strong> ${repo.name}</p>
  <p><strong>Full Name:</strong> ${repo.full_name}</p>
  <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
  <p><a href="${repo.html_url}" target="_blank">View on GitHub</a></p>
  <p><strong>Total Forks:</strong> ${repo.forks_count}</p>
  <p><strong>Created At:</strong> ${repo.created_at}</p>
  <p><strong>Updated At:</strong> ${repo.updated_at}</p>
  <p><strong>Pushed At:</strong> ${repo.pushed_at}</p>
  <p><strong>Watcher Count:</strong> ${repo.watchers_count}</p>
`;

    container.appendChild(cardDiv);
  });
}

async function getUserRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `token ${CONFIG.GITHUB_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error("The web page has encountered an error");
    }

    const data = await res.json(); 
    showRepos(data); 
  } catch (error) {
    console.error(error.message);
  }
}

// Call the function
if (username) {
  getUserRepos(username);
} else {
  console.warn("No username found in localStorage");
}
