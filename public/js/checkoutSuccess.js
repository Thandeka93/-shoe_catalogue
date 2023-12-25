const ordersLink = document.querySelector(".checkout-success-container a");
const email = JSON.parse(localStorage.getItem("user"))[1];

ordersLink.href = `${ordersLink.href}?user=${email}`;