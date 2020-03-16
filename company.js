

var urlParams = new URLSearchParams(window.location.search);
let ticker = urlParams.get("symbol");

document.getElementById("title").innerText = ticker;
