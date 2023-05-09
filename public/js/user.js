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
  var data = await getCurrentUser();

  var profileFields = document.querySelectorAll(".profile-field");
  profileFields[0].innerHTML += data[0].firstname;
  profileFields[1].innerHTML += data[0].lastname;
  profileFields[2].innerHTML += data[0].email;
}

initialProfileLoad();
