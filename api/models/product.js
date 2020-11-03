class Product {
    constructor(product,sku,price){
        this.product = product;
        this.sku = sku;
        this.price = price;
    }

    set product(product){
        this._product = product;
    }

    get product(){
        return this._product;
    }

    set sku(sku){
        this._sku = sku;
    }

    get sku(){
        return this._sku;
    }

    set price(price){
        this._price = price;
    }

    get price(){
        return this._price;
    }
}

module.exports = Product;