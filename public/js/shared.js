// Updates the logged in state
async function updateLoggedInState(newState) {
  loggedIn = newState;
  let params = {
    loggedIn: newState
  }
  await $.post("/user/updateLoggedInState", params);
}
