const editName = document.querySelector("#edit-name");
const editSurname = document.querySelector("#edit-surname");
const editPhoneNumber = document.querySelector("#edit-phone-number");
const editAddress = document.querySelector("#edit-address");

const nameField = document.querySelector("#name-field");
const surnameField = document.querySelector("#surname-field");
const phoneNumberField = document.querySelector("#phone-number-field");
const addressField = document.querySelector("#address-field");
const email = JSON.parse(localStorage.getItem("user"))[1];

const accountUpdateMessage = document.querySelector("#account-update-message");

editName.addEventListener("click", async () => {
    if (editName.innerText === "edit" && editSurname.innerText !== "save" && editPhoneNumber.innerText !== "save" && editAddress.innerText !== "save") {
        editName.innerText = "save"
        nameField.removeAttribute("disabled")
        nameField.focus()
        nameField.classList.add("edit-state");
    } else if (editName.innerText === "save" && editSurname.innerText !== "save" && editPhoneNumber.innerText !== "save" && editAddress.innerText !== "save") {
        try {
            const response = await axios.post("/user/account/update", {
                name: nameField.value,
                surname: null,
                email: email,
                address: null,
                phoneNumber: null
            })

            if (response.data.status === "success") {
                accountUpdateMessage.classList.add("messageFadeIn")
                accountUpdateMessage.classList.remove("hidden")
                setTimeout(() => {
                    accountUpdateMessage.classList.remove("messageFadeIn");
                    accountUpdateMessage.classList.add("messageFadeOut")
                    accountUpdateMessage.addEventListener("animationend", (event) => {
                        if (event.animationName === "fadeOut") {
                            accountUpdateMessage.classList.add("hidden");
                            accountUpdateMessage.classList.remove("messageFadeOut")
                        }
                    })
                }, 5000)
            }

        }

        catch (err) {
            console.log(err)
        }
        nameField.blur()
        editName.innerText = "edit";
        nameField.setAttribute("disabled", "");
        nameField.value = nameField.value;
        nameField.classList.remove("edit-state");
    }
})
editSurname.addEventListener("click", async () => {
    if (editSurname.innerText === "edit" && editName.innerText !== "save" && editPhoneNumber.innerText !== "save" && editAddress.innerText !== "save") {
        editSurname.innerText = "save"
        surnameField.removeAttribute("disabled")
        surnameField.focus()
        surnameField.classList.add("edit-state");
    } else if (editSurname.innerText === "save" && editName.innerText !== "save" && editPhoneNumber.innerText !== "save" && editAddress.innerText !== "save") {
        try {
            const response = await axios.post("/user/account/update", {
                name: null,
                surname: surnameField.value,
                email: email,
                address: null,
                phoneNumber: null
            })

            if (response.data.status === "success") {
                accountUpdateMessage.classList.add("messageFadeIn")
                accountUpdateMessage.classList.remove("hidden")
                setTimeout(() => {
                    accountUpdateMessage.classList.remove("messageFadeIn");
                    accountUpdateMessage.classList.add("messageFadeOut")
                    accountUpdateMessage.addEventListener("animationend", (event) => {
                        if (event.animationName === "fadeOut") {
                            accountUpdateMessage.classList.add("hidden");
                            accountUpdateMessage.classList.remove("messageFadeOut")
                        }
                    })
                }, 5000)
            }
        }

        catch (err) {
            console.log(err)
        }
        surnameField.blur()
        editSurname.innerText = "edit";
        surnameField.setAttribute("disabled", "");
        surnameField.value = surnameField.value;
        surnameField.classList.remove("edit-state");
    }
})
editPhoneNumber.addEventListener("click", async () => {
    if (editPhoneNumber.innerText === "edit" && editName.innerText !== "save" && editSurname.innerText !== "save" && editAddress.innerText !== "save") {
        editPhoneNumber.innerText = "save"
        phoneNumberField.removeAttribute("disabled")
        phoneNumberField.focus()
        phoneNumberField.classList.add("edit-state");
    } else if (editPhoneNumber.innerText === "save" && editName.innerText !== "save" && editSurname.innerText !== "save" && editAddress.innerText !== "save") {
        try {
            const response = await axios.post("/user/account/update", {
                name: null,
                surname: null,
                email: email,
                address: null,
                phoneNumber: phoneNumberField.value
            })

            if (response.data.status === "success") {
                accountUpdateMessage.classList.add("messageFadeIn")
                accountUpdateMessage.classList.remove("hidden")
                setTimeout(() => {
                    accountUpdateMessage.classList.remove("messageFadeIn");
                    accountUpdateMessage.classList.add("messageFadeOut")
                    accountUpdateMessage.addEventListener("animationend", (event) => {
                        if (event.animationName === "fadeOut") {
                            accountUpdateMessage.classList.add("hidden");
                            accountUpdateMessage.classList.remove("messageFadeOut")
                        }
                    })
                }, 5000)
            }
        }

        catch (err) {
            console.log(err)
        }
        phoneNumberField.blur()
        editPhoneNumber.innerText = "edit";
        phoneNumberField.setAttribute("disabled", "");
        phoneNumberField.value = phoneNumberField.value;
        phoneNumberField.classList.remove("edit-state");
    }
})
editAddress.addEventListener("click", async () => {
    if (editAddress.innerText === "edit" && editName.innerText !== "save" && editSurname.innerText !== "save" && editPhoneNumber.innerText !== "save") {
        editAddress.innerText = "save"
        addressField.removeAttribute("disabled")
        addressField.focus()
        addressField.classList.add("edit-state");
    } else if (editAddress.innerText === "save" && editName.innerText !== "save" && editSurname.innerText !== "save" && editPhoneNumber.innerText !== "save") {
        try {
            const response = await axios.post("/user/account/update", {
                name: null,
                surname: null,
                email: email,
                address: addressField.value,
                phoneNumber: null
            })

            if (response.data.status === "success") {
                accountUpdateMessage.classList.add("messageFadeIn")
                accountUpdateMessage.classList.remove("hidden")
                setTimeout(() => {
                    accountUpdateMessage.classList.remove("messageFadeIn");
                    accountUpdateMessage.classList.add("messageFadeOut")
                    accountUpdateMessage.addEventListener("animationend", (event) => {
                        if (event.animationName === "fadeOut") {
                            accountUpdateMessage.classList.add("hidden");
                            accountUpdateMessage.classList.remove("messageFadeOut")
                        }
                    })
                }, 5000)
            }
        }

        catch (err) {
            console.log(err)
        }
        addressField.blur()
        editAddress.innerText = "edit";
        addressField.setAttribute("disabled", "");
        addressField.value = addressField.value;
        addressField.classList.remove("edit-state");
    }
})

history.replaceState({}, null, "/user/account");