//Script

//button configuration
function buttonConfig() {
  //search button
  let button = document.getElementById("button");
  let searchInput = document.getElementById("search");
  button.addEventListener("click", buttonClicked);
  searchInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      buttonClicked();
    }
  });
  let buttons = ["btn1", "btn2", "btn3", "btn4"];
  for (let btn of buttons) {
    btn = document.getElementById(btn);
    btn.addEventListener("click", function() {
      changeTimeFrame(btn);
    });
  }
  //when the screen loads, set the graph to 1 year
  changeTimeFrame(document.getElementById(buttons[1]));
}

function changeTimeFrame(btn) {
  let timeFrame;
  let date = getDate();
  if (btn === btn1) {
    timeFrame = date - 50000;
  } else if (btn === btn2) {
    timeFrame = date - 10000;
  } else if (btn === btn3) {
    timeFrame = date - 300;
  } else if (btn === btn4) {
    timeFrame = date - 100;
  }
  fetchPrices(timeFrame);
}

function getDate() {
  var today = new Date();
  var day = String(today.getDate()).padStart(2, "0");
  var month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var year = today.getFullYear();
  today = `${year}-${month}-${day}`;
  today = dateToNumber(today);
  return today;
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

//fetch the results from API
function fetchResults() {
  let ticker = getParams("symbol");
  //fetch Stocks from the API
  fetch(`https://financialmodelingprep.com/api/v3/company/profile/${ticker}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(data => {
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
      setPriceChangeColor(changesPercentage, "priceChange");
      setAbout(description);
    });
}

function fetchPrices(timeFrame) {
  let ticker = getParams("symbol");
  fetch(
    `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line`
  )
    .then(response => {
      return response.json();
    })
    .then(data => {
      hide("spinner");
      let prices = getPrices(data.historical, timeFrame);
      loadChart(prices);
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
function getPrices(prices, timeFrame) {
  let lastYear = prices.filter(json => dateToNumber(json.date) > timeFrame);
  return lastYear;
}

//load the chart
function loadChart(prices) {
  var ctx = document.getElementById("myChart").getContext("2d");
  let labels = [];
  let data = [];
  for (let element of prices) {
    let { date, close } = element;
    labels.push(date);
    data.push(close);
  }
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
  buttonConfig();
};
