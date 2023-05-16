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


// Appends an error message
function outputError(errorMessage, colour) {
  var incorrectText = document.getElementById("incorrect-login-text");
  incorrectText.innerHTML = errorMessage;
  incorrectText.style.color = colour;
}


// Clear the log in input on cancel
// document.getElementById("cancel-button").addEventListener("click", clearLoginSelections);
function clearLoginSelections() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  for (var i = 0; i < inputBoxes.length; i++) {
    inputBoxes[i].value = "";
  }
}


/*
 * FORGOT PASSWORD
*/
// Displays the forgot password form
function displayForgotPassword() {
  loginOrRegister = "register";

  document.querySelector(".phoneListingHeading").innerHTML = "Forgot Password";
  document.querySelector(".login-box").innerHTML = `
    <p id="incorrect-login-text">&nbsp;</p>
    <div class="login-input-field">
      Email:
      <input type="text" value="" />
    </div>

    <div class="login-buttons">
      <button id="cancel-button">Clear</button>
      <button id="password-button">Change Password</button>
    </div>

    <p>Click here to return to sign in: <a class="toggle-login-btn">Sign in</a></p>
  `;

  initialPageLoad();
}


async function changePassword() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  var email = inputBoxes[0].value;

  var emailInUse = await checkEmailInUse(email);
  if (emailInUse === true) {
    outputError("This email does not exist.", "indianred");
    return false;
  }

  // Check email is verified
  var verified = await checkEmailVerified(email);
  if (verified === false) {
    outputError("The email has not been verified.", "indianred");
    return false;
  }

  // TODO: Send change password email

  // TODO: Change the password, could use "changePasswordByEmail"

  outputError("A reset password email has been sent.", "lightseagreen");
}


/*
 * LOGIN
*/
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
      <button id="cancel-button">Clear</button>
      <button id="signin-button">Sign In</button>
    </div>

    <p>Click <a class="reset-password-btn">here</a> to reset your password.</p>
    <p>Don't have an account yet? <a class="toggle-login-btn">Sign up</a></p>
  `;

  initialPageLoad();
}


// Sign the user in (check credentials and so on)
async function signUserIn() {
  var inputBoxes = document.querySelector(".login-box").querySelectorAll("input");
  var params = {
    email: inputBoxes[0].value,
    password: inputBoxes[1].value
  }

  var emailInUse = await checkEmailInUse(params.email);
  if (emailInUse === true) {
    outputError("This email does not exist.", "indianred");
    return false;
  }

  // Check the email is verified, if not then DO NOT log in (return false)
  var verified = await checkEmailVerified(params.email);
  if (verified === false) {
    outputError("The email has not been verified.", "indianred");
    return false;
  }

  // Check the email and password combo
  var data;
  await $.post("/user/checkLoginCredentials", params, function(res) {
    data = res;
  });

  if (data === false) {
    outputError("The email or password is incorrect.", "indianred");

  } else {
    // Sign the user in
    outputError("&nbsp;", "indianred");
    loggedIn = true;
    await updateLoggedInState(loggedIn);
    await getCurrentUser(params.email);
    pageReload("signin");
  }
}


// Changes the user id state to be the user who is logged in
async function getCurrentUser(email) {
  let data;
  let params = {
    email: email
  }
  await $.getJSON("/user/getCurrentUser", params, function(res) {
    data = res;
  });
}


/*
 * REGISTER
*/
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
      <button id="cancel-button">Clear</button>
      <button id="signup-button">Sign Up</button>
    </div>

    <p>Already have an account? <a class="toggle-login-btn">Sign in</a></p>
  `;

  initialPageLoad();
}


// Checks whether the email is already in use
async function checkEmailInUse(email) {
  let data;
  let params = {
    email: email
  }
  await $.getJSON("/user/checkEmailInUse", params, function(res) {
    data = res;
  });

  return data;
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

  var validated = validateInput(params);
  if (validated === false) {
    return false;
  }

  var emailInUse = await checkEmailInUse(params.email); 
  console.log(emailInUse);
  if (emailInUse === false) { 
    outputError("This email already exist.", "indianred");
    return false;
  }

  await $.post("/user/registerNewUser", params);
  outputError("Successfully registered. A verification email has been sent.", "lightseagreen");

  await $.get("/user/sendVerification", {email: inputBoxes[2].value});
}


// Validates the input for creating an account
function validateInput(params) {
  if (params.firstname === "" || params.lastname === ""
      || params.email === "" || params.password === "") {
    outputError("All fields are mandatory.", "indianred");
    return false;
  }

  // Checks email entry is valid
  var emailValid = verifyEmail(params.email);
  if (emailValid === false) {
    outputError("Invalid email.", "indianred");
    return false;
  }

  // Checks the email is not already in use
  var emailInUse = checkEmailInUse(params.email);
  if (emailInUse === false) {
    outputError("Email already in use.", "indianred");
    return false;
  }

  // Checks the password is valid
  var passwordValid = validatePassword(params.password);
  if (passwordValid !== "valid") {
    outputError(passwordValid, "indianred");
    return false;
  }

  return true;
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

  var changePassBtn = document.getElementById("password-button");
  if (changePassBtn !== null) {
    changePassBtn.addEventListener("click", changePassword);
  }

  var toggleBtn = document.querySelector(".toggle-login-btn");
  if (toggleBtn !== null) {
    toggleBtn.addEventListener("click", loginSignupSwitch);
  }

  var resetPassBtn = document.querySelector(".reset-password-btn");
  if (resetPassBtn !== null) {
    resetPassBtn.addEventListener("click", displayForgotPassword);
  }

  var clearBtn = document.getElementById("cancel-button");
  if (clearBtn !== null) {
    clearBtn.addEventListener("click", clearLoginSelections);
  }
}


initialPageLoad();
