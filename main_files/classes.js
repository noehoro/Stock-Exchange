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

// class searchBar {
//   constructor(searchInputId,buttonId) {
//     this.searchInput = document.getElementById(searchInputId);
//     this.button = document.getElementById(buttonId);
//   }

//   // Run at the beginning of the program, if the query ticker is empty then it runs it
//   // checkTicker() {
//   //   let ticker = getParams("query");
//   //   let searchInput = getSearchInput();
//   //   if (ticker) {
//   //     searchInput.value = ticker;
//   //     buttonClicked();
//   //   } else {
//   //     return;
//   //   }
//   // }

//   // //searchbar Animation
//   // searchBarAnimation() {
//   //   document
//   //     .getElementById("search-bar-container")
//   //     .classList.add("animation-show-search-bar");
//   // }

//   // //Do this when the button is clicked
//   // buttonClicked() {
//   //   let results = document.getElementById("results-container");
//   //   results.classList.remove("animation-hide");
//   //   results.classList.add("animation-show-results");
//   //   hide("results");
//   //   show("spinner");
//   //   //Go and fetch the results
//   //   fetchResults();
//   // }

//   buttonConfig() {
//     //when button is clicked
//     this.button.addEventListener("click", buttonClicked);
//     //When Enter is pressed
//     this.searchInput.addEventListener("keyup", function(event) {
//       let results = document.getElementById("results-container");
//       if (event.keyCode === 13) {
//         event.preventDefault();
//         buttonClicked();
//       } else if (this.value.length >= 1) {
//         buttonClicked();
//       } else if (this.value.length === 0) {
//         addState("");
//         results.classList.remove("animation-show-results");
//         results.classList.add("animation-hide");
//       }
//     });
//   }
// }
