// Script

//receives the Params
var urlParams = new URLSearchParams(window.location.search);
let ticker = urlParams.get("query");
let searchInput = document.getElementById("search");

//if ticker isn't empty, then use it!
if (ticker !== "") {
  searchInput.value = ticker;
  buttonClicked();
}
function show(tag) {
  document.getElementById(tag).classList.remove("hide");
}

function hide(tag) {
  document.getElementById(tag).classList.add("hide");
}

//while typing change the value of the parm in the link
function addState(query) {
  window.history.pushState("", "", `/index.html?query=${query}`);
}

function buttonClicked() {
  //defines and animates the results
  let results = document.getElementById("results-container");
  results.classList.remove("animation-hide");
  results.classList.add("animation-show-results");
  show("spinner");
  hide("results");
  fetchResults();
}

function fetchResults() {
  //Get value from input
  ticker = searchInput.value;
  //so that the url updates
  addState(ticker);
  //fetch Stocks from the API
  fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${ticker}&limit=10&exchange=NASDAQ`
  ).then(response => {
    if (response.ok) {
      response.json().then(data => {
        //Create new list
        let list = document.createDocumentFragment();
        if (data.length !== 0) {
          //for each element add a row
          for (json of data) {
            var li = document.createElement("li");
            li.classList.add("parent");
            li.innerHTML = addRow(json);
            list.appendChild(li);
          }
        } else {
          //No Results
          var li = document.createElement("li");
          li.classList.add("parent");
          li.innerHTML = "No Results";
          list.appendChild(li);
        }
        //show the from list
        hide("spinner");
        show("results");
        displayResults(list);
      });
    }
  });
}

//Create Take in JSON and create a row
function addRow(json) {
  let link = `company/company.html?symbol=${json.symbol}`;
  return `<span class="Name">${json.name}</span><a href=${link} class="ticker">(${json.symbol})</a>`;
}

//Receive the list and print it
function displayResults(list) {
  let results = document.getElementById("results");
  results.innerHTML = ""; //reset results
  results.appendChild(list);
}

// When Button is clicked
let button = document.getElementById("button");
button.addEventListener("click", buttonClicked);
searchInput.addEventListener("keyup", function(event) {
  let results = document.getElementById("results-container");
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    button.click();
    //If there is something typed then look for it
  } else if (this.value.length >= 1) {
    button.click();
    //if nothing is typed then change the url and hide the results
  } else if (this.value.length === 0) {
    addState("");
    results.classList.remove("animation-show-results");
    results.classList.add("animation-hide");
  }
});

//This happens when the page is loaded
window.onload = function() {
  document
    .getElementById("search-bar-container")
    .classList.add("animation-show-search-bar");
};
