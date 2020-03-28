class liveStocks {
  constructor(id, numberOfStocks) {
    this.id = id;
    this.numberOfStocks = numberOfStocks;
    this.link = "https://financialmodelingprep.com/api/v3/company/stock/list";
    this.container = document.getElementById(this.id);
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
      node.href = `./Company/company.html?symbol=${symbol}`;
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

class liveIndexes {
  constructor(id) {
    this.id = id;
    this.container = document.getElementById(this.id);
  }

  displayStocks(data) {
    this.container.innerHTML = "";
    for (let i = 0; i < this.numberOfStocks; i++) {
      const { symbol, price } = data.symbolsList[i];
      const node = document.createElement("a");
      node.classList = "liveTicker";
      node.href = `./Company/company.html?symbol=${symbol}`;
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

  fetchImages(data) {
    let urls = [];
    urls.push(
      `https://financialmodelingprep.com/api/v3/company/profile/${info.symbol}`
    );

    Promise.all(urls.map(url => fetch(url).then(resp => resp.json()))).then(
      data => {
        console.log(data);
      }
    );
  }
}
