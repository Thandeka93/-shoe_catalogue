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
        allShoes,

    });
});

app.post('/filter', async function (req, res) {
    try {
        const selectedBrand = req.body.brand;
        const selectedSize = req.body.size;
        const selectedColor = req.body.color;

        // // Check if no filters selected
        // if (
        //     selectedBrand === "default" &&
        //     selectedSize === "default" &&
        //     selectedColor === "default"
        // ) {
        //     req.flash('error', 'Please select at least one filter (brand, size, or color).');
        //     return res.redirect('/');  // Redirect to the main page 
        // }
        if (selectedBrand === "default" && selectedSize === "default" && selectedColor === "default") {
            // show all shoes
            const api_allShoes = "https://shoes-api-o60a.onrender.com/api/shoes";
            const shoesData = (await axios.get(api_allShoes)).data;

            res.render('shop', {
                allShoes: shoesData,
            });

            if (!shoesData || shoesData.length === 0) {
                // No shoes found for the selected brand or size
                return res.render('shop', {
                    allShoes: [],
                    message: 'No shoes found for the selected brand or size.',
                });
            }
        }


        //selects color   
        else if (selectedBrand === "default" && selectedSize === "default" && selectedColor !== "default") {
            // filter by color
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/color/${selectedColor}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }

        //selects size   
        else if (selectedBrand === "default" && selectedSize !== "default" && selectedColor === "default") {
            // filter by size
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/size/${selectedSize}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }

        else if (selectedBrand !== "default" && selectedSize === "default" && selectedColor === "default") {
            //filter by brand
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }


        // selects size and color
        else if (selectedBrand === "default" && selectedSize !== "default" && selectedColor !== "default") {
            // filter by size and color
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/size/${selectedSize}/color/${selectedColor}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }

        //selects brand and color
        else if (selectedBrand !== "default" && selectedSize === "default" && selectedColor !== "default") {
            //filter by brand and color
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}/color/${selectedColor}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }

        // selects brand and size
        else if (selectedBrand !== "default" && selectedSize !== "default" && selectedColor === "default") {
            //filter by brand and size
            const api_brand = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}/size/${selectedSize}`;
            const shoesData = (await axios.get(api_brand)).data;
            res.render('shop', {
                allShoes: shoesData,
            });
        }

        else {
            //filter by brand, size,color
            const api_brand_and_size = `https://shoes-api-o60a.onrender.com/api/shoes/brand/${selectedBrand}/size/${selectedSize}/color/${selectedColor}`;
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

app.post('/admin', async (req, res) => {
    try {
        let newShoeObject = {
            "color": req.body.color,
            "brand": req.body.brand,
            "price": Number(req.body.price),
            "size": Number(req.body.size),
            "in_stock": Number(req.body.in_stock),
            "image_url": req.body.img_url
            ,
        };


        // POST request to the external API
        const response = await axios.post('https://shoes-api-o60a.onrender.com/api/shoes', newShoeObject);
        // response from the API.
        if (response.status === 201) {
            res.redirect('/');
        } else {
            res.status(500).send('Error adding shoe: ' + response.statusText);
        }
    } catch (error) {
        res.status(500).send('Error making request: ' + error.message);
    }

});

const PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('App started at port', PORT);
});