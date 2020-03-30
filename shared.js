//common Script
class Shared {
  //get the params from url
  getParams(pram) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(pram);
  }

  //show element
  show(tag) {
    document.getElementById(tag).classList.remove("hide");
  }

  //hide element
  hide(tag) {
    document.getElementById(tag).classList.add("hide");
  }

  //See if the price change is positive or negative and set the color accordingly
  setPriceChangeColor(percent, id) {
    let priceChangeTag = document.getElementById(id);
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

  addState(query) {
    window.history.pushState("", "", `./?query=${query}`);
  }
}
