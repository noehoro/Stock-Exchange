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
    event.preventDefault();
    button.click();
  }
});

//if the search is clicked, go back to the original website
function buttonClicked(){
    let searchInput = document.getElementById("search");
    let input = searchInput.value;
    location.href=`../index.html?query=${input}`;
}

//This happens when the page is loaded
window.onload = function() {
  document
    .getElementById("main")
    .classList.add("animation-main");
};
