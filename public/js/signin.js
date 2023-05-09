// Appends an error message
function outputError(errorMessage) {
  var incorrectText = document.getElementById("incorrect-login-text");
  incorrectText.innerHTML = errorMessage;
}


// Clear the log in input on cancel
document.getElementById("cancel-button").addEventListener("click", clearLoginSelections);
function clearLoginSelections() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  for (var i = 0; i < inputBoxes.length; i++) {
    inputBoxes[i].value = "";
  }
}


// Sign the user in (check credentials and so on)
var signInBtn = document.getElementById("signin-button");
if (signInBtn !== null) {
  signInBtn.addEventListener("click", signUserIn);
}

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
    outputError("The email or password is incorrect.");

  } else {
    // Sign the user in
    outputError("&nbsp;");
    loggedIn = true;
    await updateLoggedInState(loggedIn);
    pageReload("signin");
  }
}


// Switch between logging in a signing up
var toggleBtns = document.querySelectorAll(".toggle-login-btn");
for (var i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", loginSignupSwitch);
}

async function loginSignupSwitch() {
  let data;
  await $.post("/user/toggleLoginRegister", null);
  window.location.reload();
}


// Registers the new user
var signUpBtn = document.getElementById("signup-button");
if (signUpBtn !== null) {
  signUpBtn.addEventListener("click", signUpUser);
}

async function signUpUser() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  var params = {
    firstname: inputBoxes[0].value,
    lastname: inputBoxes[1].value,
    email: inputBoxes[2].value,
    password: inputBoxes[3].value
  }

  validateInput(params);
  // TODO: Post to backend
}

// Validates the input for creating an account
function validateInput(params) {
  if (params.firstname === "" || params.lastname === ""
      || params.email === "" || params.password === "") {
    outputError("All fields are mandatory.");
    return;
  }

  // TODO: Email regex
}
