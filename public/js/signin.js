// Clear the log in input
document.getElementById("cancel-button").addEventListener("click", clearLoginSelections);

function clearLoginSelections() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  for (var i = 0; i < inputBoxes.length; i++) {
    inputBoxes[i].value = "";
  }
}
