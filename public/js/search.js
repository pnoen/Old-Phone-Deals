document.getElementById("navBarSearchBtn").addEventListener("click", changeToSearchState);

function changeToSearchState(event) {
  var searchTerm = document.getElementById("navBarSearchBar")
                           .querySelector("input").value;

  emptyContainer("#mainContent");
  updateMainState("search");

  // Creates the containers with the searched for product
  createHomeContainers();
  getSoldSoonSearch(searchTerm);
  getBestSellerSearch(searchTerm);

  // Adds options to the filter
  createFilterOptions();
}

async function createFilterOptions() {
  let data;
  await $.getJSON("/getBrandsList", null, function(res) {
    data = res;
  });

  var filterBox = document.getElementById("searchBrandFilter");
  if (filterBox !== null) {
    filterBox.options.length = 0;
    for (var i = 0; i < data.length; i++) {
      var newOption = document.createElement('option');
      newOption.value = newOption.innerHTML = data[i];
      filterBox.appendChild(newOption);
    }
  }
}

async function getSoldSoonSearch(searchTerm) {
  let data;
  await $.getJSON("/getSoldSoon", null, function(res) {
    data = res;
  });

  data.forEach(function(phone) {
    if (phone.title.toUpperCase()
                   .includes(searchTerm.toUpperCase())) {
      $("#soldSoonContainer").append(createPhoneElement(phone));
      $("#soldSoonContainer div:last button").click(function (e) {
        changeToItemState(phone.title, phone.seller);
      });
    }
  });
}

async function getBestSellerSearch(searchTerm) {
  let data;
  await $.getJSON("/getBestSeller", null, function (res) {
    data = res;
  });

  data.forEach(function (phone) {
    if (phone.title.toUpperCase()
                   .includes(searchTerm.toUpperCase())) {
      $("#bestSellerContainer").append(createPhoneElement(phone));
      $("#bestSellerContainer div:last button").click(function (e) {
        changeToItemState(phone.title, phone.seller);
      });
    }
  });
}

var test = "Test";
