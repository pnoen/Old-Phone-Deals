$("#navBarSearchBtn").click(function (e) {
	var searchTerm = $("#navBarSearchBar input").val();
	var brand;
	var maxPrice;

	if (state == "search") {
		brand = $("#searchBrandFilter :selected").val();
		maxPrice = $("#searchPriceFilter").val();
	}
	changeToSearchState(searchTerm, brand, maxPrice)
})

function changeToSearchState(searchTerm, brand, maxPrice) {
	emptyContainer("#mainContent");
	
	// creates the filters in navbar
	createSearchContainers(brand, maxPrice);
	updateSearchbarValue(searchTerm);

	let searchedConditions = { // last searched
        searchTerm: searchTerm,
		brand: brand,
		maxPrice: maxPrice
    }
	updateMainState("search", searchedConditions);

	// Creates the container with the searched for product
	$("#mainContent").append(createPhoneListingContainer("Searched Phones", "searchedContainer"));
	searchPhones(searchTerm, brand, maxPrice);

}

function updateSearchbarValue(value) {
	if (value) {
		$("#searchBar").val(value);
	}
}

async function createSearchContainers(brand, priceValue) {
	if ($("#navBarSearchStateItems").html().length == 0) { // no child elements
		let data;
		await $.getJSON("/getHighestPrice", null, function (res) {
			data = res;
		});
		let maxPrice = Math.ceil(data[0].price); // rounds up to remove decimals

		let element = `
		<div id="searchBrandFilterContainer">
			<select id="searchBrandFilter">
			</select>
		</div>

		<div id="searchPriceFilterContainer">
			$0
			<input id="searchPriceFilter" type="range" min="0" max="${maxPrice}" value="${maxPrice}">
			<span id="searchPriceFilterValue">$${maxPrice}</span>
		</div>
		`
		$("#navBarSearchStateItems").append(element);
		$("#searchPriceFilter").on("input", function () { // updates the text on the right of the slider
			$("#searchPriceFilterValue").html("$" + $("#searchPriceFilter").val());
		})

		await createFilterOptions();
	}
	// if there were previous conditions
	if (priceValue) {
		$("#searchPriceFilterValue").html("$" + priceValue);
		$("#searchPriceFilter").val(priceValue);
	}
	if (brand) {
		let options = document.getElementById("searchBrandFilter").options;
		for (let i = 0; i < options.length; i++) {
			if (options[i].value == brand) {
				$("#searchBrandFilter").val(brand).change();
				break;
			}
		}
	}
}

async function createFilterOptions() {
	let data;
	await $.getJSON("/getBrandsList", null, function (res) {
		data = res;
	});

	var filterBox = document.getElementById("searchBrandFilter");
	if (filterBox !== null) {
		filterBox.options.length = 0;
		let allOption = "<option></option>"; // for all brands
		$("#searchBrandFilter").append(allOption);
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
