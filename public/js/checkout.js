async function build(){
    $("#checkoutContent").empty();
    let data;
    await $.getJSON("/getCart", null, function(res){
        data = res;
    });
    let content = "<h2>Checkout</h2>";
    let total_price = 0;
    for(var i = 0; i<data.length; i++){
        content+=`<div class='product-box' id=${i}>
        <p>${data[i].phone.title}</p>
        <p>$${data[i].phone.price}</p>
        <span class="itemCartQuantity" title=${data[i].phone.title} seller=${data[i].phone.seller}> ${data[i].quantity} </span>
        <div>
        <button class="quantity" id=${i}>Change quantity</button>
        <button class="remove" id=${i}>Remove</button>
        </div>
        </div>`
        total_price += (data[i].quantity * data[i].phone.price);
    }
    if(data.length > 0){
        content+=`<div class="footer">
        <label>Total price: $${total_price.toFixed(2)}</label>
        <button class="confirm-button">Confirm</button>
        <button class="back-button">Back</button>
    </div>`
    }
    else{
        content += `<h2>Nothing in cart</h2>`
    }
    $("#checkoutContent").append(content);
    $(".product-box button.quantity").click(async function (e){
        var item = cart[e.target.id];
        let remainingStock = item.phone.stock;
        let quantity = 0;
            if (remainingStock > 0) {
                quantity = prompt("Please enter the quantity");
                if (
                    quantity && // if exists
                    !isNaN(quantity) && // if is a number
                    quantity >= 0 &&
                    quantity <= remainingStock &&
                    quantity.indexOf(".") == -1 // if not a decimal
                ) {
                    alert("The cart has been updated");
                }
                else {
                    alert("You have entered an invalid quantity");
                    return;
                }
            }
            else {
                alert("Quantity exceeds current stock");
                return;
            }
        updateCart(cart[e.target.id].phone, quantity);
        await build();
    });
    $(".product-box button.remove").click(async function (e){
        updateCart(cart[e.target.id].phone, 0);
        await build();
    });
    $(".footer button.back-button").click(async function (e){
        history.back();
    });
    $(".footer button.confirm-button").click(async function (e){
        let params = {
            state: "home",
            data: data
        }
        await $.post("/buyPhone");
        await $.post("/updateMainState", params);
        window.location.href = "/";
    });
}

async function updateCart(phone, quantity) {
    let params = {
        phone: phone,
        quantity: quantity
    }

    // console.log(params);
    await $.post("/updateCart", params);
}

$(".product-box button.quantity").click(async function (e){
    var item = cart[e.target.id];
    let remainingStock = item.phone.stock;
    let quantity = 0;
        if (remainingStock > 0) {
            quantity = prompt("Please enter the quantity");
            if (
                quantity && // if exists
                !isNaN(quantity) && // if is a number
                quantity >= 1 &&
                quantity <= remainingStock &&
                quantity.indexOf(".") == -1 // if not a decimal
            ) {
                alert("The item has been added to the cart");
            }
            else {
                alert("You have entered an invalid quantity");
                return;
            }
        }
        else {
            alert("You cannot add more of this item");
            return;
        }
    updateCart(cart[e.target.id].phone, quantity);
    await build();
    //var x = $(".product-box#"+ e.target.id + " span.itemCartQuantity ");
    //x[0].innerHTML = quantity;
    //cart[e.target.id].quantity = parseInt(quantity);
});

$(".product-box button.remove").click(async function (e){
    //cart[e.target.id].quantity = 0;
    updateCart(cart[e.target.id].phone, 0);
    await build();
    //$(".product-box#"+ e.target.id).remove();
    //console.log("remove");
});

build();