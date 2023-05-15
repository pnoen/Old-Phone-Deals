buttons = [document.getElementById("edit-profile-btn"),
  document.getElementById("change-password-btn"),
  document.getElementById("manage-listings-btn"),
  document.getElementById("view-comments-btn"),
  document.getElementById("sign-out-btn")
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


// Signs out the user
async function signOutGoHome() {
  loggedIn = false;
  await updateLoggedInState(loggedIn);
  pageReload("signout");
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

  if (text !== "") {
    buttonSect.innerHTML = `
      <button id="cancel-button">Back</button>
      <button id="` + btnId + `">` + text + `</button>
    `;
  } else {
    buttonSect.innerHTML = `
      <button id="cancel-button">Back</button>
    `;
  }

  var cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", goBackToProfile);
}


/*
 * PROFILE
*/
// Goes back to the initial profile page
function goBackToProfile() {
  document.querySelector(".comments-box").innerHTML = "";

  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "Profile";

  document.querySelector(".comments-box").style.visibility = "hidden";
  document.querySelector(".profile-box").style.visibility = "visible";

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
  viewCommentsBtn.addEventListener("click", viewCommentsPage);

  var signOutBtn = document.getElementById("sign-out-btn");
  signOutBtn.addEventListener("click", signOutGoHome);
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
  for (var i = 0; i < table.rows.length-1; i++) {
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
      image: document.querySelector("#image-dropdown").value,
      stock: table.rows[2].querySelectorAll("td")[1].querySelector("input").value,
      seller: currentUser,
      price: table.rows[3].querySelectorAll("td")[1].querySelector("input").value
    }

    await $.post("/addNewListing", params);
    outputMessage("Your listing has been added.", "lightseagreen");

    // TODO: Return new id and add to params

    document.getElementById("my-listings").innerHTML = `
      <h1 class="phoneListingHeading">My Listings</h1>
    `;
    displayListings();
  }
}


// Adds event listeners to the listing buttons
function makeListingButtons() {
  var enableBtns = document.querySelectorAll(".Enable-listing-btn");
  var disableBtns = document.querySelectorAll(".Disable-listing-btn");
  var removeBtns = document.querySelectorAll(".remove-listing-btn");

  for (var i = 0; i < enableBtns.length; i++) {
    enableBtns[i].addEventListener("click", enableListing);
  }
  for (var i = 0; i < disableBtns.length; i++) {
    disableBtns[i].addEventListener("click", disableListing);
  }
  for (var i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener("click", removeListing);
  }
}


