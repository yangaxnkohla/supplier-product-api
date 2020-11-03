const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = __dirname + "/api/db/suppliers.json";
const Supplier = require(__dirname + "/api/models/supplier.js");
const Product = require(__dirname + "/api/models/product.js");

const utils = require(__dirname + "/api/utils/utils.js");

// GET e.g.: http://localhost:8888/suppliers
app.get('/suppliers', (req, res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) throw new Error("*** An error occured..." + err);
        // convert from JSON to JS Object
        let dataObj = JSON.parse(data);
        let numSuppliers = dataObj.contents.suppliers.length;
        
        if (numSuppliers == 0) {
            res.end("There are no suppliers added at the moment");
        } else {
            // get all the suppliers in the db
            console.log("===> Getting all the suppliers...");
            console.log(data);
            res.end(data);
        }
    });
});

// POST e.g.: http://localhost:8888/addSupplier?name=test&location=test&contact=123
app.post('/addSupplier', (req, res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) throw new Error("*** An error occured..." + err);
        // convert from JSON to JS Object
        let dataObj = JSON.parse(data);
        // create Supplier object
        let id = Math.floor(1 + Math.random() * 1024);
        let supplierObj = new Supplier(req.query.name, req.query.location, req.query.contact, [], id);
        // check if the supplier exists
        let supplierExists = utils.entityExists(dataObj.contents.suppliers, '_supplier', supplierObj.supplier);
        
        if (supplierExists.exists) {
            res.end("The supplier already exists");
        } else {
            // add supplier to list of suppliers in dataObj
            console.log("===> Adding supplier...");
            dataObj.contents.suppliers.push(supplierObj);
            // convert dataObj to JSON and write to db file
            let dataJSON = utils.writeToDB(dataObj, fs, db);
            res.end(dataJSON);
        }
    });
});

// POST e.g.: http://localhost:8888/test123/addProduct?name=test&sku=test&price=123
app.post('/:supplier/addProduct', (req, res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) throw new Error("*** An error occured..." + err);
        // convert from JSON to JS Object
        let dataObj = JSON.parse(data);
        // create Product object
        let productObj = new Product(req.query.name, req.query.sku, req.query.price);
        let supplierStr = req.params.supplier;
        // check if the supplier exists
        let supplierExists = utils.entityExists(dataObj.contents.suppliers, '_supplier', supplierStr);
        // check if the product is already in the db
        let productExists = { exists: false, index: -1 };
        
        if (supplierExists.exists) {
            let index = supplierExists.index;
            productExists = utils.entityExists(dataObj.contents.suppliers[index]._products, '_product', productObj.product);
        }
        
        if (!supplierExists.exists) {
            res.end("The supplier does not exist");
        } else if (productExists.exists) {
            res.end("The product already exists");
        } else {
            let numSuppliers = dataObj.contents.suppliers.length;
            for (let i = 0; i < numSuppliers; i++) {
                let curSupplier = dataObj.contents.suppliers[i]._supplier;
                // find the supplier to add the product to
                if (curSupplier == supplierStr) {
                    // add product to list of products for supplier found in dataObj
                    console.log("===> Adding product...");
                    dataObj.contents.suppliers[i]._products.push(productObj);
                    // convert dataObj to JSON and write to db file
                    let dataJSON = utils.writeToDB(dataObj, fs, db);
                    res.end(dataJSON);
                    break;
                }
            }
        }
    });
});

// DELETE e.g.: http://localhost:8888/deleteSupplier?name=test123
app.delete('/deleteSupplier', (req, res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) throw new Error("*** An error occured..." + err);
        // convert from JSON to JS Object
        let dataObj = JSON.parse(data);
        let supplierStr = req.query.name;
        let numSuppliers = dataObj.contents.suppliers.length;
        // check if the supplier exists
        let supplierExists = utils.entityExists(dataObj.contents.suppliers, '_supplier', supplierStr);
        
        if (!supplierExists.exists) {
            res.send("The supplier does not exist");
        } else {
            for (let i = 0; i < numSuppliers; i++) {
                let curSupplier = dataObj.contents.suppliers[i]._supplier;
                if (curSupplier == supplierStr) {
                    // delete supplier from list of suppliers in dataObj
                    console.log("===> Deleting supplier...");
                    dataObj.contents.suppliers.splice(i, 1);
                    break;
                }
            }
            // convert dataObj to JSON and write to db file
            let dataJSON = utils.writeToDB(dataObj, fs, db);
            res.end(dataJSON);
        }
    });
});

// DELETE e.g.: http://localhost:8888/test123/deleteProduct?name=test123
app.delete('/:supplier/deleteProduct', (req, res) => {
    fs.readFile(db, 'utf8', (err, data) => {
        if (err) throw new Error("*** An error occured..." + err);
        // convert from JSON to JS Object
        let dataObj = JSON.parse(data);
        let supplierStr = req.params.supplier;
        let productStr = req.query.name;
        // check if the supplier exists
        let supplierExists = utils.entityExists(dataObj.contents.suppliers, '_supplier', supplierStr);
        // check if the product is already in the db
        let productExists = { exists: false, index: -1 };
        
        if (supplierExists.exists) {
            let index = supplierExists.index;
            productExists = utils.entityExists(dataObj.contents.suppliers[index]._products, '_product', productStr);
        }
        
        if (!supplierExists.exists) {
            res.send("The supplier does not exist");
        } else if (!productExists.exists) {
            res.end("The product does not exist");
        } else {
            let deleted = false;
            let numSuppliers = dataObj.contents.suppliers.length;
            for (let i = 0; i < numSuppliers; i++) {
                let curSupplier = dataObj.contents.suppliers[i]._supplier;
                let numProducts = dataObj.contents.suppliers[i]._products.length;
                if (curSupplier == supplierStr) {
                    for (let j = 0; j < numProducts; j++) {
                        let curProduct = dataObj.contents.suppliers[i]._products[j]._product;
                        if (curProduct == productStr) {
                            // delete product from list of products for supplier found in dataObj
                            console.log("===> Deleting product...");
                            dataObj.contents.suppliers[i]._products.splice(j, 1);
                            deleted = true;
                            break;
                        }
                    }
                }
                
                if (deleted) {
                    // convert dataObj to JSON and write to db file
                    let dataJSON = utils.writeToDB(dataObj, fs, db);
                    res.end(dataJSON);
                    break;
                }
            }
        }
    });
});

const server = app.listen(8888, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Server started at http://%s:%s", host, port);
});

module.exports = app;