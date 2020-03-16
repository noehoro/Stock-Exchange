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
        let list = "";
        //for each element add a row
        for (i of data) {
          list += addRow(i);
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
function addRow(i) {
  return `<li class="parent"><span class="Name">${i.name}</span><span class="ticker">(${i.symbol})</span></li>`;
}

//Receive the list and print it
function displayResults(list) {
  let results = document.getElementById("results");
  results.innerHTML = list;
}

// When Button is clicked
let button = document.getElementById("button");
button.addEventListener("click", buttonClicked);
