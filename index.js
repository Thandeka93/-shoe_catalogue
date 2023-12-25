import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import pgPromise from 'pg-promise';
import session from 'express-session';
import Handlebars from 'handlebars';
import axios from 'axios';
import ShoeCatalogueService from "./services/shoe-catalogue-service.js";
import ShoeCatalogueRoutes from "./routes/shoe-catalogue-routes.js";

const app = express();

// Define the database connection string
const connectionString = process.env.PGDATABASE_URL ||
  'postgres://ffehhsbo:YyHLTsa2u0655sfda9kbW9RkykoxTOfL@dumbo.db.elephantsql.com/ffehhsbo'

// Create a PostgreSQL database instance and connect to it
const pgp = pgPromise();
const db = pgp(connectionString);



app.engine(
    'handlebars',
    engine({
        handlebars: Handlebars,
        helpers: {
            json: function (context) {
                return JSON.stringify(context);
            },
        },
    })
);

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

const shoeCatalogueService = ShoeCatalogueService(db);
const shoeCatalogueRoutes = ShoeCatalogueRoutes(shoeCatalogueService);

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/add", (req, res) => {
    res.render("addShoe")
})

app.get("/user", (req, res) => {
    res.render("user")
})

app.post("/user", shoeCatalogueRoutes.addToCart)

app.post("/login", shoeCatalogueRoutes.loginUser)

app.post("/signup", shoeCatalogueRoutes.signupUser)

app.get("/signup/success", (req, res) => {
    res.render("signup-success")
})

app.get("/cart", (req, res) => {
    res.render("cart")
})

app.post("/cart", shoeCatalogueRoutes.getCart)

app.delete("/cart/:id", shoeCatalogueRoutes.removeFromCart)

app.delete("/cart", shoeCatalogueRoutes.removeCart)

app.post("/cart/update/:id", shoeCatalogueRoutes.updateCart)

app.post("/cart/total", shoeCatalogueRoutes.getCartTotal)

app.post("/cart/checkout", shoeCatalogueRoutes.updateCartCheckout)

app.get("/cart/checkout/success", shoeCatalogueRoutes.checkoutSuccess)

app.get("/user/account", shoeCatalogueRoutes.accountDetails)

app.post("/user/account/update", shoeCatalogueRoutes.updateAccount)

app.get("/user/wishlist", shoeCatalogueRoutes.wishlist)

app.post("/user/wishlist", shoeCatalogueRoutes.addToWishlist)

app.post("/user/wishlist/update/:id", shoeCatalogueRoutes.updateWishlist)

app.get("/user/orders", shoeCatalogueRoutes.orderHistory)

const PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('App started at port', PORT);
});