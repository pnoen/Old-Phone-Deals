async function getSoldSoon() {
    let data;
    await $.getJSON("/getSoldSoon", null, function (res) {
        data = res;
    });
    
    data.forEach(function (phone) {
        $("#soldSoonContainer").append(`
            <div class="phoneCard">
                <div class="phoneCardImgContainer">
                    <img src="${phone.image}" class="phoneCardImg">
                </div>
                <div class="phoneCardDescContainer">
                    <h3>${phone.title}</h3>
                    <h4>Stock: ${phone.stock}</h4>
                    <h4>$${phone.price}</h4>
                    <button class="phoneCardAddBtn">Add to cart</button>
                </div>
            </div>
        `)
    });
}

async function getBestSeller() {
    let data;
    await $.getJSON("/getBestSeller", null, function (res) {
        data = res;
    });
    
    data.forEach(function (phone) {
        $("#bestSellerContainer").append(`
            <div class="phoneCard">
                <div class="phoneCardImgContainer">
                    <img src="${phone.image}" class="phoneCardImg">
                </div>
                <div class="phoneCardDescContainer">
                    <h3>${phone.title}</h3>
                    <h4>Stock: ${phone.stock}</h4>
                    <h4>$${phone.price}</h4>
                    <button class="phoneCardAddBtn">Add to cart</button>
                </div>
            </div>
        `)
    });
}

if (state == "home") {
    getSoldSoon();
    getBestSeller();
}
