/*var form = document.getElementById("ithub-form");

form.addEventListener('submit', function(e){

    e.preventDefault()
    var search = document.getElementById("search").value

    var originalNamer = search.split(' ').join('')

    fetch("https://api.github.com/user")

    .then((result) => result.json())
    .then((data) => {
        console.log(data)
    })
}) */


const githubForm = document.getElementById("github-form");
const searchInput = document.getElementById("search");
const userList = document.getElementById("user-list");
const reposList = document.getElementById("repos-list");

// Event listener for form submission
githubForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  
  // Check if the searchValue is empty
  if (!searchValue) {
    alert("Please enter a GitHub username.");
    return;
  }
  
  // Call a function to search for users by name
  searchUsers(searchValue);
});

// Function to search for users by name
function searchUsers(username) {
  // Make a GET request to the GitHub API User Search Endpoint
  fetch(`https://api.github.com/search/users?q=${username}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear previous search results
      userList.innerHTML = "";
      
      // Loop through the results and display user information
      data.items.forEach((user) => {
        const userItem = document.createElement("li");
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" />
          <a href="${user.html_url}" target="_blank">${user.login}</a>
          <button data-username="${user.login}">View Repos</button>
        `;
        userList.appendChild(userItem);
        
        // Add an event listener to the "View Repos" button
        userItem.querySelector("button").addEventListener("click", () => {
          const username = user.login;
          // Call a function to fetch and display user repositories
          fetchUserRepos(username);
        });
      });
    })
    .catch((error) => console.error(error));
}

// Function to fetch and display user repositories
function fetchUserRepos(username) {
  // Make a GET request to the GitHub API User Repos Endpoint
  fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear previous repositories
      reposList.innerHTML = "";
      
      // Loop through the repositories and display them
      data.forEach((repo) => {
        const repoItem = document.createElement("li");
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        reposList.appendChild(repoItem);
      });
    })
    .catch((error) => console.error(error));
}


const toggleSearchButton = document.getElementById("toggle-search");
let currentSearchType = "user"; // Initialize as user search by default

toggleSearchButton.addEventListener("click", () => {
  // Toggle between user and repo search
  currentSearchType = currentSearchType === "user" ? "repo" : "user";
  toggleSearchButton.textContent = `Search ${currentSearchType}s`;
  searchInput.placeholder = `Search ${currentSearchType}s by name...`;
});

// Modify the submit event listener to perform the appropriate search
githubForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchValue = searchInput.value.trim();
  
  if (!searchValue) {
    alert(`Please enter a GitHub ${currentSearchType === "user" ? "username" : "repository name"}.`);
    return;
  }
  
  if (currentSearchType === "user") {
    searchUsers(searchValue);
  } else {
    searchRepos(searchValue);
  }
});

// Add a function to search for repositories by keyword
function searchRepos(keyword) {
  fetch(`https://api.github.com/search/repositories?q=${keyword}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      reposList.innerHTML = "";
      data.items.forEach((repo) => {
        const repoItem = document.createElement("li");
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        reposList.appendChild(repoItem);
      });
    })
    .catch((error) => console.error(error));
}
