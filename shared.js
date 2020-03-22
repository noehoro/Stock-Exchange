//common Script

//get the params from url
function getParams(pram) {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(pram);
}

//show element
function show(tag) {
    document.getElementById(tag).classList.remove("hide");
  }
  
  //hide element
  function hide(tag) {
    document.getElementById(tag).classList.add("hide");
  }

  //See if the price change is positive or negative and set the color accordingly
function setPriceChangeColor(percent, id) {
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