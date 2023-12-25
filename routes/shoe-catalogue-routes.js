import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import random from 'random-string-alphanumeric-generator';

export default function ShoeCatalogueRoutes(shoeCatalogueService) {

    async function signupUser(req, res) {
        const { name, surname, address, phoneNumber, email, password, confirmPassword } = req.body;

        if (!name || !surname || !address || !phoneNumber || !email || !password) {
            res.json({
                status: "error",
                error_message: "Please complete all fields"
            })
        } else if (password !== confirmPassword) {
            res.json({
                status: "error",
                error_message: "Passwords do not match"
            })
        } else {

            const hashedPassword = await bcrypt.hash(password, 10)

            shoeCatalogueService.signup(name, surname, address, phoneNumber, email, hashedPassword)

            res.json({
                status: "success",
                message: "User successfully signed up"
            })
        }
    }

    async function loginUser(req, res) {
        const { email, password } = req.body;

        if (!email && !password) {
            res.json({
                status: "error",
                error_message: "Please enter an email and password"
            })
        } else if (!email) {
            res.json({
                status: "error",
                error_message: "Please enter an email address"
            })
        } else if (!password) {
            res.json({
                status: "error",
                error_message: "Please enter a password"
            })
        } else {

            const userCheck = await shoeCatalogueService.userCheck(email)

            if (userCheck) {
                const passwordHash = await shoeCatalogueService.getPasswordHash(email);

                const passwordHashCheck = await bcrypt.compare(password, passwordHash);

                const username = await shoeCatalogueService.getUsername(email);

                if (passwordHashCheck) {

                    const token = jwt.sign({ email }, "shoe catalogue secret")

                    res.json({
                        status: "success",
                        token,
                        username,
                        email
                    })
                } else {
                    res.json({
                        status: "error",
                        error_message: "Password is incorrect"
                    })
                }
            } else {
                res.json({
                    status: "error",
                    error_message: "User does not exist"
                })
            }
        }
    }

    async function addToCart(req, res) {
        const email = req.body.email;
        const shoeId = req.body.shoeId;

        const cartExists = await shoeCatalogueService.checkExistingCart(email)

        if (!cartExists) {
            await shoeCatalogueService.createCart(email);

            const userId = await shoeCatalogueService.getUserId(email);

            const cartId = await shoeCatalogueService.getCartId(userId);

            await shoeCatalogueService.addItemToCart(cartId, shoeId)

            const cartItemsList = await shoeCatalogueService.getCartItemsList(cartId);

            res.json({
                cartTotal: cartItemsList.length
            })
        } else {

            const userId = await shoeCatalogueService.getUserId(email);

            const cartId = await shoeCatalogueService.getCartId(userId);

            await shoeCatalogueService.addItemToCart(cartId, shoeId)

            const cartItemsList = await shoeCatalogueService.getCartItemsList(cartId);

            res.json({
                cartTotal: cartItemsList.length
            })
        }
    }

    async function getCart(req, res) {
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            const cartItems = await shoeCatalogueService.getCartItemsList(cartId);

            const result = [];

            for (const item of cartItems) {
                const shoeId = item.id;

                const quantity = await shoeCatalogueService.getCartNumberOfItems(cartId, shoeId);
                const obj = { ...item, quantity }

                result.push(obj)
            }

            const data = result.map(item => {
                const total = item.price * item.quantity;
                return { ...item, total }
            })

            res.json(data);
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function removeFromCart(req, res) {
        const shoeId = req.params.id;
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            await shoeCatalogueService.removeItemFromCart(cartId, shoeId)

            const cartItemsList = await shoeCatalogueService.getCartItemsList(cartId);

            if (cartItemsList.length === 0) {
                await shoeCatalogueService.removeCompleteCart(cartId)
            }

            res.json({
                status: "success"
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function removeCart(req, res) {
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            await shoeCatalogueService.removeCompleteCart(cartId);

            res.json({
                status: "success"
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }

    }

    async function updateCart(req, res) {
        const shoeId = req.params.id;
        const type = req.query.type;
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            if (type === "increase") {

                const result = await shoeCatalogueService.updateCartItemByIncrease(cartId, shoeId);
                const total = await shoeCatalogueService.getCartItemsTotal(cartId, shoeId);

                res.json({
                    status: "success",
                    quantity: result,
                    total
                })

            } else if (type === "decrease") {
                const result = await shoeCatalogueService.updateCartItemByDecrease(cartId, shoeId);
                const total = await shoeCatalogueService.getCartItemsTotal(cartId, shoeId);

                res.json({
                    status: "success",
                    quantity: result,
                    total
                })
            }


        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function getCartTotal(req, res) {
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            const cartItems = await shoeCatalogueService.getCartItemsList(cartId);

            const grandTotalArr = [];

            for (const item of cartItems) {
                const shoeId = item.id;

                const total = await shoeCatalogueService.getCartItemsTotal(cartId, shoeId);

                grandTotalArr.push(total)
            }

            const grandTotal = grandTotalArr.reduce((total, item) => total += item);

            res.json({
                status: "success",
                grandTotal
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function updateCartCheckout(req, res) {
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const cartId = await shoeCatalogueService.getCartId(userId);

            const orderNumber = random.randomNumber(6);

            const timestamp = new Date();

            const day = timestamp.getDate();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const month = months[timestamp.getMonth()];
            const year = timestamp.getFullYear();

            const timestampFormatted = `${day} ${month} ${year}`;

            await shoeCatalogueService.createOrder(cartId, orderNumber, timestampFormatted);

            res.json({
                status: "success"
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function checkoutSuccess(req, res) {
        res.render("checkout-success")
    }

    async function accountDetails(req, res) {
        const email = req.query.user;

        try {
            const data = await shoeCatalogueService.getAccountDetails(email);

            res.render("account-details", { data })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function wishlist(req, res) {
        const email = req.query.user;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            const wishlistItems = await shoeCatalogueService.getWishlist(userId);

            res.render("wishlist", { wishlistItems })
        }
        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function addToWishlist(req, res) {
        const email = req.body.email;
        const shoeId = req.body.shoeId;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            await shoeCatalogueService.addShoeToWishlist(userId, shoeId)

            res.json({
                status: "success"
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function orderHistory(req, res) {
        const email = req.query.user;

        try {
            const userId = await shoeCatalogueService.getUserId(email);

            const completedCarts = await shoeCatalogueService.getCompletedCarts(userId);

            const orders = [];

            for (const cart of completedCarts) {
                const order = await shoeCatalogueService.getOrders(cart.id);
                orders.push(order)
            }

            const sortedOrders = orders.map(item => item.map(item2 => ({ ...item2, subtotal: item2.quantity * item2.price })))

            const grandTotalArr = []
            let total = 0;

            sortedOrders.forEach(order => {
                order.forEach(item => {
                    total += item.subtotal;
                })
                grandTotalArr.push({ grandtotal: total })
                total = 0;
            })

            res.render("order-history", {
                sortedOrders,
                grandTotalArr
            })

        }
        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function updateWishlist(req, res) {
        const shoeId = req.params.id;
        const email = req.body.email;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            await shoeCatalogueService.removeFromWishlist(userId, shoeId);

            res.json({
                status: "success",
                error: err.stack
            })
        }

        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }

    async function updateAccount(req, res) {
        const { name, surname, address, phoneNumber, email } = req.body;

        try {
            const userId = await shoeCatalogueService.getUserId(email);
            await shoeCatalogueService.updateAccountDetails(userId, name, surname, address, phoneNumber);

            res.json({
                status: "success",
                message: "Account details successfully updated"
            })
        }
        catch (err) {
            res.json({
                status: "error",
                error: err.stack
            })
        }
    }
    return {
        signupUser,
        loginUser,
        addToCart,
        getCart,
        removeFromCart,
        removeCart,
        updateCart,
        getCartTotal,
        updateCartCheckout,
        checkoutSuccess,
        accountDetails,
        updateAccount,
        wishlist,
        addToWishlist,
        updateWishlist,
        orderHistory
    }
}