// Gets the listings and displays them
async function displayListings() {
  var data = await getListingsByUser();
  for (var i = 0; i < data.length; i++) {
    displaySingleListing("#my-listings", data[i], true);
  }

  makeListingButtons();
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
function displaySingleListing(container, listing, showBtns) {
  var listings = document.querySelector(container);

  var enabledDisabled = "Disable";
  if (listing.disabled !== undefined) {
    enabledDisabled = "Enable"
  }

  var buttons = "";
  if (showBtns === true) {
    buttons = `
    <div class='listing-btn-group'>
      <button class='` + enabledDisabled + `-listing-btn'>` + enabledDisabled + `</button>
      <button class='remove-listing-btn'>Remove</button>
    </div>
    `;
  }

  listings.innerHTML += (`
    <div class='single-listing' id=` + listing._id + `>
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
      ` + buttons + `
    </div>
    `);
}


// Enables a listing
async function enableListing(event) {
  var id = event.target.parentElement.parentElement.id;

  let data;
  let params = {
    id: id
  }
  await $.post("/enableListing", params, function(res) {
    data = res;
  });

  event.target.class = "Disable-listing-button";
  event.target.innerHTML = "Disable";
  event.target.removeEventListener("click", enableListing);
  event.target.addEventListener("click", disableListing);
}


// Disables a listing
async function disableListing(event) {
  var id = event.target.parentElement.parentElement.id;

  let data;
  let params = {
    id: id
  }
  await $.post("/disableListing", params, function(res) {
    data = res;
  });

  event.target.class = "Enable-listing-button";
  event.target.innerHTML = "Enable";
  event.target.removeEventListener("click", disableListing);
  event.target.addEventListener("click", enableListing);
}


// Removes a listing
async function removeListing(event) {
  var id = event.target.parentElement.parentElement.id;

  let data;
  let params = {
    id: id
  }
  await $.post("/removeListing", params, function(res) {
    data = res;
  });

  document.getElementById(id).remove();
}


/*
 * VIEW COMMENTS
*/
// Sets up the view comments page
async function viewCommentsPage() {
  var heading = document.querySelector(".phoneListingHeading");
  heading.innerHTML = "View Comments";

  setUpPage("view-comments-table");
  outputMessage("&nbsp;", "");
  var buttonSect = document.querySelector(".profile-buttons");
  buttonSect.innerHTML = "";

  await displayComments();

  var hideBtns = document.querySelectorAll(".Hide-comment-btn");
  for (var i = 0; i < hideBtns.length; i++) {
    hideBtns[i].addEventListener("click", hideComment);
  }

  var showBtns = document.querySelectorAll(".Show-comment-btn");
  for (var i = 0; i < showBtns.length; i++) {
    showBtns[i].addEventListener("click", showComment);
  }
}


// Gets the comments for this user
async function displayComments() {
  document.querySelector(".comments-box").style.visibility = "visible";
  document.querySelector(".profile-box").style.visibility = "hidden";

  var data = await getUsersComments();
  for (var i = 0; i < data.length; i++) {
    displaySingleListing(".comments-box", data[i], false);
    for (var j = 0; j < data[i].reviews.length; j++) {
      await displaySingleComment(data[i].reviews[j], j, data[i]._id);
    }
  }

  document.querySelector(".comments-box").innerHTML += `
    <button id="cancel-button">Back</button>
  `;
  var cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", goBackToProfile);
}


// Gets the comments for a particular user
async function getUsersComments() {
  let data;
  let params = {
    id: currentUser
  }
  await $.getJSON("/getUsersComments", params, function(res) {
    data = res;
  });

  return data;
}


// Displays a single comment with the buttons
async function displaySingleComment(review, index, listingId) {
  var showHide = "Hide";
  if (review.hidden !== undefined) {
    showHide = "Show";
  }

  var buttons = `
    <button class='` + showHide + `-comment-btn'>` + showHide + `</button>
  `;

  let user = await getUserById(review.reviewer);
  let rating = "★".repeat(review.rating);
  let ratingEmpty = "★".repeat(5 - review.rating);
  let element = `<div class="item-review" id=`+ listingId + `-` + index +`>
    <div class="itemReviewTop">
      <p>
        ${user.firstname} ${user.lastname}
      </p>
      <div class="ratingStars">
        <span class="itemReviewRating">${rating}</span>
        <span class="itemReviewRatingEmpty">${ratingEmpty}</span>
      </div>
    </div>
    <p class="itemReviewComment">${review.comment}</p>
    ` + buttons + `
  </div>
  `;

  document.querySelector(".comments-box").innerHTML += element;
}


// Hides a comment
async function hideComment(event) {
  var paramsString = event.target.parentElement.id;
  var paramsArray = paramsString.split("-");

  let data;
  let params = {
    id: paramsArray[0],
    index: paramsArray[1]
  }
  await $.post("/hideComment", params, function(res) {
    data = res;
  });

  event.target.class = "Show-comment-btn";
  event.target.innerHTML = "Show";
  event.target.removeEventListener("click", hideComment);
  event.target.addEventListener("click", showComment);
}


// Shows a comment
async function showComment(event) {
  var paramsString = event.target.parentElement.id;
  var paramsArray = paramsString.split("-");

  let data;
  let params = {
    id: paramsArray[0],
    index: paramsArray[1]
  }
  await $.post("/showComment", params, function(res) {
    data = res;
  });

  event.target.class = "Hide-comment-btn";
  event.target.innerHTML = "Hide";
  event.target.removeEventListener("click", showComment);
  event.target.addEventListener("click", hideComment);
}
