buttons = [document.getElementById("edit-profile-btn"),
  document.getElementById("change-password-btn"),
  document.getElementById("manage-listings-btn"),
  document.getElementById("view-comments-btn")
];

tables = [document.getElementById("profile-info-table"),
  document.getElementById("change-password-table"),
  document.getElementById("manage-listings-table")
];


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
    <button id="cancel-button">Back</button>
    <button id="` + btnId + `">` + text + `</button>
  `

  var cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", goBackToProfile);
}


/*
 * PROFILE
*/
// Goes back to the initial profile page
function goBackToProfile() {
  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "Profile";
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
  if (tableId !== "manage-listings-tables") {
    document.getElementById("my-listings").innerHTML = "";
  }

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
  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "Profile";

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

  var manageListingsBtn = document.getElementById("manage-listings-btn");
  manageListingsBtn.addEventListener("click", manageListingsPage);

  var viewCommentsBtn = document.getElementById("view-comments-btn");
  //viewCommentsBtn.addEventListener("click", viewCommentsBtn);
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


/*
 * CHANGE PASSWORD
*/
// Opens the change password page
function changePasswordPage() {
  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "Change Password";

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
    outputMessage("Your password has been changed", "lightseagreen");
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


/*
 * MANAGE LISTINGS
*/
// Sets up the page for managing listings
function manageListingsPage() {
  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "Manage Listings";

  setUpPage("manage-listings-table");
  outputMessage("&nbsp;", "");
  createConfirmBackBtns("save-listing-btn", "Add Listing");

  var addListingBtn = document.getElementById("save-listing-btn");
  addListingBtn.addEventListener("click", addListing);

  document.getElementById("my-listings").innerHTML = `
    <h1 class="phoneListingHeading">My Listings</h1>
  `;
  displayListings();
}


// Adds the new listing by the user
async function addListing() {
  var table = document.getElementById("manage-listings-table");

  // TODO: Validations
  var valid = true;
  for (var i = 0; i < table.rows.length; i++) {
    if (table.rows[i].querySelectorAll("td")[1].querySelector("input").value === "") {
      valid = false;
      outputMessage("All fields are mandatory.", "indianred");
    }
  }

  if (valid === true) {
    outputMessage("&nbsp;", "");
    var params = {
      title: table.rows[0].querySelectorAll("td")[1].querySelector("input").value,
      brand: table.rows[1].querySelectorAll("td")[1].querySelector("input").value,
      image: table.rows[4].querySelectorAll("td")[1].querySelector("input").value,
      stock: table.rows[2].querySelectorAll("td")[1].querySelector("input").value,
      seller: currentUser,
      price: table.rows[3].querySelectorAll("td")[1].querySelector("input").value
    }

    await $.post("/addNewListing", params);
    outputMessage("Your listing has been added.", "lightseagreen");

    displaySingleListing(params);
  }
}


// Gets the listings and displays them
async function displayListings() {
  var data = await getListingsByUser();
  for (var i = 0; i < data.length; i++) {
    displaySingleListing(data[i]);
  }
}


// Gets the listings from the user from the backend
async function getListingsByUser() {
  let data;
  let params = {
    id: currentUser
  }
  await $.getJSON("/getListingsByUser", params, function(res) {
    data = res;
  });

  return data;
}


// Displays a single listing
function displaySingleListing(listing) {
  var listings = document.getElementById("my-listings");

  listings.innerHTML += (`
    <div class='single-listing'>
      <img src='` + listing.image + `' />
      <table>
        <tr>
          <th>
            Title
          </th>
          <th>
            Brand
          </th>
          <th>
            Price
          </th>
          <th>
            Stock
          </th>
        </tr>
        <tr>
          <td>
            ` + listing.title + `
          </td>
          <td>
            ` + listing.brand + `
          </td>
          <td>
            ` + listing.price + `
          </td>
          <td>
            ` + listing.stock + `
          </td>
        </tr>
      </table>
    </div>
    `);
}
