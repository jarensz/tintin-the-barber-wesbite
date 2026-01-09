let listCart = [];

function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

checkCart();
addCartToHTML();

function addCartToHTML() {
    let listCartHTML = document.querySelector('.return-cart .oncart-list'); 
    listCartHTML.innerHTML = '';
    let totalQuantityHTML = document.querySelector('.total-quantity'); 
    let totalPriceHTML = document.querySelector('.total-price');

    let totalQuantity = 0;
    let totalPrice = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newP = document.createElement('div');
                newP.classList.add('items');
                newP.innerHTML =
                    `<img src="${product.prdImage}" alt="">
                    <div class="item-info">
                        <div class="item-name">${product.prdName}</div>
                        <div class="item-price">₱${product.prdPrice.toFixed(2)}</div>
                    </div>
                    <div class="item-quantity">${product.quantity}</div>
                    <div class="price">₱${(product.prdPrice * product.quantity).toFixed(2)}</div>`;
                listCartHTML.appendChild(newP);
                totalQuantity += product.quantity;
                totalPrice += (product.prdPrice * product.quantity);
            }
        });
    }

    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = '₱' + totalPrice.toFixed(2);
}
