//imported fig anf files
import {CONFIG} from'../config.js'
//global variables area 
const username=localStorage.getItem("username");

const repos=document.querySelector('.total-repos');

//fn dec 
async function totalrepos(username)
{
    try{
var total=await fetch(`https://api.github.com/users/${username}`,{
      headers:{
        Authorization:`token ${CONFIG.GITHUB_TOKEN}`,
      },
    });
  const data=await total.json();
  if(data.public_repos)
  repos.innerHTML=`<b>Total-Repositories</b>: ${data.public_repos}`;
   else
   repos.innerText=`no repos`;
   
    }
    catch(err){
      console.log("the error is ",err.message);
    }
}

const languageBytes = {};  
async function getLang(repos) {
    
    try {
        for (const repo of repos) {
            const response = await fetch(repo.languages_url, {
                headers: { Authorization: `token ${CONFIG.GITHUB_TOKEN}` }
            });
            const data = await response.json();
            
            for (const lang in data) {
                addLanguageBytes(lang, data[lang]);
            }
        }
        return languageBytes;  
    } catch(err) {
        console.error("Error in getLang:", err);
        throw err;  
    }
}
function addLanguageBytes(lang, bytes)
 {
  if (languageBytes[lang])
    {
    languageBytes[lang] += bytes;
  }
   else
   {
    languageBytes[lang] = bytes;
  }
}
async function mostLangUsed(username)
{

try{
let response=await fetch(`https://api.github.com/users/${username}/repos?per_page=100`,{
      headers:{
        Authorization:`token ${CONFIG.GITHUB_TOKEN}`,
      },
    });
  const data=await response.json();
  return data;
}
catch(err){
console.log("error in fetching the data",err.message);
}
}
//display the data 
// display the data 
function displayTheData(data) {
  let totalBytes = 0;
  const langContainer = document.querySelector('.visuals');
  langContainer.innerHTML = ''; // Clear previous content

  // Calculate total bytes
  for (const key in data) {
    totalBytes += data[key];
  }

  // Create a flex container for the bars
  langContainer.style.display = 'flex';
  langContainer.style.flexDirection = 'column';
  langContainer.style.gap = '15px';
  langContainer.style.width = '90%';
  langContainer.style.marginTop = '20px';

  // Create bars for each language
  for (const key in data) {
    const percentage = ((data[key] / totalBytes) * 100).toFixed(1);
    
    // Create bar container
    const barContainer = document.createElement('div');
    barContainer.style.display = 'flex';
    barContainer.style.alignItems = 'center';
    barContainer.style.gap = '10px';
    
    // Language name
    const langName = document.createElement('span');
    langName.textContent = key;
    langName.style.minWidth = '100px';
    langName.style.color = 'white';
    
    // Percentage text
    const percentText = document.createElement('span');
    percentText.textContent = `${percentage}%`;
    percentText.style.color = 'white';
    percentText.style.minWidth = '60px';
    
    // The actual bar
    const bar = document.createElement('div');
    bar.style.height = '20px';
    bar.style.backgroundColor = getRandomColor();
    bar.style.borderRadius = '5px';
    bar.style.width = `${percentage}%`;
    bar.style.minWidth = '3px'; // Ensure very small percentages are visible
    bar.style.transition = 'width 0.5s ease';
    
    // Byte count
    const byteCount = document.createElement('span');
    byteCount.textContent = `(${data[key]} bytes)`;
    byteCount.style.color = '#ccc';
    byteCount.style.fontSize = '0.9em';
    
    // Append all elements
    barContainer.appendChild(langName);
    barContainer.appendChild(bar);
    barContainer.appendChild(percentText);
    barContainer.appendChild(byteCount);
    langContainer.appendChild(barContainer);
  }
}

// Helper function for random colors
function getRandomColor() {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
async function calculateGitHubRank(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `token ${CONFIG.GITHUB_TOKEN}` }
    });
    const userData = await response.json();

    const score = Math.round(
      (userData.followers * 0.5) +         
      (userData.public_repos * 0.3) +      
      (userData.public_gists * 0.1) +      
      (Math.min(userData.following, 500) * 0.1) 
    );
    let tier;
    if (score > 5000) tier = "Elite";
    else if (score > 2000) tier = "Advanced";
    else if (score > 1000) tier = "Intermediate";
    else tier = "Beginner";

    return {
      score,
      tier,
      percentile: Math.min(Math.floor(score / 100), 99) 
    };
  } catch (err) {
    console.error("Rank calculation failed:", err);
    return { score: 0, tier: "Unknown", percentile: 0 };
  }
}
function displayUserRank(rankData) {
  const rankContainer = document.querySelector('.rank-container');
  if (!rankContainer) return;

  rankContainer.innerHTML = `
    <div class="rank-card">
      <h3>GitHub Rank</h3>
      <div class="rank-score">${rankData.score.toLocaleString()}</div>
      <div class="rank-tier">${rankData.tier} Developer</div>
      
      <div class="rank-visual">
        <div class="rank-bar" style="width: ${rankData.percentile}%"></div>
      </div>
      
      <div class="rank-stars">
        ${'★'.repeat(Math.ceil(rankData.percentile / 20))}
        ${'☆'.repeat(5 - Math.ceil(rankData.percentile / 20))}
      </div>
      
      <div class="rank-stats">
        <span>Top ${100 - rankData.percentile}%</span>
      </div>
    </div>
  `;
}
//fn calling 
if(username) {
    totalrepos(username);
    mostLangUsed(username)
        .then(repos => {
            return getLang(repos);  
        })
        .then(languageData => {
            return displayTheData(languageData);  
        })
        .then(() => calculateGitHubRank(username))
        .then(displayUserRank)
        .catch(err => {
            console.log("Error in promise chain:", err);
        
        });
} else {
    console.log("username does not exist");
}
