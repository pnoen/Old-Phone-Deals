document.getElementById("navBarSearchBtn").addEventListener("click", changeToSearchState);

function changeToSearchState() {
	var searchTerm = $("#navBarSearchBar input").val();
	var brand;
	var maxPrice;

	if (state == "search") {
		brand = $("#searchBrandFilter :selected").val();
		maxPrice = $("#searchPriceFilter").val();
	}

	emptyContainer("#mainContent");
	updateMainState("search");

	// Creates the containers with the searched for product
	$("#mainContent").append(createPhoneListingContainer("Searched Phones", "searchedContainer"));
	searchPhones(searchTerm, brand, maxPrice);

	// Adds options to the filter
	createFilterOptions();
}

// TODO add the dropdodwn when search state and add an empty option
async function createFilterOptions() {
	let data;
	await $.getJSON("/getBrandsList", null, function (res) {
		data = res;
	});

	var filterBox = document.getElementById("searchBrandFilter");
	if (filterBox !== null) {
		filterBox.options.length = 0;
		for (var i = 0; i < data.length; i++) {
			var newOption = document.createElement("option");
			newOption.value = newOption.innerHTML = data[i];
			filterBox.appendChild(newOption);
		}
	}
}

async function searchPhones(searchTerm, brand, maxPrice) {
	let data;
	let params = {
        searchTerm: searchTerm,
		brand: brand,
		maxPrice: maxPrice
    }

	await $.getJSON("/getPhones", params, function (res) {
		data = res;
	});

	data.forEach(function (phone) {
		$("#searchedContainer").append(createPhoneElement(phone));
		$("#searchedContainer div:last button").click(function (e) {
			changeToItemState(phone.title, phone.seller);
		});
	});
}
