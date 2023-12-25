const homeBtn = document.querySelector(".home-btn");

homeBtn.addEventListener("click", () => {

    if (localStorage.getItem("jwtToken")) {
        window.location.href = "/user"
    } else {
        window.location.href = "/"
    }

})