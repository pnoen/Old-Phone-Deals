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


// The initial page tasks
async function initialProfileLoad() {
  // Prefill the data
  var data = await getCurrentUser();
  var table = document.getElementById("profile-info-table");
  table.rows[0].innerHTML += "<td>" + data[0].firstname + "</td>";
  table.rows[1].innerHTML += "<td>" + data[0].lastname + "</td>";
  table.rows[2].innerHTML += "<td>" + data[0].email + "</td>";


  var editProfileBtn = document.getElementById("edit-profile-btn");
  editProfileBtn.addEventListener("click", editProfile);
}

initialProfileLoad();


// Allows the user to edit their profile
function editProfile() {
  toggleEditButton();
  toggleInputFields();
}


// Saves the profile information entered by the user
async function saveProfile() {
  toggleEditButton();
  toggleInputFields();

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


// Toggles between the edit and save profile buttons
function toggleEditButton() {
  var editProfileBtn = document.getElementById("edit-profile-btn");

  if (editProfileBtn.innerHTML === "Edit Profile") {
    editProfileBtn.removeEventListener("click", editProfile);
    editProfileBtn.addEventListener("click", saveProfile);
    editProfileBtn.innerHTML = "Update Profile";

  } else if (editProfileBtn.innerHTML === "Update Profile") {
    editProfileBtn.removeEventListener("click", saveProfile);
    editProfileBtn.addEventListener("click", editProfile);
    editProfileBtn.innerHTML = "Edit Profile";
  }

}
