import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import Handlebars from 'handlebars';
import axios from 'axios';

const app = express();

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

app.get('/', async function (req, res) {

    const api_allShoes = "https://shoes-api-o60a.onrender.com/api/shoes";
    const allShoes = (await axios.get(api_allShoes)).data;
    res.render('shop', {
        allShoes
    });
});

app.post('/filter', async function (req, res) {
    try {
        const selectedBrand = req.body.brand;
        const selectedSize = req.body.size;

        if (selectedBrand === "default" && selectedSize === "default") {
            // show all shoes
            const api_allShoes = "https://shoes-api-o60a.onrender.com/api/shoes";
            const shoesData = (await axios.get(api_allShoes)).data;

            res.render('shop', {
                allShoes: shoesData,
            });
        } else if (selectedBrand !== "default" && selectedSize === "default") {
            // filter by brand
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}`;
            const shoesData = (await axios.get(api_brand)).data;

            res.render('shop', {
                allShoes: shoesData,
            });
        } else if (selectedBrand === "default" && selectedSize !== "default") {
            // filter by size
            const api_size = `https://shoes-api-o60a.onrender.com/api/shoes/size/${selectedSize}`;
            const shoesData = (await axios.get(api_size)).data;

            res.render('shop', {
                allShoes: shoesData,
            });
        } else {
            // filter by both brand and size
            const api_brand_and_size = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}/size/${selectedSize}`;
            const shoesData = (await axios.get(api_brand_and_size)).data;

            res.render('shop', {
                allShoes: shoesData,
            });
        }


    } catch (error) {
        console.error('Error fetching and filtering shoes:', error);
    }
  });

     app.get('/admin', (req, res) => {
    res.render('addStock');
     });

const PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('App started at port', PORT);
});