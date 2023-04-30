async function getSoldSoon() {
    let data;
    await $.getJSON("/getSoldSoon", null, function (res) {
        data = res;
    });
    
    data.forEach(function (phone) {
        $("#soldSoonContainer").append(createPhoneElement(phone));
    });
}

async function getBestSeller() {
    let data;
    await $.getJSON("/getBestSeller", null, function (res) {
        data = res;
    });
    
    data.forEach(function (phone) {
        $("#bestSellerContainer").append(createPhoneElement(phone));
        $("#bestSellerContainer div:last button").click(function (e) {
            changeToItemState(phone.title, phone.seller);
        });
    });
}

function createHomeContainers() {
    $("#mainContent").append(createPhoneListingContainer("Sold out soon", "soldSoonContainer"));
    $("#mainContent").append(createPhoneListingContainer("Best sellers", "bestSellerContainer"));
}

function createPhoneListingContainer(heading, id) {
    return `<h1 class="phoneListingHeading">${heading}</h1>
    <div id="${id}" class="phoneListingContainer">
    `
}

function createPhoneElement(phone) {
    return `<div class="phoneCard">
        <div class="phoneCardImgContainer">
            <img src="${phone.image}" class="phoneCardImg">
        </div>
        <div class="phoneCardDescContainer">
            <h3>${phone.title}</h3>
            <h4>Stock: ${phone.stock}</h4>
            <h4>$${phone.price}</h4>
            <button class="phoneCardViewBtn">View</button>
        </div>
    </div>`
}

function emptyContainer(selector) {
    $(selector).empty();
}

function changeToItemState(phoneTitle, phoneSeller) {
    emptyContainer("#mainContent");
    getPhone(phoneTitle, phoneSeller);
}

async function getPhone(title, seller) {
    let data;
    let params = {
        title: title,
        seller: seller
    }

    await $.getJSON("/getPhone", params, function (res) {
        data = res;
    });
    console.log(data);
    let element = await createItemListingElement(data[0])
    $("#mainContent").append(element);
}

async function getUserById(id) {
    let data;
    let params = {
        id: id.toString()
    }

    await $.getJSON("/user/getUserById", params, function (res) {
        data = res;
    });
    console.log(data);

    return data[0];
}

async function createItemListingElement(phone) {
    let user = await getUserById(phone.seller);

    return `<div class="itemListingContainer">
        <div class="itemImgContainer">
            <img src="${phone.image}">
        </div>
        <div class="itemInfoContainer">
            <h2>${phone.title}</h2>
            <h3>Price: $${phone.price}</h3>
            <p>Brand: ${phone.brand}</p>
            <p>Seller: ${user.firstname} ${user.lastname}</p>
            <p>Stock: ${phone.stock}</p>
            <p>Quantity in cart: <span class="itemCartQuantity">0</span></p>
            <button>Add to cart</button>
        </div>
    </div>
    `
}

// TODO Add the reviews section of item state
// function createItemReviewsElement(phone) {

// }

if (state == "home") {
    emptyContainer("#mainContent");
    createHomeContainers();
    getSoldSoon();
    getBestSeller();
}
else if (state == "item") {
    // TODO change item state 'changeToItemState()' need last title and seller
    getPhone();
}

