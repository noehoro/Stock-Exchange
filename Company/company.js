//Script

class CompanyClass extends Shared{
  constructor() {
    super();
    this.startUpAnimation();
    this.fetchResults();
    this.buttonConfig();
  }

  changeTimeFrame(btn) {
    let timeFrame;
    let date = this.getDate();
    switch (btn) {
      case btn1:
        timeFrame = date - 50000;
        break;
      case btn2:
        timeFrame = date - 10000;
        break;
      case btn3:
        timeFrame = date - 300;
        break;
      case btn4:
        timeFrame = date - 100;
        break;
    }
    console.log(timeFrame);
    this.fetchPrices(timeFrame);
  }

  buttonConfig() {
    //search button
    let button = document.getElementById("button");
    let searchInput = document.getElementById("search");
    button.addEventListener("click", this.buttonClicked);
    searchInput.addEventListener("keyup", event => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.buttonClicked();
      }
    });
    // you can grab the buttons by className and loop trhough
    let buttons = ["btn1", "btn2", "btn3", "btn4"];
    for (let btn of buttons) {
      btn = document.getElementById(btn);
      btn.addEventListener("click", () => {
        this.changeTimeFrame(btn);
      });
    }
    //when the screen loads, set the graph to 1 year
    this.changeTimeFrame(document.getElementById(buttons[1]));
  }

  getDate() {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, "0");
    var month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var year = today.getFullYear();
    today = `${year}-${month}-${day}`;
    today = this.dateToNumber(today);
    return today;
  }

  startUpAnimation() {
    document.getElementById("main").classList.add("animation-main");
    super.show("spinner");
  }

  buttonClicked() {
    let searchInput = document.getElementById("search");
    let input = searchInput.value;
    location.href = `../?query=${input}`;
  }
  setTag(symbol, image) {
    document.getElementById("title").innerText = symbol;
    document.getElementById("icon").setAttribute("href", image);
  }
  setImage(image) {
    let img = document.getElementById("img");
    img.innerHTML = `<img src=${image} style='height:100%'>`;
  }
  setCompanyName(companyName) {
    let name = document.getElementById("name");
    name.innerHTML = companyName;
  }
  setAbout(info) {
    let about = document.getElementById("about");
    about.innerHTML = info;
  }
  setPrice(stockPrice, changesPercentage) {
    let price = document.getElementById("price");
    price.innerHTML = `Stock price: $${stockPrice} <span id="priceChange">${changesPercentage}</span>`;
  }
  fetchResults() {
    let ticker = super.getParams("symbol");
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
        this.setTag(symbol, image);
        this.setImage(image);
        this.setCompanyName(companyName);
        this.setPrice(price, changesPercentage);
        super.setPriceChangeColor(changesPercentage, "priceChange");
        this.setAbout(description);
      });
  }
  fetchPrices(timeFrame) {
    let ticker = super.getParams("symbol");
    fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        super.hide("spinner");
        let prices = this.getPrices(data.historical, timeFrame);
        this.loadChart(prices);
      });
  }
  dateToNumber(date) {
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
  getPrices(prices, timeFrame) {
    let lastYear = prices.filter(
      json => this.dateToNumber(json.date) > timeFrame
    );
    return lastYear;
  }
  loadChart(prices) {
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
}

//This happens when the page is loaded
window.onload = new CompanyClass();
