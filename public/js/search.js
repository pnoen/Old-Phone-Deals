document.getElementById("navBarSearchBtn").addEventListener("click", changeToSearchState);

function changeToSearchState(event) {
  var searchTerm = document.getElementById("navBarSearchBar")
                           .querySelector("input").value;

  emptyContainer("#mainContent");
  updateMainState("search");
  createHomeContainers();
  getSoldSoonSearch(searchTerm);
  getBestSellerSearch(searchTerm);
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
