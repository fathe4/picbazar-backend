const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId
require('dotenv').config();
const port = process.env.PORT || 5001

// DB_USER=bicycleDB
// DB_PASS=bicycleDB321


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wanl6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnat7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("picbazar");
        const picBazarProductsCollection = database.collection("products");
        const picbazarOrdersCollection = database.collection("orders");

        // ADD PRODUCT
        app.post('/dashboard/addProduct', async (req, res) => {
            const productDetail = req.body
            console.log('hitting add product', req.body);
            const result = await picBazarProductsCollection.insertOne(productDetail)
            res.json(result)

        })



        // DISPLAY PRODUCTS
        app.get('/products', async (req, res) => {

            const cursor = picBazarProductsCollection.find({});
            const result = await cursor.toArray()
            res.json(result)

        })


        // ADD ORDERS
        app.post('/dashboard/orders', async (req, res) => {
            const productDetail = req.body
            const result = await picbazarOrdersCollection.insertOne(productDetail)
            res.json(result)
            console.log('hitting dbbbbb picbazazr', productDetail);
        })
        // DISPLAY ORDERS
        app.get('/dashboard/orders', async (req, res) => {
            const order = req.query
            const cursor = picbazarOrdersCollection.find(order);
            const result = await cursor.toArray()
            res.json(result)


        })

        // UPDATE STATUS
        app.put('/dashboard/orders/:id', async (req, res) => {
            const id = req.params.id
            const updateStatus = req.body

            const filter = { _id: objectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus.status
                },
            };
            const result = await picbazarOrdersCollection.updateOne(filter, updateDoc, options);
            res.json(result)

        })

        // DELETE ORDER
        app.delete('/dashboard/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await bicycleOrdersCollection.deleteOne(query)
            res.json(result)

        })
        // DELETE PRODUCT
        app.delete('/dashboard/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await picBazarProductsCollection.deleteOne(query)
            res.json(result)
            console.log(result);
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



// MIDDLEWARE
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})