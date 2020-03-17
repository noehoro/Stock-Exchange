//Script

//button configuration
function buttonConfig() {
  let button = document.getElementById("button");
  let searchInput = document.getElementById("search");
  button.addEventListener("click", buttonClicked);
  searchInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      buttonClicked();
    }
  });
}

//shows element
function show(tag) {
  document.getElementById(tag).classList.remove("hide");
}

//hides element
function hide(tag) {
  document.getElementById(tag).classList.add("hide");
}

//if the search is clicked, go back to the original website
function buttonClicked() {
  let searchInput = document.getElementById("search");
  let input = searchInput.value;
  location.href = `../index.html?query=${input}`;
}

//insert Tag Icon and Title
function setTag(symbol, image) {
  document.getElementById("title").innerText = symbol;
  document.getElementById("icon").setAttribute("href", image);
}

//insert image
function setImage(image) {
  let img = document.getElementById("img");
  img.innerHTML = `<img src=${image} style='height:100%'>`;
}

//insert name
function setCompanyName(companyName) {
  let name = document.getElementById("name");
  name.innerHTML = companyName;
}

//insert about
function setAbout(info) {
  let about = document.getElementById("about");
  about.innerHTML = info;
}

//insert stock price
function setPrice(stockPrice, changesPercentage) {
  let price = document.getElementById("price");
  price.innerHTML = `Stock price: $${stockPrice} <span id="priceChange">${changesPercentage}</span>`;
}

//See if the price change is positive or negative and set the color accordingly
function setPriceChangeColor(percent) {
  let priceChangeTag = document.getElementById("priceChange");
  if (percent[1] === "-") {
    priceChangeTag.classList.add("text-danger");
  } else if (percent[1] === "+") {
    priceChangeTag.classList.add("text-success");
  } else {
    priceChangeTag.classList.add("text-secondary");
  }
}

//fetch the results from API
function fetchResults() {
  //Get Params
  let urlParams = new URLSearchParams(window.location.search);
  let ticker = urlParams.get("symbol");
  //fetch Stocks from the API
  fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${ticker}`
  ).then(response => {
    if (response.ok) {
      response.json().then(data => {
        setTag(data.symbol, data.profile.image);
        setImage(data.profile.image);
        setCompanyName(data.profile.companyName);
        setPrice(data.profile.price, data.profile.changesPercentage);
        setPriceChangeColor(data.profile.changesPercentage);
        setAbout(data.profile.description);
      });
    }
  });
}

//This happens when the page is loaded
window.onload = function() {
  document.getElementById("main").classList.add("animation-main");
  fetchResults();
  buttonConfig();
};
