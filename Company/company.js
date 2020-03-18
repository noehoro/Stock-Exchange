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

//Animation when the page loads
function startUpAnimation() {
  document.getElementById("main").classList.add("animation-main");
  show("spinner");
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
    //make it red
    priceChangeTag.classList.add("text-danger");
  } else if (percent[1] === "+") {
    //make it green
    priceChangeTag.classList.add("text-success");
  } else {
    //make it grey
    priceChangeTag.classList.add("text-secondary");
  }
}


function getParams(pram){
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(pram);
}
//fetch the results from API
function fetchResults() {
  let ticker = getParams("symbol");
  console.log(ticker);
  //fetch Stocks from the API
  fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${ticker}`
  ).then(response => {
    if (response.ok) {
      response.json().then(data => {
        let { profile, symbol } = data;
        let {
          image,
          companyName,
          price,
          changesPercentage,
          description
        } = profile;
        setTag(symbol, image);
        setImage(image);
        setCompanyName(companyName);
        setPrice(price, changesPercentage);
        setPriceChangeColor(changesPercentage);
        setAbout(description);
      });
    }
  });
}

function fetchPrices() {
  let ticker = getParams("symbol");
  fetch(
    `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line`
  ).then(response => {
    response.json().then(data => {
      hide("spinner");
      let prices = getPrices(data.historical);
      loadChart(prices);
    });
  });
}

//Transform date to number EX: 2013-03-23 => 20130323
function dateToNumber(date) {
  let number = date.match(/\d+/g).map(Number);
  for (let i = 0; i < number.length; i++) {
    number[i] = `${number[i]}`;
    if (number[i].length === 1) {
      number[i] = `0${number[i]}`;
    }
  }
  number = number.join("");
  number = parseInt(number, 10);
  return number;
}

//Takes in data, looks at object's dates, and gives back object elements labeled after the date
function getPrices(prices) {
  let lastYear = prices.filter(json => dateToNumber(json.date) > 20100303);
  return lastYear;
}

//load the chart
function loadChart(prices) {
  var ctx = document.getElementById("myChart").getContext("2d");
  let labels = [];
  let data = [];
  for (let element of prices) {
    labels.push(element.date);
    data.push(element.close);
  }
  console.log(prices);
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: "Stock Value",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: data
        }
      ]
    },

    // Configuration options go here
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      maintainAspectRatio: false
    }
  });
}

//This happens when the page is loaded
window.onload = function() {
  startUpAnimation();
  fetchResults();
  fetchPrices();
  buttonConfig();
};
