class Supplier {
    constructor(supplier,location,contact,products,id){
        this.supplier = supplier;
        this.location = location;
        this.contact = contact;
        this.products = products;
        this.id = id;
    }

    set supplier(supplier){
        this._supplier = supplier;
    }

    get supplier(){
        return this._supplier;
    }

    set location(location){
        this._location = location;
    }

    get location(){
        return this._location;
    }

    set contact(contact){
        this._contact = contact;
    }

    get contact(){
        return this._contact;
    }

    set products(products){
        this._products = products;
    }

    get products(){
        return this._products;
    }

    set id(id){
        this._id = id;
    }

    get id(){
        return this._id;
    }
}

module.exports = Supplier;