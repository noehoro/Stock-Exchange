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
function setTag(data) {
  document.getElementById("title").innerText = data.symbol;
  document.getElementById("icon").setAttribute("href", data.profile.image);
}

//insert image
function setImage(data) {
  let img = document.getElementById("img");
  img.innerHTML = `<img src=${data.profile.image} alt= '${data.profile.companyName} name' style='height:100%'>`;
}

//insert name
function setCompanyName(data) {
  let name = document.getElementById("name");
  name.innerHTML = data.profile.companyName;
}

//insert stock price
function setPrice(data) {
  let price = document.getElementById("price");
  let changesPercentage = data.profile.changesPercentage;
  price.innerHTML = `Stock price: $${data.profile.price} <span id="priceChange">${changesPercentage}</span>`;
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
        setImage(data);
        setTag(data);
        setCompanyName(data);
        setPrice(data);
        setPriceChangeColor(data.profile.changesPercentage);
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
