// Script
function show(tag) {
  document.getElementById(tag).classList.remove("hide");
}

function hide(tag) {
  document.getElementById(tag).classList.add("hide");
}

function buttonClicked() {
  show("spinner");
  hide("results");
  fetchResults();
}

function fetchResults() {
  //Get value from input
  let searchInput = document.getElementById("search");
  let ticker = searchInput.value;

  //fetch Stocks from API
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
        } else{ //No Results
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
  return `<span class="Name">${json.name}</span><a href=${link} target="_blank" class="ticker">(${json.symbol})</a>`;
}

//Receive the list and print it
function displayResults(list) {
  let results = document.getElementById("results");
  results.innerHTML = ""; //reset results
  results.appendChild(list);
}

// When Button is clicked
let button = document.getElementById("button");
let searchInput = document.getElementById("search");
button.addEventListener("click", buttonClicked);
searchInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    button.click();
  }
});
