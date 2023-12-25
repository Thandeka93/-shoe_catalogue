export default function ShoeCatalogueService(db) {

    async function signup(name, surname, address, phoneNumber, email, password) {

        const insertQuery = `INSERT INTO users (name, surname, address, phone_number, email, password) 
                            VALUES ($1, $2, $3, $4, $5, $6)`;
        await db.none(insertQuery, [name, surname, address, phoneNumber, email, password])
    }

    async function getPasswordHash(email) {
        const selectQuery = `SELECT password FROM users WHERE email = $1`;

        const result = await db.oneOrNone(selectQuery, [email])

        return result.password;
    }

    async function userCheck(email) {
        const selectQuery = `SELECT email FROM users WHERE email = $1`;

        const result = await db.oneOrNone(selectQuery, [email])

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async function getUsername(email) {
        const selectQuery = `SELECT name FROM users WHERE email = $1`;

        const result = await db.oneOrNone(selectQuery, [email]);

        return result.name;
    }

    async function getUserId(email) {
        const selectQuery = `SELECT id FROM users WHERE email = $1`;

        const result = await db.oneOrNone(selectQuery, [email])

        return result.id;
    }

    async function checkExistingCart(email) {
        const userId = await getUserId(email);

        const selectQuery = `SELECT * FROM cart WHERE user_id = $1 AND status = 'Created'`;

        const result = await db.oneOrNone(selectQuery, [userId])

        if (!result) {
            return false;
        } else {
            return true;
        }
    }

    async function createCart(email) {
        const userId = await getUserId(email);

        const insertQuery = `INSERT INTO cart(user_id, status) VALUES ($1, 'Created')`;

        await db.none(insertQuery, [userId]);
    }

    async function addItemToCart(cartId, shoeId) {
        const insertQuery = `INSERT INTO cart_items(cart_id, shoe_id, quantity) VALUES ($1, $2, 1)`;

        await db.none(insertQuery, [cartId, shoeId])
    }

    async function getCartId(userId) {
        const selectQuery = `SELECT id FROM cart WHERE user_id = $1 AND status = 'Created'`;

        const result = await db.oneOrNone(selectQuery, [userId]);

        return result.id;
    }

    async function getCartItemsList(cartId) {
        const selectQuery = `SELECT shoes.* FROM shoes 
        JOIN cart_items ON shoes.id = cart_items.shoe_id
        JOIN cart ON cart.id = cart_items.cart_id 
        WHERE cart_items.cart_id = $1 AND cart.status = 'Created'`;

        const result = await db.manyOrNone(selectQuery, [cartId])

        return result;
    }

    async function removeItemFromCart(cartId, shoeId) {
        const deleteQuery = `DELETE FROM cart_items WHERE cart_id = $1 AND shoe_id = $2`;

        await db.none(deleteQuery, [cartId, shoeId])
    }

    async function removeCompleteCart(cartId) {
        const deleteQueryItems = `DELETE FROM cart_items WHERE cart_id = $1`;
        const deleteQueryCart = `DELETE FROM cart WHERE id = $1`;

        await db.none(deleteQueryItems, [cartId])
        await db.none(deleteQueryCart, [cartId])
    }

    async function updateCartItemByIncrease(cartId, shoeId) {
        const updateQuery = `UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 AND shoe_id = $2`;

        await db.none(updateQuery, [cartId, shoeId])

        return await getCartNumberOfItems(cartId, shoeId)
    }

    async function updateCartItemByDecrease(cartId, shoeId) {
        const updateQuery = `UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = $1 AND shoe_id = $2`;

        await db.none(updateQuery, [cartId, shoeId])

        return await getCartNumberOfItems(cartId, shoeId)
    }

    async function getCartNumberOfItems(cartId, shoeId) {
        const selectQuery = `SELECT quantity FROM cart_items WHERE cart_Id = $1 AND shoe_id = $2`;

        const result = await db.one(selectQuery, [cartId, shoeId]);

        return result.quantity;
    }

    async function getCartItemsTotal(cartId, shoeId) {
        const quantity = await getCartNumberOfItems(cartId, shoeId);
        const selectQuery = `SELECT price FROM shoes WHERE id = $1`;

        const total = await db.one(selectQuery, [shoeId]);

        return quantity * total.price;
    }

    async function createOrder(cartId, orderNumber, timestamp) {
        const updateQuery = `UPDATE cart SET status = 'Completed', order_number = $1, timestamp = $2 WHERE id = $3;`

        await db.none(updateQuery, [orderNumber, timestamp, cartId])
    }

    async function getAccountDetails(email) {
        const selectQuery = `SELECT * FROM users WHERE email = $1`;

        const accountDetails = await db.one(selectQuery, [email]);

        return accountDetails;
    }

    async function getWishlist(userId) {
        const selectQuery = `SELECT shoes.* FROM shoes 
        JOIN wishlist ON wishlist.shoe_id = shoes.id 
        WHERE wishlist.user_id = $1`;

        const result = await db.manyOrNone(selectQuery, [userId]);

        return result;
    }

    async function addShoeToWishlist(userId, shoeId) {
        const insertQuery = `INSERT INTO wishlist(user_id, shoe_id) VALUES($1, $2)`;

        await db.none(insertQuery, [userId, shoeId])
    }

    async function removeFromWishlist(userId, shoeId) {
        const deleteQuery = `DELETE FROM wishlist WHERE user_id = $1 AND shoe_id = $2`;

        await db.none(deleteQuery, [userId, shoeId])
    }

    async function getCompletedCarts(userId) {
        const selectQuery = `SELECT id FROM cart WHERE user_id = $1 AND status = 'Completed'`;

        const result = await db.manyOrNone(selectQuery, [userId]);

        return result;
    }

    async function getOrders(cartId) {
        const selectQuery = `SELECT * FROM shoes 
        JOIN cart_items ON shoes.id = shoe_id 
        JOIN cart ON cart.id = cart_id 
        WHERE cart_id = $1`;

        const result = db.manyOrNone(selectQuery, [cartId]);

        return result;
    }
    async function updateAccountDetails(userId, name, surname, address, phoneNumber) {
        if (name) {
            const updateQuery = `UPDATE users SET name = $1 WHERE id = $2`

            await db.none(updateQuery, [name, userId])
        } else if (surname) {
            const updateQuery = `UPDATE users SET surname = $1 WHERE id = $2`

            await db.none(updateQuery, [surname, userId])
        } else if (address) {
            const updateQuery = `UPDATE users SET address = $1 WHERE id = $2`

            await db.none(updateQuery, [address, userId])
        } else if (phoneNumber) {
            const updateQuery = `UPDATE users SET phone_number = $1 WHERE id = $2`

            await db.none(updateQuery, [phoneNumber, userId])
        }
    }

    return {
        signup,
        getPasswordHash,
        userCheck,
        getUsername,
        checkExistingCart,
        createCart,
        addItemToCart,
        getCartId,
        getUserId,
        getCartItemsList,
        removeItemFromCart,
        removeCompleteCart,
        updateCartItemByIncrease,
        updateCartItemByDecrease,
        getCartNumberOfItems,
        getCartItemsTotal,
        createOrder,
        getAccountDetails,
        getWishlist,
        addShoeToWishlist,
        removeFromWishlist,
        getCompletedCarts,
        getOrders,
        updateAccountDetails
    }
}