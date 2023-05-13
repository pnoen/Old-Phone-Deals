buttons = [document.getElementById("edit-profile-btn"),
  document.getElementById("change-password-btn")];

tables = [document.getElementById("profile-info-table"),
  document.getElementById("change-password-table")];


// Outputs an error message
function outputMessage(text, colour) {
  document.querySelector("#top-message-text").innerHTML = text;
  document.querySelector("#top-message-text").style.color = colour;
}


// Load the initial user data
async function getCurrentUser() {
  let data;
  let params = {
    id: currentUser
  }
  await $.getJSON("/user/getUserData", params, function(res) {
    data = res;
  });

  return data;
}


// Creates confirm / back buttons
function createConfirmBackBtns(btnId, text) {
  var buttonSect = document.querySelector(".profile-buttons");
  buttonSect.innerHTML = "";

  buttonSect.innerHTML = `
    <button id="cancel-button">Cancel</button>
    <button id="` + btnId + `">` + text + `</button>
  `

  var cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", goBackToProfile);
}


// Goes back to the initial profile page
function goBackToProfile() {
  setUpPage("profile-info-table");
}


// Brings the original buttons back
function bringOgBtnsBack() {
  var profileBtnSect = document.querySelector(".profile-buttons");
  profileBtnSect.innerHTML = "";

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.visibility = "visible";
    profileBtnSect.appendChild(buttons[i]);
  }
}


// Sets up the page
function setUpPage(tableId) {
  bringOgBtnsBack();

  if (tableId === "profile-info-table") {
    profileTableText();
  }

  for (var i = 0; i < tables.length; i++) {
    if (tables[i].id !== tableId) {
      tables[i].style.visibility = "hidden";
    } else {
      tables[i].style.visibility = "visible";
    }
  }
}


// The initial page tasks
async function initialProfileLoad() {

  // Prefill the data
  var data = await getCurrentUser();
  var table = document.getElementById("profile-info-table");
  table.rows[0].innerHTML += "<td>" + data[0].firstname + "</td>";
  table.rows[1].innerHTML += "<td>" + data[0].lastname + "</td>";
  table.rows[2].innerHTML += "<td>" + data[0].email + "</td>";

  setUpPage("profile-info-table");

  var editProfileBtn = document.getElementById("edit-profile-btn");
  editProfileBtn.addEventListener("click", editProfile);

  var changePasswordBtn = document.getElementById("change-password-btn");
  changePasswordBtn.addEventListener("click", changePasswordPage);
}

initialProfileLoad();


// Allows the user to edit their profile
function editProfile() {
  setUpPage("profile-info-table");
  outputMessage("&nbsp;", "");
  createConfirmBackBtns("save-profile-btn", "Update Profile");
  var saveProfileBtn = document.getElementById("save-profile-btn");
  saveProfileBtn.addEventListener("click", saveProfile);

  toggleInputFields();
}


// Saves the profile information entered by the user
async function saveProfile() {
  toggleInputFields();
  bringOgBtnsBack();

  // TODO: Enter correct password first
  // TODO: Verification

  var table = document.getElementById("profile-info-table");
  var params = {
    id: currentUser,
    firstname: table.rows[0].querySelectorAll("td")[1].innerHTML,
    lastname: table.rows[1].querySelectorAll("td")[1].innerHTML,
    email: table.rows[2].querySelectorAll("td")[1].innerHTML
  }

  // Update the user profile
  var data;
  await $.post("/user/updateProfile", params, function(res) {
    data = res;
  });
}


// Toggles between input and text
function toggleInputFields() {
  var table = document.getElementById("profile-info-table");

  for (var i = 0; i < table.rows.length; i++) {
    var cell = table.rows[i].querySelectorAll("td")[1];
    if (cell.querySelector("input") !== null) {
      // Change to text
      cell.innerHTML = cell.querySelector("input").value;
    } else {
      // Change to input
      cell.innerHTML = "<input type='text' value='" + cell.innerHTML + "' />";
    }
  }
}


// Create profile table text
function profileTableText() {
  var table = document.getElementById("profile-info-table");

  for (var i = 0; i < table.rows.length; i++) {
    var cell = table.rows[i].querySelectorAll("td")[1];
    if (cell.querySelector("input") !== null) {
      // Change to text
      cell.innerHTML = cell.querySelector("input").value;
    }
  }
}


// Opens the change password page
function changePasswordPage() {
  setUpPage("change-password-table");
  outputMessage("&nbsp;", "");
  createConfirmBackBtns("save-password-btn", "Update Password");

  var savePasswordBtn = document.getElementById("save-password-btn");
  savePasswordBtn.addEventListener("click", savePassword);
}


// Saves the user's password
async function savePassword() {
  var table = document.getElementById("change-password-table");

  // Check the old password is correct
  var currentPassword = table.rows[0].querySelectorAll("td")[1].querySelector("input").value;
  var passCorrect = await checkPasswordId(currentPassword);

  if (passCorrect === true) {
    var newPassword = table.rows[1].querySelectorAll("td")[1].querySelector("input").value;
    await changePassword(newPassword);
    outputMessage("Your password has been changed", "green");
    setUpPage("profile-info-table");

  } else {
    outputMessage("Your original password was incorrect", "indianred");
  }
}


// Checks the current password is correct
async function checkPasswordId(currentPassword) {
  var params = {
    id: currentUser,
    password: currentPassword
  }

  var data;
  await $.post("/user/checkPasswordById", params, function(res) {
    data = res;
  });

  if (data === false) {
    return false;
  } else {
    return true;
  }
}


// Changes the user's password to the new one
async function changePassword(newPassword) {
  var params = {
    id: currentUser,
    password: newPassword
  }

  var data;
  await $.post("/user/changePasswordById", params, function(res) {
    data = res;
  });
}
