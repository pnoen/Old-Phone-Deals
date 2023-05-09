// We start as login, but can toggle to register
var loginOrRegister = "login";
async function loginSignupSwitch() {
  if (loginOrRegister === "login") {
    loginOrRegister = "register";
    displayRegisterForm();

  } else if (loginOrRegister === "register") {
    loginOrRegister = "login";
    displayLoginForm();
  }
}


// Displays the login form
function displayLoginForm() {
  document.querySelector(".phoneListingHeading").innerHTML = "Sign In";
  document.querySelector(".login-box").innerHTML = `
    <p id="incorrect-login-text">&nbsp;</p>
    <div class="login-input-field">
      Email:
      <input type="text" value="" />
    </div>
    <div class="login-input-field">
      Password:
      <input type="password" value="" />
    </div>

    <div class="login-buttons">
      <button id="cancel-button">Cancel</button>
      <button id="signin-button">Sign In</button>
    </div>

    <p>Click <a>here</a> to reset your password.</p>
    <p>Don't have an account yet? <a class="toggle-login-btn">Sign up</a></p>
  `;

  initialPageLoad();
}


// Displays the register form
function displayRegisterForm() {
  document.querySelector(".phoneListingHeading").innerHTML = "Sign Up";
  document.querySelector(".login-box").innerHTML = `
    <p id="incorrect-login-text">&nbsp;</p>
    <div class="login-input-field">
      First name:
      <input type="text" value="" />
    </div>
    <div class="login-input-field">
      Last name:
      <input type="text" value="" />
    </div>
    <div class="login-input-field">
      Email:
      <input type="text" value="" />
    </div>
    <div class="login-input-field">
      Password:
      <input type="password" value="" />
    </div>

    <div class="login-buttons">
      <button id="cancel-button">Cancel</button>
      <button id="signup-button">Sign Up</button>
    </div>

    <p>Already have an account? <a class="toggle-login-btn">Sign in</a></p>
  `;

  initialPageLoad();
}


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


// Registers the new user
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


// Initial page load
function initialPageLoad() {
  var signInBtn = document.getElementById("signin-button");
  if (signInBtn !== null) {
    signInBtn.addEventListener("click", signUserIn);
  }

  var signUpBtn = document.getElementById("signup-button");
  if (signUpBtn !== null) {
    signUpBtn.addEventListener("click", signUpUser);
  }

  var toggleBtn = document.querySelector(".toggle-login-btn");
  toggleBtn.addEventListener("click", loginSignupSwitch);
}


initialPageLoad();
