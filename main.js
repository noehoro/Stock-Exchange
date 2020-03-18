// Script

//receives the Params from the URL
function getParams() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("query");
}

//returns the search tag
function getSearchInput() {
  return document.getElementById("search");
}

// Button Configuration
function buttonConfig() {
  let searchInput = getSearchInput();
  //define button
  let button = document.getElementById("button");

  //when button is clicked
  button.addEventListener("click", buttonClicked);

  //When Enter is pressed
  searchInput.addEventListener("keyup", function(event) {
    let results = document.getElementById("results-container");
    if (event.keyCode === 13) {
      event.preventDefault();
      buttonClicked();
    } else if (this.value.length >= 1) {
      buttonClicked();
    } else if (this.value.length === 0) {
      addState("");
      results.classList.remove("animation-show-results");
      results.classList.add("animation-hide");
    }
  });
}

//Edit the link so that is matches the search
function addState(query) {
  window.history.pushState("", "", `/index.html?query=${query}`);
}

//Do this when the button is clicked
function buttonClicked() {
  let results = document.getElementById("results-container");
  results.classList.remove("animation-hide");
  results.classList.add("animation-show-results");
  hide("results");
  show("spinner");
  //Go and fetch the results
  fetchResults();
}

function fetchResults() {
  let ticker = getParams();
  let searchInput = getSearchInput();
  //Get value from input
  ticker = searchInput.value;
  //so that the url updates
  addState(ticker);
  //fetch Stocks from the API
  fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${ticker}&limit=10`
  ).then(response => {
    if (response.ok) {
      response.json().then(data => {
        //Create new list
        let list = document.createDocumentFragment();
        //checks if there are any results, otherwise returns "no results"
        if (data.length) {
          //for each element add a row, add to the document a new row
          for (let info of data) {
            let li = document.createElement("li");
            li.classList.add("parent");
            li.innerHTML = addRow(info);
            list.appendChild(li);
          }
        } else {
          //No Results
          let li = document.createElement("li");
          li.classList.add("parent");
          li.innerHTML = "No Results";
          list.appendChild(li);
        }
        //show the resulting list
        hide("spinner");
        show("results");
        displayResults(list);
      });
    }
  });
}

//Create Take in data in form of JSON and create a row
function addRow(data) {
  let { symbol, name } = data;
  //links to different file
  let link = `./Company/company.html?symbol=${symbol}`;
  return `<span class="Name">${name}</span><a href=${link} class="ticker">(${symbol})</a>`;
}

//Receive the list and print it
function displayResults(list) {
  let results = document.getElementById("results");
  results.innerHTML = ""; //reset results
  results.appendChild(list);
}

//Run at the beginning of the program, if the query ticker is empty then it runs it
function checkTicker() {
  let ticker = getParams();
  let searchInput = getSearchInput();
  if (ticker !== "" && ticker !== null) {
    searchInput.value = ticker;
    buttonClicked();
  } else {
    return;
  }
}

//searchbar Animation
function searchBarAnimation() {
  document
    .getElementById("search-bar-container")
    .classList.add("animation-show-search-bar");
}
//This happens when the page is loaded
window.onload = function() {
  searchBarAnimation();
  buttonConfig();
  checkTicker();
};
