class liveStocks {
  constructor(id, numberOfStocks) {
    this.id = id;
    this.numberOfStocks = numberOfStocks;
    this.link = "/API/display/";
    this.createElements();
    this.render();
  }

  createElements() {
    this.bigContainer = document.getElementById(this.id);
    this.bigContainer.classList = "stocks-slideshow";
    this.container = document.createElement("div");
    this.container.classList = "mover parent";
    this.bigContainer.appendChild(this.container);
  }
  //gets and sets the live stocks
  render() {
    this.renderLoading();
    //how many of the stocks from the list do you want to display?
    fetch(this.link)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.displayStocks(data);
      });
  }

  displayStocks(data) {
    this.container.innerHTML = "";
    for (let i = 0; i < this.numberOfStocks; i++) {
      const { symbol, price } = data.symbolsList[i];
      const node = document.createElement("a");
      node.classList = "liveTicker";
      node.href = `/company/${symbol}`;
      const symbolText = document.createTextNode(`${symbol}: `);
      node.appendChild(symbolText);
      const priceSpan = document.createElement("span");
      const priceText = document.createTextNode(price);
      priceSpan.appendChild(priceText);
      priceSpan.classList = "text-success";
      node.appendChild(priceSpan);
      this.container.appendChild(node);
    }
  }

  //render loading and spinner
  renderLoading() {
    const loadingSpan = document.createElement("strong");
    const loadingText = document.createTextNode(`Loading...`);
    loadingSpan.appendChild(loadingText);
    this.container.appendChild(loadingSpan);
    const spinnerDiv = document.createElement("div");
    spinnerDiv.classList = "spinner-border";
    this.container.appendChild(spinnerDiv);
  }
}

class main extends Shared {
  constructor() {
    super();
    this.ticker = super.getParams("query");
    this.createElements();
    this.buttonConfig();
    this.checkTicker();
  }

  createElements() {
    this.searchBar = new searchBar();
  }

  buttonConfig() {
    //when button is clicked
    this.searchBar.button.addEventListener("click", this.buttonClicked);
    //When Enter is pressed
    this.searchBar.searchInput.addEventListener("keyup", event => {
      const input = this.searchBar.searchInput;
      const results = document.getElementById("results-container");
      if (input.value.length >= 1) {
        event.preventDefault();
        this.buttonClicked();
      } else if (input.value.length === 0) {
        super.addState("");
        results.classList.remove("animation-show-results");
        results.classList.add("animation-hide");
      }
    });
  }

  checkTicker() {
    if (this.ticker) {
      this.searchBar.searchInput.value = this.ticker;
      this.buttonClicked();
    }
  }

  buttonClicked() {
    let results = document.getElementById("results-container");
    results.classList.remove("animation-hide");
    results.classList.add("animation-show-results");
    super.hide("results");
    super.show("spinner");
    this.fetchResults();
  }

  fetchResults() {
    //Get value from input
    this.ticker = this.searchBar.searchInput.value;
    //so that the url updates
    super.addState(this.ticker);
    //fetch Stocks from the API
    fetch(
      `/API/search/${this.ticker}`
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        //Create new list
        let list = document.createDocumentFragment();
        if (data.length) {
          //for each element add a row, add to the document a new row
          for (let info of data) {
            let li = document.createElement("li");
            li.classList.add("parent");
            li.innerHTML = this.addRow(info);
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
        super.hide("spinner");
        super.show("results");
        this.displayResults(list);
        this.fetchImages(data);
        let results = document.getElementsByClassName("ticker");
        for (let li of results) {
          let temp = li.innerHTML;
          temp = temp.replace(
            new RegExp(this.ticker, "gi"),
            match => `<strong>${match}</strong>`
          );
          li.innerHTML = temp;
        }
      });
  }

  addRow(data) {
    let { symbol, name } = data;
    //links to different file
    let link = `/company/${symbol}`;
    let spinnerDiv = '<div class="spinner-grow text-muted"></div>';
    let html = `<a href=${link} class="parent list-links noLink">
                  <div id= "${symbol}" class= "logos parent">
                    ${spinnerDiv}
                  </div>
                  <span class="ticker">
                    ${name}(${symbol})
                  </span> 
                  <span id="${symbol}change" class="percentageChange"></span>
                </a>`;
    return html;
  }

  displayResults(list) {
    let results = document.getElementById("results");
    results.innerHTML = ""; //reset results
    results.appendChild(list);
  }

  fetchImages(data) {
    let urls = [];
    for (let info of data) {
      urls.push(
        `/API/image/${info.symbol}`
      );
    }
    Promise.all(urls.map(url => fetch(url).then(resp => resp.json()))).then(
      data => {
        for (let element of data) {
          let imgDiv = document.getElementById(element.symbol);
          let percentSpan = document.getElementById(`${element.symbol}change`);
          imgDiv.innerHTML = `<img src='${element.profile.image}' alt='${element.symbol}'s logo' class='logo-image'>`;
          percentSpan.innerHTML = element.profile.changesPercentage;
          super.setPriceChangeColor(
            element.profile.changesPercentage,
            `${element.symbol}change`
          );
        }
      }
    );
  }
}

class searchBar {
  constructor() {
    this.createElements();
    this.render();
  }

  createElements() {
    this.placeHolder = "Search stocks";
    this.container = document.getElementById("searchBarContainer");
    this.container.classList = "parent box search-bar-container shadow-lg";
    this.searchBarForm = document.createElement("div");
    this.searchBarForm.classList = "parent form";
    this.searchInput = document.createElement("input");
    this.searchInput.setAttribute("type", "text");
    this.searchInput.setAttribute("placeholder", this.placeHolder);
    this.searchInput.id = "search";
    this.searchBarForm.appendChild(this.searchInput);
    this.button = new button();
    this.searchBarForm.appendChild(this.button);
    this.container.appendChild(this.searchBarForm);
  }

  render() {
    document
      .getElementById("searchBarContainer")
      .classList.add("animation-show-search-bar");
  }
}

class button {
  constructor() {
    this.createElements();
    return this.tag;
  }

  createElements() {
    this.tag = document.createElement("button");
    this.icon = document.createElement("i");
    this.icon.classList = "fas fa-search";
    this.tag.appendChild(this.icon);
  }
}


//This happens when the page is loaded
window.onload = function() {
  const live = new liveStocks("liveStocksContainer", 200);
  const mainBlock = new main();
};

