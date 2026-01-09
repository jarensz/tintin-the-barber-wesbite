let cartIcon = document.querySelector('.cart-icon');
let cartContainer = document.querySelector('.cart-container');
let prdContainer = document.querySelector('.products-main');
let closeCart = document.querySelector('.close');

cartIcon.addEventListener('click', () => {
    if (cartContainer.style.right === '-100%') {
        cartContainer.style.right = '0';
        prdContainer.style.transform = 'translateX(-400px)';
    } else {
        cartContainer.style.right = '-100%';
        prdContainer.style.transform = 'translateX(0)';
    }
});

closeCart.addEventListener('click', () => {
    cartContainer.style.right = '-100%';
    prdContainer.style.transform = 'translateX(0)';
});

let products = null;
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    });

function addDataToHTML() {
    let prdRows = document.querySelectorAll('.product-row');

    if (products !== null && prdRows.length === 2) {
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            let rowIndex = Math.floor(i / 3); // Calculate row index
            let prdRow = prdRows[rowIndex];

            let newProduct = document.createElement('div');
            newProduct.classList.add('product-col');
            newProduct.innerHTML =
                `<img src="${product.prdImage}" alt="">
                <div class="layer">
                    <h3>${product.prdName}</h3><br>
                    <p>${product.prdDesc}</p>
                    <h6><strong>PRICE:</strong> ₱${product.prdPrice.toFixed(2)}</h6>
                    <button type="button" onclick="addToCart(${product.prdID})">ADD TO CART</button>
                </div>`;
            prdRow.appendChild(newProduct);
        }
    }
}

let listCart = [];

function checkCart() {
    let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));

    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

checkCart();

function addToCart(prdID) {
    if (!listCart[prdID]) {
        let dataProduct = products.filter(
            product => product.prdID === prdID
        )[0];

        listCart[prdID] = dataProduct;
        listCart[prdID].quantity = 1;
    } else {
        listCart[prdID].quantity++;
    }

    let save = "expires=Fri, 31 Dec 2027 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + save + "; path=/;";
    addToCartToHTML();
}

function addToCartToHTML() {
    let cartListHTML = document.querySelector('.cart-list');
    cartListHTML.innerHTML = '';

    let prdQuantity = document.querySelector('.total-quantity');
    let newQuantity = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('items');
                newCart.innerHTML =
                    `<img src="${product.prdImage}" alt="">
                    <div class="contents">
                        <div class="prd-name">
                            ${product.prdName}
                        </div>
                        <div class="prd-price">
                            ₱${product.prdPrice.toFixed(2)}
                        </div>
                    </div>
                    <div class="prd-quantity">
                        <button onclick="changeQuantity(${product.prdID}, 'decrease')">-</button>
                        <span class="val">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.prdID}, 'increase')">+</button>
                    </div>`;
                cartListHTML.appendChild(newCart);
                newQuantity += product.quantity;
            }
        });
    }
    prdQuantity.innerHTML = newQuantity;
}

function changeQuantity(prdID, action) {
    if (action === 'increase') {
        listCart[prdID].quantity++;
    } else if (action === 'decrease') {
        listCart[prdID].quantity--;
        if (listCart[prdID].quantity === 0) {
            delete listCart[prdID];  // Remove the product from the list if quantity is 0
        }
    }

    saveCart();
    addToCartToHTML();
}

function saveCart() {
    const expires = "expires=Fri, 31 Dec 2027 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + expires + "; path=/;";
}

// Function to clear the cart for debugging or reset
function clearCart() {
    listCart = [];
    saveCart();
    addToCartToHTML();
    console.log('Cart cleared');
}

document.addEventListener('DOMContentLoaded', () => {
    addToCartToHTML();
});
