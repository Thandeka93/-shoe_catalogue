history.replaceState({}, null, "/user/wishlist");

const removeFromWishlistBtn = document.querySelectorAll(".removeFromWishlistBtn");

removeFromWishlistBtn.forEach(item => {
    item.addEventListener("click", async () => {
        const shoeId = item.closest(".shoeContainer").dataset.shoeId;
        const email = JSON.parse(localStorage.getItem("user"))[1];
        
        try {
            await axios.post(`/user/wishlist/update/${shoeId}`, {
                email
            })

            window.location.href = `/user/wishlist?user=${email}`;
        }

        catch (err) {
            console.log(err)
        }
    })
})