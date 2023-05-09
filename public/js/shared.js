// Updates the logged in state
async function updateLoggedInState(newState) {
  loggedIn = newState;
  let params = {
    loggedIn: newState
  }
  await $.post("/user/updateLoggedInState", params);
}


// Reloads the homepage with the old state
function pageReload(action) {
  updateHomeAnchor();

  if (action === "signout") {
    changeToHomeState();

  } else {
    if (state == "home") {
      changeToHomeState();
    }
    else if (state == "item") {
      changeToItemState(mainPageData.title, mainPageData.seller);
    }
    else if (state == "search") {
      changeToSearchState(mainPageData.searchTerm, mainPageData.brand, mainPageData.maxPrice);
    }
    
  }

  window.location.href = "/";
}
