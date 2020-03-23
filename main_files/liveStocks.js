class liveStocks {
  constructor(id, numberOfStocks) {
    this.id = id;
    this.numberOfStocks = numberOfStocks;
    this.link = "https://financialmodelingprep.com/api/v3/company/stock/list";
    this.container = document.getElementById(this.id);
    this.container.innerHTML = "";
  }
  //gets and sets the live stocks
  render() {
    //how many of the stocks from the list do you want to display?
    fetch(this.link)
      .then(response => {
        return response.json();
      })
      .then(data => {
        for (let i = 0; i < this.numberOfStocks; i++) {
          this.addStock(data.symbolsList[i]);
        }
      });
  }
  addStock(data) {
    let { symbol, price } = data;
    let node = document.createElement("a");
    node.classList = "liveTicker";
    node.href = `./Company/company.html?symbol=${symbol}`;
    let symbolSpan = document.createTextNode(`${symbol}: `);
    let priceSpan = document.createElement("span");
    let priceText = document.createTextNode(price);
    priceSpan.appendChild(priceText);
    priceSpan.classList = "text-success";
    node.appendChild(symbolSpan);
    node.appendChild(priceSpan);
    this.container.appendChild(node);
  }
}
