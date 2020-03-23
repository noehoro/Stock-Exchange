// Script

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
  window.history.pushState("", "", `./index.html?query=${query}`);
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
  let ticker = getParams("query");
  let searchInput = getSearchInput();
  //Get value from input
  ticker = searchInput.value;
  //so that the url updates
  addState(ticker);
  //fetch Stocks from the API
  fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${ticker}&limit=10`
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(data => {
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
      fetchImages(data);
      let results = document.getElementsByClassName("tickerName");
      for (let li of results) {
        let temp = li.innerHTML;
        temp = temp.replace(new RegExp(ticker, "gi"), (match) => `<strong>${match}</strong>`);
        li.innerHTML = temp;
      }
    });
}

//gets and sets the live stocks
function setLiveStocks() {
  //how many of the stocks from the list do you want to display?
  let numberOfStocks = 300;
  fetch("https://financialmodelingprep.com/api/v3/company/stock/list")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let div = document.getElementById("stocks");
      div.innerHTML = "";
      for (let i = 0; i < numberOfStocks; i++) {
        let { symbol, price } = data.symbolsList[i];
        let node = document.createElement("a");
        node.classList = "liveTicker";
        node.href = `./Company/company.html?symbol=${symbol}`;
        node.innerHTML = `${symbol}: <span class="text-success">${price}</span>`;
        div.appendChild(node);
      }
    });
}

//fetches and displays the images when searching
function fetchImages(data) {
  let urls = [];
  for (let info of data) {
    urls.push(
      `https://financialmodelingprep.com/api/v3/company/profile/${info.symbol}`
    );
  }
  Promise.all(urls.map(url => fetch(url).then(resp => resp.json()))).then(
    data => {
      for (let element of data) {
        let imgDiv = document.getElementById(element.symbol);
        let percentSpan = document.getElementById(`${element.symbol}change`);
        imgDiv.innerHTML = `<img src='${element.profile.image}' alt='${element.symbol}'s logo' class='logo-image'>`;
        percentSpan.innerHTML = element.profile.changesPercentage;
        setPriceChangeColor(
          element.profile.changesPercentage,
          `${element.symbol}change`
        );
      }
    }
  );
}

//Create Take in data in form of JSON and create a row
function addRow(data) {
  let { symbol, name } = data;
  //links to different file
  let link = `./Company/company.html?symbol=${symbol}`;
  let spinnerDiv = '<div class="spinner-grow text-muted"></div>';
  let html = `<a href=${link} class="parent list-links noLink"><div id= "${symbol}" class= "logos parent">${spinnerDiv}</div><span class="ticker"><span class = "tickerName">${name}</span> (${symbol})</span> <span id="${symbol}change" class="percentageChange"></span></a>`;
  return html;
}

//Receive the list and print it
function displayResults(list) {
  let results = document.getElementById("results");
  results.innerHTML = ""; //reset results
  results.appendChild(list);
}

//Run at the beginning of the program, if the query ticker is empty then it runs it
function checkTicker() {
  let ticker = getParams("query");
  let searchInput = getSearchInput();
  if (ticker) {
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
  setLiveStocks();
  checkTicker();
};
