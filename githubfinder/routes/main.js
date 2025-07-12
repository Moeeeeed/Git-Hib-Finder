import { CONFIG } from '../config.js';
  const toggleButton = document.querySelector('.inner-toggle');
const suggestionsContainer = document.querySelector('.Suggestions');
const body = document.body;
const searchBar = document.querySelector('.search-bar');

let isDarkMode = false;

const togglePositions = {
  small: '110%',
  medium: '140%',
  large: '190%',
  xlarge: '240%'
};

function getTogglePosition() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 550) 
    return togglePositions.small;
  if (screenWidth < 650) 
    return togglePositions.medium;
  if (screenWidth < 720) 
    return togglePositions.large;
  
  return togglePositions.xlarge;
}

function toggleColorMode() {
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    toggleButton.style.transform = `translateX(${getTogglePosition()})`;
    body.style.background = 'grey';
  } else {
    toggleButton.style.transform = 'translateX(0%)';
    body.style.background = 'black';
  }
}

function showSuggestions(data) {
  suggestionsContainer.innerHTML = '';
  
  data.slice(0,5).forEach(user => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = 'suggestion';
    suggestionDiv.innerHTML = `<a href="userprofile.html" class="u1">${user.login}</a>`;
    suggestionDiv.style.fontSize="0.7rem";
    suggestionDiv.style.color='white';
    suggestionDiv.style.justifyContent = 'space-between';
    suggestionDiv.style.display = 'flex';
    suggestionDiv.style.padding="0.4rem"
    suggestionDiv.style.backgroundColor="grey";
    suggestionsContainer.appendChild(suggestionDiv);
    suggestionDiv.addEventListener('click',()=>
    {
      localStorage.setItem("username",user.login);
    })
  });
  
}

async function fetchSuggestions(searchText) {
  try {
    const response = await fetch(`https://api.github.com/search/users?q=${searchText}`,{
      headers:{
        Authorization:`token ${CONFIG.GITHUB_TOKEN}`,
      },
    });
    if(response.ok) {
      const data = await response.json();
      if(data) 
        showSuggestions(data.items);
    }
  } catch(err) {
    console.error("Error fetching suggestions:", err);
  }
}

toggleButton.addEventListener('click', toggleColorMode);

searchBar.addEventListener('input', (e) => {
  if(e.target.value.length > 2) {
    fetchSuggestions(e.target.value);
  } else {
    suggestionsContainer.innerHTML = '';
  }
});

window.addEventListener('resize', () => {
  if (isDarkMode) {
    toggleButton.style.transform = `translateX(${getTogglePosition()})`;
  }
});