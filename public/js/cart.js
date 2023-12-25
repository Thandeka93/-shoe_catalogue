const cartItems = document.querySelector(".cart-items");
const cartItemsContainer = document.querySelector(".cart-items-container");
const cartSummary = document.querySelector(".cart-summary");
const container = document.querySelector(".container");
const shoppingCartHeading = document.querySelector("#shopping-cart-heading");
const cartMenu = document.querySelector(".cart-menu")

cartSummary.style.display = "none";

function cartSkeletonLoader() {

    for (let i = 0; i < 3; i++) {
        const cartItemLoaderContainer = document.createElement("div");
        cartItemLoaderContainer.className = "cartItemLoaderContainer";
        cartItems.append(cartItemLoaderContainer);
    }
    cartSummary.remove();
    const cartSummaryLoaderContainer = document.createElement("div")
    cartSummaryLoaderContainer.className = "cartSummaryLoaderContainer";
    cartItemsContainer.append(cartSummaryLoaderContainer);
}

cartSkeletonLoader();

async function getCartItems() {
    try {
        const email = JSON.parse(localStorage.getItem("user"))[1];

        const data = await axios.post("/cart", {
            email
        })

        return data;
    }

    catch (error) {
        console.log(error)
    }
}

async function displayCartItems(n) {

    const cartItemsList = await getCartItems();

    cartItems.innerHTML = "";
    const cartSummaryLoaderContainerElement = document.querySelector(".cartSummaryLoaderContainer");

    if (cartSummaryLoaderContainerElement) {
        cartSummaryLoaderContainerElement.remove();
    }

    if (!Array.isArray(cartItemsList.data) || cartItemsList.data.length === 0) {
        const divCart = document.createElement("div")
        const divImg = document.createElement("div")
        const divText = document.createElement("div");
        const img = document.createElement("img");
        divCart.className = "empty-cart"
        divImg.className = "empty-cart-img";
        divText.innerText = "Your shopping cart is empty";
        img.src = "/images/icons/empty-cart.png";
        divImg.append(img)
        divCart.append(divText, divImg)
        cartItemsContainer.remove()
        cartMenu.parentElement.insertBefore(divCart, cartMenu.nextSiblingElement)
    } else {
        cartItemsList.data.forEach(item => {

            const cartItem = document.createElement("div");
            const cartItemImage = document.createElement("div");
            const cartItemInfo = document.createElement("div");
            const cartItemPrice = document.createElement("div");
            const cartItemQuantity = document.createElement("div");
            const cartSizeAndColourItem = document.createElement("div");
            const removeFromCartBtn = document.createElement("div");
            const img = document.createElement("img");
            const name = document.createElement("p");
            const brand = document.createElement("p");
            const price = document.createElement("p");
            const size = document.createElement("p");
            const colour = document.createElement("p");
            const quantity = document.createElement("p");
            const quantitySelect = document.createElement("div");
            const quantityDecrease = document.createElement("div");
            const quantityIncrease = document.createElement("div");
            const quantityAmount = document.createElement("div");

            cartItem.className = "cart-item";
            cartItemImage.className = "cart-item-image";
            cartItemInfo.className = "cart-item-info";
            cartItemQuantity.className = "cart-item-quantity";
            cartItemPrice.className = "cart-item-price";
            cartSizeAndColourItem.className = "cart-size-colour-item";
            quantitySelect.className = "quantity-select";
            quantityDecrease.className = "decrease-qty";
            quantityIncrease.className = "increase-qty";
            removeFromCartBtn.className = "removeFromCartBtn";

            cartItem.dataset.shoeId = item.id;
            img.src = item.img_src;
            name.innerText = item.name;
            brand.innerText = item.brand;
            price.innerText = `R${item.total}`;
            size.innerHTML = `<span>Size: </span>${item.size}`;
            colour.innerHTML = `<span>Colour: </span>${item.colour}`;
            quantity.innerText = "Quantity";
            quantityAmount.innerText = item.quantity;
            quantityDecrease.innerHTML = "&ndash;";
            quantityIncrease.innerText = "+";
            removeFromCartBtn.innerText = "REMOVE FROM CART";

            cartItemImage.append(img);
            cartSizeAndColourItem.append(size, colour);
            cartItemInfo.append(name, brand, cartSizeAndColourItem);
            quantitySelect.append(quantityDecrease, quantityAmount, quantityIncrease)
            cartItemQuantity.append(quantity, quantitySelect);
            cartItemPrice.append(price, removeFromCartBtn);

            cartItem.append(cartItemImage, cartItemInfo, cartItemQuantity, cartItemPrice);

            cartItems.append(cartItem);
        })

        const summaryHeading = document.createElement("div");
        const hr = document.createElement("hr");
        const itemsSummary = document.createElement("div");
        const items = document.createElement("div");
        const divItems = document.createElement("div");
        const divTotal = document.createElement("div");
        const totalSummary = document.createElement("div");
        const totalText = document.createElement("div");
        const checkoutSummary = document.createElement("div");
        const clearCartBtn = document.createElement("div")
        const clearCartImg = document.createElement("img");
        const checkoutBtn = document.createElement("div");
        const checkoutText = document.createElement("div");
        const checkoutImg = document.createElement("img");
        const divCheckoutImg = document.createElement("div");
        const paymentMethods = document.createElement("div");
        const paypalIcon = document.createElement("img")
        const mastercardIcon = document.createElement("img")
        const visaIcon = document.createElement("img")

        summaryHeading.id = "summary-heading";
        itemsSummary.className = "items-summary";
        totalSummary.className = "total-summary";
        checkoutSummary.className = "checkout-summary";
        clearCartBtn.id = "clear-cart-btn";
        checkoutBtn.id = "checkout-btn";
        paymentMethods.className = "payment-methods";

        summaryHeading.innerText = "Cart Summary";
        items.innerText = "Items";
        totalText.innerText = "Total";
        checkoutText.innerText = "Checkout";
        clearCartImg.src = "/images/icons/delete-icon.png";
        checkoutImg.src = "/images/icons/checkout-icon.png";
        paypalIcon.src = "/images/icons/paypal.png"
        mastercardIcon.src = "/images/icons/mastercard.png"
        visaIcon.src = "/images/icons/visa.png"

        itemsSummary.append(items, divItems);
        totalSummary.append(totalText, divTotal);

        clearCartBtn.append(clearCartImg);
        divCheckoutImg.append(checkoutImg);
        checkoutBtn.append(checkoutText, divCheckoutImg);

        checkoutSummary.append(clearCartBtn, checkoutBtn);

        paymentMethods.append(paypalIcon, mastercardIcon, visaIcon)

        cartSummary.append(summaryHeading, hr, itemsSummary, hr, totalSummary, checkoutSummary, paymentMethods);
        cartSummary.style.display = "block";

        cartItemsContainer.append(cartSummary);

        const totalSummaryElement = document.querySelector(".total-summary")
        const itemsSummaryElement = document.querySelector(".items-summary");
        const email = JSON.parse(localStorage.getItem("user"))[1];

        try {
            const res = await axios.post("/cart/total", {
                email
            })

            totalSummaryElement.children[1].innerText = `R${res.data.grandTotal}`;
        }

        catch (err) {
            console.log(err)
        }

        itemsSummaryElement.children[1].innerText = cartItemsList.data.length;

        const increaseQtyBtn = document.querySelectorAll(".increase-qty");
        const decreaseQtyBtn = document.querySelectorAll(".decrease-qty");

        increaseQtyBtn.forEach(item => {

            item.addEventListener("click", async () => {

                const email = JSON.parse(localStorage.getItem("user"))[1];

                const shoeId = item.closest(".cart-item").dataset.shoeId;

                try {
                    const response = await axios.post(`/cart/update/${shoeId}?type=increase`, {
                        email
                    })

                    item.previousElementSibling.innerText = response.data.quantity;

                    item.closest(".cart-item-quantity").nextElementSibling.firstElementChild.innerText = `R${response.data.total}`;

                    const res = await axios.post("/cart/total", {
                        email
                    })

                    const totalSummaryElement = document.querySelector(".total-summary")
                    totalSummaryElement.children[1].innerText = `R${res.data.grandTotal}`;
                }

                catch (err) {
                    console.log(err)
                }
            })
        })

        decreaseQtyBtn.forEach(item => {

            item.addEventListener("click", async () => {

                const email = JSON.parse(localStorage.getItem("user"))[1];

                const shoeId = item.closest(".cart-item").dataset.shoeId;

                try {
                    const response = await axios.post(`/cart/update/${shoeId}?type=decrease`, {
                        email
                    })

                    item.nextElementSibling.innerText = response.data.quantity;

                    item.closest(".cart-item-quantity").nextElementSibling.firstElementChild.innerText = `R${response.data.total}`;

                    const res = await axios.post("/cart/total", {
                        email
                    })

                    const totalSummaryElement = document.querySelector(".total-summary")
                    totalSummaryElement.children[1].innerText = `R${res.data.grandTotal}`;
                }

                catch (err) {
                    console.log(err)
                }
            })
        })

        const removeFromCartBtnElements = document.querySelectorAll(".removeFromCartBtn");

        removeFromCartBtnElements.forEach(item => {
            item.addEventListener("click", async () => {

                const shoeId = item.closest(".cart-item").dataset.shoeId;
                const email = JSON.parse(localStorage.getItem("user"))[1];

                try {
                    await axios.delete(`/cart/${shoeId}`, {
                        data: { email }
                    })

                    cartItems.innerHTML = "";
                    cartSummary.innerHTML = "";
                    cartSummary.style.display = "none";

                    const cartItemsList = await getCartItems();

                    if (!Array.isArray(cartItemsList)) {
                        cartSkeletonLoader()
                    }

                    n = true;

                    if (n) {
                        await displayCartItems(false);
                    }
                }

                catch (err) {
                    console.log(err.message)
                }
            })
        })

        const clearCartBtnElement = document.querySelector("#clear-cart-btn");

        clearCartBtnElement.addEventListener("click", async () => {

            const email = JSON.parse(localStorage.getItem("user"))[1];

            try {
                await axios.delete(`/cart`, {
                    data: { email }
                })

                cartItemsContainer.innerHTML = "";
                await displayCartItems(false);
            }

            catch (err) {
                console.log(err.message)
            }
        })

        const checkoutBtnElement = document.querySelector("#checkout-btn");

        checkoutBtnElement.addEventListener("click", async () => {
            const email = JSON.parse(localStorage.getItem("user"))[1];

            try {
                const cartItems = await axios.post("/cart", {
                    email
                })

                for (const item of cartItems.data) {
                    await axios.post(`https://shoes-api-o60a.onrender.com/api/shoes/sold/${item.id}`, {
                        total: item.quantity
                    })
                }

                await axios.post("/cart/checkout", {
                    email
                })

                window.location.href = "/cart/checkout/success"

            }

            catch (err) {
                console.log(err)
            }

        })

    }
}

await displayCartItems(true);