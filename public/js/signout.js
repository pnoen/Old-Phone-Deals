// Brings up the modal to sign the user out
var signOutBtn = document.getElementById("sign-out-button");
if (signOutBtn !== null) {
  signOutBtn.addEventListener("click", signOutModal);
}

function signOutModal() {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="sign-out-modal">
    <h1>Confirm Sign Out</h1>
    <p>Are you sure you want to sign out?</p>

    <div class="login-buttons">
      <button onclick="closeModal();">Cancel</button>
      <button onclick="signOutUser();">Sign Out</button>
    </div>
  </div>
  `);
  // document.body.innerHTML += (`
  // <div class="sign-out-modal">
  //   <h1>Confirm Sign Out</h1>
  //   <p>Are you sure you want to sign out?</p>

  //   <div class="login-buttons">
  //     <button onclick="closeModal();">Cancel</button>
  //     <button onclick="signOutUser();">Sign Out</button>
  //   </div>
  // </div>
  // `);
}


// Closes the modal
function closeModal() {
  var modal = document.querySelector(".sign-out-modal");
  modal.remove();
  document.getElementById("sign-out-button").addEventListener("click", signOutModal);
}


// Signs out the user
async function signOutUser() {
  loggedIn = false;
  await updateLoggedInState(loggedIn);
  closeModal();
  pageReload("signout");
}
