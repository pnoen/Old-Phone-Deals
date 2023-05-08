async function updateCart(phone, quantity) {
    let params = {
        phone: phone,
        quantity: quantity
    }

    // console.log(params);
    await $.post("/updateCart", params);
}

$(".product-box button.quantity").click(async function (e){
    let data;
    await $.getJSON("/getCart", null, function (res) {
		data = res;
	});
    console.log(data);
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
    await $.getJSON("/getCart", null, function (res) {
		data = res;
	});
    console.log(data);
    var x = $(".product-box#"+ e.target.id + " span.itemCartQuantity ");
    x[0].innerHTML = quantity;
    cart[e.target.id].quantity = parseInt(quantity);
    
});

$(".product-box button.remove").click(async function (e){
    cart[e.target.id].quantity = 0;
    $(".product-box#"+ e.target.id).remove();
});