
const express = require('express')
const app = express()
const morgan = require('morgan')
var bodyParser = require('body-parser')
const fs = require('fs')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('tiny'))
app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.send(`welcome to home page`)
})

app.get('/products',(req,res) => {
    let products = JSON.parse(fs.readFileSync("Products.json").toString())
let productTitles = products.map((p) => {
    return {id:p.id,title:p.title,price:p.price}
})
res.send(productTitles)
})

app.get('/products/:id',(req,res) => {
    let products = JSON.parse(fs.readFileSync("Products.json").toString())
     let singleProd = products.filter((p) => {
        return p.id == req.params.id
     })   
     if(singleProd.length === 0){
        res.send('resource not found')
     } else{
        res.send(singleProd)
     }
})
app.post('/products', (req, res) => {
    let products = JSON.parse(fs.readFileSync("Products.json").toString());
    let newProd = {
        id: products.length + 1,
        title: req.body.title,
        price: req.body.price
    };
    products.push(newProd);
    fs.writeFile('Products.json', JSON.stringify(products, null, 2), function (err) {
        if (err) {
            console.log(err.message);
            res.status(500).send('Error writing to file');
        } else {
            console.log('Product added');
            res.status(201).send(newProd);
        }
    });
});
app.put('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync("Products.json").toString());
    let index = products.findIndex((p) => {
        return p.id == req.params.id;
    });

    if (index === -1) {
        return res.status(404).send('Resource not found');
    }

    products[index].title = req.body.title || products[index].title;
    products[index].price = req.body.price || products[index].price;

    fs.writeFile('Products.json', JSON.stringify(products, null, 2), function (err) {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Error writing to file');
        }
        res.send(products[index]);
    });
});
app.delete('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync("Products.json").toString());
    let index = products.findIndex((p) => {
        return p.id == req.params.id;
    });

    if (index === -1) {
        return res.status(404).send('Resource not found');
    }

    products.splice(index, 1);

    fs.writeFile('Products.json', JSON.stringify(products, null, 2), function (err) {
        if (err) {
            console.log(err.message);
            return res.status(500).send('Error writing to file');
        }
        res.send(products);
    });
});

const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})