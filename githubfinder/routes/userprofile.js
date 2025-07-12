
import { CONFIG } from '../config.js';

const username = localStorage.getItem("username");
if(!username)
{
console.log("ther is not username in local storage");
}
async function userDetail(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}`, { 
            headers: {
                Authorization: `token ${CONFIG.GITHUB_TOKEN}`,
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayProfile(data);
    }
    catch(err)
     {
        console.error("Error fetching user details:", err.message);
        
        document.querySelector('.profile-card').innerHTML = `
            <div class="error">Error loading profile: ${err.message}</div>
        `;
    }
}

function displayProfile(user) {
    const profilePic = document.querySelector('.profile-picture');
    const usernameEl = document.querySelector('.username');
    const reposEl = document.querySelector('.public-repos');
    const locationEl = document.querySelector('.location');
    const bioEl = document.querySelector('.bio');
    const profileLinkEl = document.querySelector('.html-url');

    // Always available fields
    profilePic.innerHTML = `<img class="pp" src="${user.avatar_url}" alt="${user.login}'s profile">`;
    usernameEl.textContent = `Username:  ${user.login}`;
    reposEl.textContent = `Public Repositories: ${user.public_repos}`;
    profileLinkEl.innerHTML = `<a href="${user.html_url}" target="_blank">View Full Profile</a>`;

    // Conditional fields
    if (user.location) {
        locationEl.textContent = `Location: ${user.location}`;
    } else {
        locationEl.textContent = 'Location: Not specified';
        locationEl.style.opacity = '0.7';
    }

    if (user.bio) {
        bioEl.textContent = user.bio;
    } else {
        bioEl.textContent = 'This user has no bio.';
        bioEl.classList.add('no-bio');
    }
}

if (username) {
    userDetail(username);
} 
else 
{
    console.error("No username found in localStorage");
    document.querySelector('.profile-card').innerHTML = `
        <div class="error">No user profile selected</div>`;
}