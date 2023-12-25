const logoutBtn = document.querySelector("#logout-btn");
const userMenu = document.querySelector("#user-menu span");
const dropdownContent = document.querySelector(".dropdown-content");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    window.location.href = "/"
})

userMenu.innerText = JSON.parse(localStorage.getItem("user"))[0];

async function createCart(shoeId) {
    const email = JSON.parse(localStorage.getItem("user"))[1];

    try {
        const data = await axios.post("/user", {
            email,
            shoeId
        })

        return data;

    } catch (error) {
        console.log(error)
    }
}

async function getNumOfCartItems() {
    const email = JSON.parse(localStorage.getItem("user"))[1];
    try {
        const result = await axios.post("/cart", {
            email
        })

        return result.data.length;
    }

    catch (error) {
        console.log(error)
    }
}

(async function numOfCartItems() {

    if (await getNumOfCartItems() === undefined) {
        cartIconBadge.innerText = 0;
    } else {
        cartIconBadge.innerText = await getNumOfCartItems()
    }
})();

const email = JSON.parse(localStorage.getItem("user"))[1];

dropdownContent.firstElementChild.href = `${dropdownContent.firstElementChild.href}?user=${email}`;
dropdownContent.children[1].href = `${dropdownContent.children[1].href}?user=${email}`;
dropdownContent.children[2].href = `${dropdownContent.children[2].href}?user=${email}`;

async function addItemToWishlist(shoeId) {
    const email = JSON.parse(localStorage.getItem("user"))[1];

    try {
        await axios.post("/user/wishlist", {
            email,
            shoeId
        })

    } catch (error) {
        console.log(error)
    }
}