const supertest = require('supertest');
const app = require('../../server');

describe("View Suppliers and Products", () => {
    it("View all the suppliers", async () => {
        const response = await supertest(app).get('/suppliers');
        expect(response.status).toBe(200);
    });

    it("View a specific supplier", async () => {
        const response = await supertest(app).get('/suppliers/takealot');
        expect(response.status).toBe(200);
    });

    it("View a specific product", async () => {
        const response = await supertest(app).get('/takealot/Redbull');
        expect(response.status).toBe(200);
    });
});

describe("Add Suppliers and Products", () => {
    it("Add supplier", async () => {
        const response = await supertest(app).post('/addSupplier?name=Hogwarts&location=Scottish Highlands&contact=wizards@hogwarts.com');
        expect(response.status).toBe(200);
    });

    it("Add product", async () => {
        const response = await supertest(app).post('/takealot/addProduct?name=Pillow&sku=Z123321&price=247365');
        expect(response.status).toBe(200);
    });
});

describe("Delete Suppliers and Products", () => {
    it("Delete supplier", async () => {
        const response = await supertest(app).delete('/deleteSupplier?name=Hogwarts');
        expect(response.status).toBe(200);
    });

    it("Delete product", async () => {
        const response = await supertest(app).delete('/takealot/deleteProduct?name=Pillow');
        expect(response.status).toBe(200);
    });
});