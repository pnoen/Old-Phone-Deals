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


// Verifies an email as being valid (characters only)
function verifyEmail(email) {
  var hasAt = email.includes('@');
  if (hasAt === false) {
    return false;
  }

  emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return false;
  }

  if (emailParts[0] === "" || emailParts[1] === "") {
    return false;
  }

  var hasDot = emailParts[1].includes('.');
  if (hasDot === false) {
    return false;
  }

  emailParts = emailParts[1].split('.');
  if (emailParts.length < 2) {
    return false;
  }

  if (emailParts[0] === "" || emailParts[1] === "") {
    return false;
  }

  return true;
}


// Validates a password
function validatePassword(password) {
  if (password.length < 8) {
    return "Password is too short.";
  }

  var requirements = [false, false, false, false];
  for (var i = 0; i < password.length; i++) {
    if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
      requirements[0] = true;
    } else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
      requirements[1] = true;
    } else if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
      requirements[2] = true;
    } else {
      requirements[3] = true;
    }
  }

  for (var i = 0; i < requirements.length; i++) {
    if (requirements[i] === false) {
      return "Password must contain a capital, lowercase, number and punctuation.";
    }
  }

  return "valid";
}


// Checks if an email has been verified
async function checkEmailVerified(email) {
  let data;
  let params = {
    email: email
  }
  await $.getJSON("/user/checkEmailVerified", params, function(res) {
    data = res;
  });
  if (data[0].isvalid === "") {
    return true;
  }

  return false;
}
