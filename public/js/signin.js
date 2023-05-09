// Clear the log in input
document.getElementById("cancel-button").addEventListener("click", clearLoginSelections);

function clearLoginSelections() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  for (var i = 0; i < inputBoxes.length; i++) {
    inputBoxes[i].value = "";
  }
}


// Sign the user in (check credentials and so on)
document.getElementById("signin-button").addEventListener("click", signUserIn);

async function signUserIn() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  var params = {
    email: inputBoxes[0].value,
    password: inputBoxes[1].value
  }

  // Check the email and password combo
  var data;
  await $.post("/user/checkLoginCredentials", params, function(res) {
    data = res;
  });

  if (data === false) {
    var incorrectText = document.getElementById("incorrect-login-text");
    incorrectText.innerHTML = "The email or password is incorrect."

  } else {
    // Sign the user in
    var incorrectText = document.getElementById("incorrect-login-text");
    incorrectText.innerHTML = "&nbsp;";

    loggedIn = true;
    await updateLoggedInState(loggedIn);

    pageReload("signin");
  }
}
