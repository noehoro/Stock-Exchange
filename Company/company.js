//Receive pram
var urlParams = new URLSearchParams(window.location.search);
let ticker = urlParams.get("symbol");

//set title
document.getElementById("title").innerText = ticker;

let button = document.getElementById("button");
let searchInput = document.getElementById("search");
button.addEventListener("click", buttonClicked);
searchInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    button.click();
  }
});
