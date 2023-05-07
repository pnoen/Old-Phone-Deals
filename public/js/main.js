async function updateMainState(newState) {
    state = newState;
    // console.log(state);
    let params = {
        state: newState
    }
    await $.post("/updateMainState", params);
}

function changeToHomeState() {
    emptyContainer("#mainContent");
    updateMainState("home");
    createHomeContainers();
    getSoldSoon();
    getBestSeller();
}

async function getSoldSoon() {
    let data;
    await $.getJSON("/getSoldSoon", null, function (res) {
        data = res;
    });

    data.forEach(function (phone) {
        $("#soldSoonContainer").append(createPhoneElement(phone));
        $("#soldSoonContainer div:last button").click(function (e) {
            changeToItemState(phone.title, phone.seller);
        });
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
            <button class="phoneCardViewBtn">VIEW</button>
        </div>
    </div>`
}

function emptyContainer(selector) {
    $(selector).empty();
}

async function changeToItemState(phoneTitle, phoneSeller) {
    emptyContainer("#mainContent");
    reviewCounter = 0;
    updateMainState("item");
    let phone = await getPhone(phoneTitle, phoneSeller);
    createItemPage(phone);
}

async function changeToCheckoutState() {
    emptyContainer("#mainContent")
    updateMainState("checkout");
    createCheckoutPage();
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
    // console.log(data);
    return data[0];
}

function createItemPage(phone) {
    createItemListingElement(phone);
    createItemReviewsElement(phone);
}

function createCheckoutPage() {
    let element = `<div class="top-bar">
            <button>back</button>
        </div>
        <div class="product-box">
            <label>Phone Name</label>
            <label>$</label>
            <input type="number" value="1"/>
            <button>Remove</button>
        </div>
        <div class="footer">
            <label>Total price: $</label>
            <input type="button">Confirm</input>
        </div>
`
}

async function getUserById(id) {
    let data;
    let params = {
        id: id.toString()
    }

    await $.getJSON("/user/getUserById", params, function (res) {
        data = res;
    });
    // console.log(data);
    return data[0];
}

async function createItemListingElement(phone) {
    let user = await getUserById(phone.seller);

    let element = `<h2>${phone.title}</h2>
        <div class="itemListingContainer">
        <div class="itemInfoContainer">
            <h3>Price: $${phone.price}</h3>
            <p>Brand: ${phone.brand}</p>
            <p>Seller: ${user.firstname} ${user.lastname}</p>
            <p>Stock: ${phone.stock}</p>
            <div class="quantityCartSection">
              <p>Quantity in cart: <span class="itemCartQuantity">0</span></p>
              <button>ADD TO CART</button>
            </div>
        </div>
        <div class="itemImgContainer">
            <img src="${phone.image}">
        </div>
    </div>
    <div class="itemReviewsContainer">
        <h3>Reviews (${phone.reviews.length})</h3>
        <div class="itemAllReviews">
            <button>Show more reviews</button>
        </div>
        <div class="itemAddReviewContainer">
            <h4>Add review</h4>
            <textarea id="itemAddReviewComment" rows="5" cols="100"></textarea>
            <div class="itemAddReviewRatingContainer">
                <label for="itemAddReviewRating">Rating:</label>
                <select id="itemAddReviewRating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button>Comment</button>
            </div>
        </div>
    </div>
    `
    $("#mainContent").append(element);
    // $("#mainContent").append(createItemReviewsContainerElement());
    $(".itemAllReviews button:last").click(async function (e) {
        let updatedPhone = await getPhone(phone.title, phone.seller);
        createItemReviewsElement(updatedPhone);
    });
}

async function createItemReviewsElement(phone) {
    // console.log(phone);
    let reviews = phone.reviews;
    for (let i = reviewCounter; i < reviews.length; i++) {
        if (i == reviewCounter + 3) { // Displays reviews 3 at a time
            reviewCounter = i;
            break;
        }
        let review = reviews[i];
        // console.log(review);
        let user = await getUserById(review.reviewer);
        let rating = "★".repeat(review.rating);
        let ratingEmpty = "★".repeat(5 - review.rating);
        let element = `<div class="itemReview">
            <div class="itemReviewTop">
              <p>
                ${user.firstname} ${user.lastname}
              </p>
              <div class="ratingStars">
                <span class="itemReviewRating">${rating}</span>
                <span class="itemReviewRatingEmpty">${ratingEmpty}</span>
              </div>
            </div>
            <p class="itemReviewComment">${review.comment}</p>
        </div>
        `
        $(".itemAllReviews button").before(element);
        if (i == reviews.length - 1) {
            reviewCounter = reviews.length;
        }
    }
}

function updateHomeAnchor() {
    $("#navBarLinks a:first").click(function (e) {
        changeToHomeState();
    })
}

var reviewCounter = 0;

// initial page load
updateHomeAnchor();
if (state == "home") {
    changeToHomeState();
}
else if (state == "item") {
    // TODO change item state 'changeToItemState()' need last title and seller
    getPhone();
}
